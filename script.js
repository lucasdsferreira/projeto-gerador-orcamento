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
    prazo: customDeadline.value
      ? parseInt(customDeadline.value, 10)
      : null,
    total: parseFloat(totalElement.textContent) || 0,
    data: new Date().toISOString()
  };

  console.log("Orçamento gerado:", orcamento);

  return orcamento;
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
  alert("Orçamento gerado com sucesso!");
});
