// ===== PRODUTO.JS - PÁGINA DE DETALHES DO PRODUTO =====

const API = 'http://localhost:3000/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

function redirecionarSeNaoLogado() {
  if (!getToken()) {
    window.location.href = '../LOGIN/login.html';
  }
}

// ===== CONTROLE DE QUANTIDADE =====
const diminuir = document.getElementById('diminuir');
const aumentar = document.getElementById('aumentar');
const quantidade = document.getElementById('quantidade');

let valor = 1;

diminuir.addEventListener('click', () => {
  if (valor > 1) {
    valor--;
    quantidade.textContent = valor;
  }
});

aumentar.addEventListener('click', () => {
  valor++;
  quantidade.textContent = valor;
});

// ===== CARROSSEL =====
let imagens = [];
let indice = 0;

const anterior = document.querySelector('.btn-anterior');
const proximo = document.querySelector('.btn-proximo');

function mostrarImagem(novoIndice) {
  if (imagens.length === 0) return;
  imagens[indice].classList.remove('ativo');
  indice = (novoIndice + imagens.length) % imagens.length;
  imagens[indice].classList.add('ativo');
}

anterior.addEventListener('click', () => mostrarImagem(indice - 1));
proximo.addEventListener('click', () => mostrarImagem(indice + 1));

// ===== TOAST "COPIADO" =====
function mostrarToastCopiado() {
  const toast = document.createElement('div');
  toast.className = 'toast-copiado';
  toast.textContent = 'Link copiado!';
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('ativo'), 50);
  setTimeout(() => {
    toast.classList.remove('ativo');
    setTimeout(() => toast.remove(), 300);
  }, 1500);
}

function copiarLinkPagina() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => mostrarToastCopiado())
    .catch(() => console.error('Erro ao copiar link'));
}

// ===== FAVORITOS (API real) =====
async function toggleFavorito() {
  redirecionarSeNaoLogado();

  const idProduto = parseInt(new URLSearchParams(window.location.search).get('id'));
  if (!idProduto) return;

  const img = document.querySelector('.coracao');
  img.classList.add('animando');

  try {
    const resposta = await fetch(`${API}/favoritos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ produtoId: idProduto }),
    });

    if (resposta.status === 401) {
      window.location.href = '../LOGIN/login.html';
      return;
    }

    // toggle visual baseado no estado atual da imagem
    const estaFavorito = img.src.includes('coracao-vermelho');

    setTimeout(() => {
      img.src = estaFavorito
        ? '../assets/images/coracao.png'
        : '../assets/images/coracao-vermelho.png';
      img.classList.remove('animando');
    }, 200);

  } catch (error) {
    console.error('Erro ao favoritar:', error);
    img.classList.remove('animando');
  }
}

async function verificarFavorito() {
  const idProduto = parseInt(new URLSearchParams(window.location.search).get('id'));
  if (!idProduto || !getToken()) return;

  try {
    const resposta = await fetch(`${API}/favoritos`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (resposta.status === 401) {
      window.location.href = '../LOGIN/login.html';
      return;
    }

    const dados = await resposta.json();
    const lista = dados.favoritos || [];
    const estaFavorito = lista.some(f => f.produtoId === idProduto);
    const img = document.querySelector('.coracao');

    img.src = estaFavorito
      ? '../assets/images/coracao-vermelho.png'
      : '../assets/images/coracao.png';

  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
  }
}

// ===== CARRINHO (API real) =====
async function adicionarAoCarrinhoProduto() {
  redirecionarSeNaoLogado();

  const idProduto = parseInt(new URLSearchParams(window.location.search).get('id'));
  if (!idProduto) return;

  try {
    const resposta = await fetch(`${API}/carrinho/itens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ produtoId: idProduto, quantidade: valor }),
    });

    if (resposta.status === 401) {
      window.location.href = '../LOGIN/login.html';
      return;
    }

    valor = 1;
    quantidade.textContent = valor;

    window.location.href = '../CARRINHO/carrinho.html';

  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
  }
}

// ===== MENSAGEM DE ERRO NA TELA =====
function mostrarErroProduto(msg) {
  const titulo = document.querySelector('.produto-titulo');
  const desc   = document.querySelector('.descricao-texto');
  if (titulo) titulo.textContent = 'Ops!';
  if (desc)   desc.innerHTML = `
    <p style="color:#c0392b; margin-bottom:16px">${msg}</p>
    <a href="../HOME/home.html" style="color:#2980b9">← Voltar para a Home</a>
  `;
  // esconde seções de preço, quantidade e botões para não confundir
  ['.preco-linha', '.economia-info', '.controle-quantidade', '.btn-comprar']
    .forEach(sel => { const el = document.querySelector(sel); if (el) el.style.display = 'none'; });
}

// ===== CARREGAR PRODUTO (API real) =====
async function carregarProduto() {
  const idProduto = parseInt(new URLSearchParams(window.location.search).get('id'));

  if (!idProduto) {
    mostrarErroProduto('ID de produto inválido.');
    return;
  }

  try {
    const resposta = await fetch(`${API}/produtos/${idProduto}`);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      mostrarErroProduto(dados.erro || 'Produto não encontrado.');
      return;
    }

    const produto = await resposta.json();

    // Textos
    document.querySelector('.produto-titulo').textContent = produto.nome;
    document.querySelector('.descricao-texto').innerHTML = produto.descricao;

    // Preço
    const desconto = produto.desconto || 0;
    const precoFinal = produto.preco - desconto;

    document.querySelector('.preco-atual').textContent =
      `R$ ${precoFinal.toFixed(2).replace('.', ',')}`;

    if (desconto > 0) {
      document.querySelector('.preco-antigo').textContent =
        `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
      document.querySelector('.badge-desconto').textContent = `-${desconto}%`;
      document.querySelector('.economia-info span').textContent =
        `Você economiza R$ ${desconto.toFixed(2).replace('.', ',')} nesta compra`;
    } else {
      document.querySelector('.preco-linha').style.display = 'none';
      document.querySelector('.economia-info').style.display = 'none';
    }

    // Imagens
    const slides = document.querySelector('.slides');
    slides.innerHTML = '';

    if (produto.imagemDetalhes) {
      slides.innerHTML = `<img src="../${produto.imagemDetalhes}" class="ativo">`;
    } else {
      slides.innerHTML = `<img src="../${produto.imagem}" class="ativo">`;
    }

    imagens = document.querySelectorAll('.slides img');
    indice = 0;

    // Rating
    document.querySelector('.rating-numero').textContent = produto.avaliacao.toFixed(1);
    document.querySelector('.rating-reviews').textContent =
      `(${produto.totalAvaliacoes} avaliações)`;

  } catch (error) {
    console.error('Erro ao carregar produto:', error);
    mostrarErroProduto('Erro ao carregar o produto. Verifique sua conexão ou tente novamente.');
  }
}

// ===== EVENTOS =====
document.addEventListener('DOMContentLoaded', () => {
  carregarProduto();
  verificarFavorito();

  document.querySelector('.coracao').addEventListener('click', toggleFavorito);
  document.querySelector('.share').addEventListener('click', copiarLinkPagina);

  document.querySelectorAll('.btn-comprar')
    .forEach(btn => btn.addEventListener('click', adicionarAoCarrinhoProduto));
});