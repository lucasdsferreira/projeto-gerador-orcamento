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

// Função principal de cálculo
function calculateTotal() {
  const serviceValue = parseInt(service.value, 10);
  const pagesValue = parseInt(pages.value, 10) || 1;
  const baseDays = parseInt(service.selectedOptions[0].dataset.days, 10);

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

  // Arrendonda o valor total
  total = Math.round(total);

  // Atualiza o total na tela
  totalElement.textContent = total;

  summaryElement.textContent = `Cliente: ${clientName.value || '-'} | Projeto: ${projectName.value || '-'} | Serviço: ${service.options[service.selectedIndex].text} | Páginas: ${pagesValue} | Requisições: ${requirements.value || '-'}`;

  deadlineElement.textContent = `Prazo estimado: ${days} dias`;
}

// Evento do botão calcular
calculateBtn.addEventListener('click', calculateTotal);

// Copiar orçamento
copyBtn.addEventListener('click', () => {
  const text = `Cliente: ${clientName.value}Projeto: ${projectName.value} Requisições:
${requirements.value} Total: R$ ${totalElement.textContent} ${deadlineElement.textContent}`;
  navigator.clipboard.writeText(text);
  alert('Orçamento copiado!');
});
