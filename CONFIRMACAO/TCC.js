// CONFIRMACAO/TCC.js
// Integracao com a API Bulbe Energia (Sprint 4 - Aula 12).
// Ao carregar a pagina, confirma o pedido via POST /api/v1/pedidos usando
// os dados temporarios deixados pelas etapas anteriores (endereco/pagamento)
// no localStorage. Em seguida, busca recomendacoes para essa tela.

const API_BASE = 'http://localhost:3000/api/v1';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../LOGIN/login.html';
    return;
  }

  const enderecoEntrega  = lerJson('bulbe_endereco_entrega');
  const formaEntrega     = localStorage.getItem('bulbe_forma_entrega');
  const metodoPagamento  = localStorage.getItem('bulbe_metodo_pagamento');

  if (!enderecoEntrega || !formaEntrega || !metodoPagamento) {
    mostrarErro('Faltam dados do pedido. Volte e complete as etapas de endereco e pagamento.');
    return;
  }

  try {
    const pedido = await confirmarPedido(token, { enderecoEntrega, formaEntrega, metodoPagamento });
    renderizarResumoPedido(pedido);
    limparDadosTemporarios();
    await carregarRecomendacoes(token, pedido.pedidoId);
  } catch (erro) {
    if (erro.status === 401) {
      window.location.href = '../LOGIN/login.html';
      return;
    }
    mostrarErro(erro.message);
  }
});

// ── Chamadas a API ────────────────────────────────────────────────────────────

async function confirmarPedido(token, payload) {
  const resposta = await fetch(`${API_BASE}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const dados = await resposta.json();
  if (!resposta.ok) {
    const erro = new Error(dados.erro || 'Falha ao confirmar pedido.');
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
    if (!resposta.ok) return; // recomendacoes sao bonus; nao quebra a tela se falhar
    const produtos = await resposta.json();
    produtos.forEach((p) => {
      container.innerHTML += criarCardProduto(p);
    });
  } catch (_) {
    // silencioso de proposito
  }
}

// ── DOM / render ──────────────────────────────────────────────────────────────

function renderizarResumoPedido(pedido) {
  const titulo = document.querySelector('.titulo-sucesso');
  if (titulo) titulo.textContent = `Pedido #${pedido.pedidoId} Confirmado!`;

  const secao = document.querySelector('.secao-confirmacao');
  if (!secao) return;

  const valorTotalFormatado = `R$ ${Number(pedido.valorTotal).toFixed(2).replace('.', ',')}`;
  const linhasItens = pedido.itens.map((item) => {
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
    <ul class="resumo-itens">${linhasItens}</ul>
    <div class="resumo-total"><strong>Total</strong><span>${valorTotalFormatado}</span></div>
    <div class="resumo-status">Status: <strong>${escaparHtml(pedido.status)}</strong></div>
  `;
  secao.appendChild(resumo);
}

function mostrarErro(mensagem) {
  const titulo = document.querySelector('.titulo-sucesso');
  const subtitulo = document.querySelector('.subtitulo-sucesso');
  const icone = document.querySelector('.icone-sucesso');
  if (titulo) titulo.textContent = 'Ops! Nao deu pra confirmar.';
  if (subtitulo) {
    subtitulo.textContent = mensagem;
    subtitulo.classList.add('mensagem-erro');
  }
  if (icone) icone.style.display = 'none';
}

// ── Utilitarios ───────────────────────────────────────────────────────────────

function lerJson(chave) {
  try { return JSON.parse(localStorage.getItem(chave)); }
  catch { return null; }
}

function limparDadosTemporarios() {
  localStorage.removeItem('bulbe_endereco_entrega');
  localStorage.removeItem('bulbe_forma_entrega');
  localStorage.removeItem('bulbe_metodo_pagamento');
}

function escaparHtml(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}
