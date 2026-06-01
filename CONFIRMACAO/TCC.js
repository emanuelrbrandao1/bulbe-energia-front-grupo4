// CONFIRMACAO/TCC.js
const API_BASE = 'http://localhost:3000/api/v1';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../LOGIN/login.html';
    return;
  }

  const pedidoId = new URLSearchParams(window.location.search).get('pedidoId');
  if (!pedidoId) {
    mostrarErro('Pedido não identificado. Volte ao início.');
    return;
  }

  try {
    const pedido = await buscarPedido(token, pedidoId);
    renderizarResumoPedido(pedido);
    await carregarRecomendacoes(token, pedidoId);
  } catch (erro) {
    if (erro.status === 401) {
      window.location.href = '../LOGIN/login.html';
      return;
    }
    mostrarErro(erro.message);
  }
});

// ── Chamadas à API ────────────────────────────────────────────────────────────

async function buscarPedido(token, pedidoId) {
  const resposta = await fetch(`${API_BASE}/pedidos/${pedidoId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  const dados = await resposta.json();
  if (!resposta.ok) {
    const erro = new Error(dados.erro || 'Falha ao buscar pedido.');
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}

async function carregarRecomendacoes(token, pedidoId) {
  const container = document.getElementById('recomendacoesContainer');
  if (!container) return;

  try {
    const resposta = await fetch(`${API_BASE}/produtos/recomendacoes?pedidoId=${pedidoId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!resposta.ok) return;
    const produtos = await resposta.json();
    produtos.forEach((p) => {
      container.innerHTML += criarCardProduto(p);
    });
  } catch (_) {
    // silencioso de propósito — recomendações são bônus
  }
}

// ── DOM / render ──────────────────────────────────────────────────────────────

function renderizarResumoPedido(pedido) {
  const titulo = document.querySelector('.titulo-sucesso');
  if (titulo) titulo.textContent = `Pedido #${pedido.pedidoId} Confirmado!`;

  const secao = document.querySelector('.secao-confirmacao');
  if (!secao) return;

  const valorTotalFormatado = `R$ ${Number(pedido.valorTotal).toFixed(2).replace('.', ',')}`;

  const itens = pedido.itens || [];
  const linhasItens = itens.map((item) => {
    const subtotal = (item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',');
    return `
      <li class="resumo-item">
        <span class="resumo-item-nome">${escaparHtml(item.nome)} <small>x ${item.quantidade}</small></span>
        <span class="resumo-item-valor">R$ ${subtotal}</span>
      </li>`;
  }).join('');

  const resumo = document.createElement('div');
  resumo.className = 'resumo-pedido';
  resumo.innerHTML = `
    <h3 class="resumo-pedido-titulo">Resumo do pedido</h3>
    ${itens.length ? `<ul class="resumo-itens">${linhasItens}</ul>` : ''}
    <div class="resumo-total"><strong>Total</strong><span>${valorTotalFormatado}</span></div>
    <div class="resumo-status">Status: <strong>${escaparHtml(pedido.status)}</strong></div>
    ${pedido.formaEntrega    ? `<div class="resumo-entrega">Entrega: <strong>${escaparHtml(pedido.formaEntrega)}</strong></div>`       : ''}
    ${pedido.metodoPagamento ? `<div class="resumo-pagamento">Pagamento: <strong>${escaparHtml(pedido.metodoPagamento)}</strong></div>` : ''}
  `;
  secao.appendChild(resumo);
}

function mostrarErro(mensagem) {
  const titulo    = document.querySelector('.titulo-sucesso');
  const subtitulo = document.querySelector('.subtitulo-sucesso');
  const icone     = document.querySelector('.icone-sucesso');
  if (titulo)    titulo.textContent = 'Ops! Não deu pra confirmar.';
  if (subtitulo) { subtitulo.textContent = mensagem; subtitulo.classList.add('mensagem-erro'); }
  if (icone)     icone.style.display = 'none';
}

// ── Utilitários ───────────────────────────────────────────────────────────────

function escaparHtml(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}
