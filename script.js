// Elementos usados no cálculo
const clientName = document.getElementById('clientName');
const projectName = document.getElementById('projectName');
const requirements = document.getElementById('requirements');

const service = document.getElementById('service');
const pages = document.getElementById('pages');
const customDeadline = document.getElementById('customDeadline');

const seo = document.getElementById('seo');
const whatsapp = document.getElementById('whatsapp');
const hosting = document.getElementById('hosting');
const maintenance = document.getElementById('maintenance');
const urgent = document.getElementById('urgent');

const totalElement = document.getElementById('total');
const summaryElement = document.getElementById('summary');
const deadlineElement = document.getElementById('deadline');

const calculateBtn = document.getElementById('calculate');
const copyBtn = document.getElementById('copy');
const generateBtn = document.getElementById('generate');

const budgetList = document.getElementById('budgetList');
const orderBy = document.getElementById('orderBy');

// Função para pegar orçamentos salvos
function obterOrcamentos() {
  const dados = localStorage.getItem('orcamentos');
  return dados ? JSON.parse(dados) : [];
}

// Função para salvar lista de orçamentos
function salvarOrcamentos(lista) {
  localStorage.setItem('orcamentos', JSON.stringify(lista));
}

// Função para salvar novo orçamento
function salvarNovoOrcamento(orcamento) {
  const lista = obterOrcamentos();
  lista.push(orcamento);
  salvarOrcamentos(lista);
}

// Função principal de cálculo
function calculateTotal() {
  const serviceValue = parseInt(service.value, 10) || 0;
  const pagesValue = parseInt(pages.value, 10) || 1;

  const baseDays = parseInt(
    service.selectedOptions[0].dataset.days,
    10
  ) || 0;

  let total = serviceValue;
  let days = baseDays;

  // Páginas extras
  if (pagesValue > 1) {
    total += (pagesValue - 1) * 100;
    days += pagesValue - 1;
  }

  // Adicionais
  if (seo.checked) total += 150;
  if (whatsapp.checked) total += 50;
  if (hosting.checked) total += 100;
  if (maintenance.checked) total += 120;
  if (urgent.checked) total *= 1.2;

  // Prazo customizado pelo cliente
  if (customDeadline.value) {
    days = parseInt(customDeadline.value, 10);
  }

  // Arredonda o valor total
  total = Math.round(total);

  // Atualiza o total na tela
  totalElement.textContent = total;

  summaryElement.textContent =
    `Cliente: ${clientName.value || '-'} | ` +
    `Projeto: ${projectName.value || '-'} | ` +
    `Serviço: ${service.options[service.selectedIndex].text} | ` +
    `Páginas: ${pagesValue} | ` +
    `Requisições: ${requirements.value || '-'}`;

  deadlineElement.textContent = `Prazo estimado: ${days} dias`;
}

// Função para criar objeto orçamento
function criarOrcamento() {
  const id = Date.now().toString();

  const hoje = new Date();

  const diasPrazo = customDeadline.value
    ? parseInt(customDeadline.value, 10)
    : 0;

  const dataEntrega = new Date(hoje);
  dataEntrega.setDate(hoje.getDate() + diasPrazo);

  const adicionais = [];
  if (seo.checked) adicionais.push("SEO Básico");
  if (whatsapp.checked) adicionais.push("Integração WhatsApp");
  if (hosting.checked) adicionais.push("Hospedagem");
  if (maintenance.checked) adicionais.push("Manutenção");
  if (urgent.checked) adicionais.push("Urgente");

  const orcamento = {
    id: id,
    cliente: clientName.value || "Não informado",
    projeto: projectName.value || "Não informado",
    servico: service.options[service.selectedIndex].text,
    paginas: parseInt(pages.value, 10) || 1,
    adicionais: adicionais,
    prazo: diasPrazo,
    total: parseFloat(totalElement.textContent) || 0,
    dataCriacao: hoje.toISOString(),
    dataEntrega: dataEntrega.toISOString()
  };

  console.log("Orçamento gerado:", orcamento);

  return orcamento;
}

function listarOrcamentos() {
  let lista = obterOrcamentos();

  // Ordernação
  const criterio = orderBy.value;

  if (criterio === 'date') {
    lista.sort((a, b) => new Date(b.data) - new Date(a.data));
  }

  if (criterio === 'client') {
    lista.sort((a, b) => a.cliente.localeCompare(b.cliente));
  }

  if (criterio === 'service') {
    lista.sort((a, b) => a.servico.localeCompare(b.servico));
  }

  // Limpa a lista
  budgetList.innerHTML = '';

  // Renderiza cada orçamento
  lista.forEach((orcamento) => {
    const div = document.createElement('div');
    div.classList.add('budget-item');

    div.innerHTML = `<strong>${orcamento.cliente}</strong><br>
    Projeto: ${orcamento.projeto}<br>
    Serviço: ${orcamento.servico}<br>
    Total: R$ ${orcamento.total}<br>
    Entrega: ${new Date(orcamento.dataEntrega).toLocaleDateString()}`;

    budgetList.appendChild(div);
  });
}

// Evento do botão calcular
calculateBtn.addEventListener('click', calculateTotal);

// Copiar orçamento
copyBtn.addEventListener('click', () => {
  const text =
    `Cliente: ${clientName.value}\n` +
    `Projeto: ${projectName.value}\n` +
    `Requisições: ${requirements.value}\n` +
    `Total: R$ ${totalElement.textContent}\n` +
    `${deadlineElement.textContent}`;

  navigator.clipboard.writeText(text);
  alert('Orçamento copiado!');
});

// Gerar orçamento
generateBtn.addEventListener('click', () => {
  const novoOrcamento = criarOrcamento();
  salvarNovoOrcamento(novoOrcamento);
  listarOrcamentos();
  alert("Orçamento gerado com sucesso!");
});

orderBy.addEventListener('change', listarOrcamentos);

listarOrcamentos();
