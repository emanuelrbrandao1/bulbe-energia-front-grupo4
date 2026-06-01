// ===== CONFIGURAÇÃO DA API =====
const API = 'http://localhost:3000/api/v1';

// ===== CONTROLE DOS CARROSSÉIS =====
let indices = [0, 0, 0, 0, 0];
const produtoWidth = 176; // 160px + 16px de gap

let startX = 0;
let currentX = 0;
let isDragging = false;

// ===== UTILITÁRIOS =====
function getToken() {
    return localStorage.getItem('token');
}

function formatarPreco(valor) {
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

function calcularPrecoComDesconto(preco, desconto) {
    if (!desconto || desconto <= 0) return preco;
    return preco * (1 - desconto / 100);
}

function mostrarErroCarrossel(trackId, mensagem) {
    const track = document.getElementById(trackId);
    if (track) {
        track.innerHTML = `<p style="padding: 20px; color: #888;">${mensagem}</p>`;
    }
}

// ===== RENDERIZAR PRODUTOS NOS CARROSSÉIS =====
function criarCardProduto(produto) {
    const precoFinal = calcularPrecoComDesconto(produto.preco, produto.desconto);
    const precoFormatado = formatarPreco(precoFinal);
    const precoAntigoHTML = produto.desconto > 0
        ? `<span class="preco-antigo">${formatarPreco(produto.preco)}</span>`
        : '';
    const estrelasCompletas = Math.floor(produto.avaliacao);
    const estrelas = '★'.repeat(estrelasCompletas) + '☆'.repeat(5 - estrelasCompletas);
    const totalAvaliacoes = produto.total_avaliacoes ?? produto.totalAvaliacoes ?? 0;

    return `
        <a href="../PRODUTO/produto.html?id=${produto.id}" class="produto-card">
            <div class="produto-imagem">
                <img src="../${produto.imagem}" alt="${produto.nome}" onerror="this.src='../assets/images/placeholder.png'">
            </div>
            <div class="produto-info">
                <h3 class="produto-nome">${produto.nome}</h3>
                <div class="produto-preco-wrapper">
                    <span class="preco-atual">${precoFormatado}</span>
                    ${precoAntigoHTML}
                </div>
                <div class="produto-avaliacao">
                    <span class="estrelas">${estrelas}</span>
                    <span class="avaliacoes">(${totalAvaliacoes})</span>
                </div>
            </div>
            <button class="btn-adicionar" onclick="event.preventDefault(); adicionarAoCarrinho(${produto.id})" aria-label="Adicionar ao carrinho">
                <span class="btn-icon">+</span>
                <span class="btn-text">Adicionar</span>
            </button>
        </a>
    `;
}

function preencherCarrossel(trackId, produtos) {
    const track = document.getElementById(trackId);
    if (!track) {
        console.error(`Carrossel ${trackId} não encontrado!`);
        return;
    }
    track.innerHTML = '';
    produtos.forEach(produto => {
        track.innerHTML += criarCardProduto(produto);
    });
}

// ===== FETCH DA API =====
async function fetchPorCategoria(categoria) {
    const resposta = await fetch(`${API}/produtos?categoria=${categoria}`);
    if (!resposta.ok) throw new Error(`Falha ao buscar ${categoria}.`);
    return resposta.json();
}

// ===== ADICIONAR AO CARRINHO =====
async function adicionarAoCarrinho(idProduto) {
    const token = getToken();
    if (!token) {
        window.location.href = '../LOGIN/login.html';
        return;
    }

    const resposta = await fetch(`${API}/carrinho/itens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ produtoId: idProduto, quantidade: 1 }),
    });

    if (resposta.status === 401) {
        window.location.href = '../LOGIN/login.html';
        return;
    }

    if (!resposta.ok) {
        alert('Erro ao adicionar ao carrinho. Tente novamente.');
        return;
    }

    atualizarContadorCarrinho();
}

// ===== CONTADOR DO CARRINHO =====
function atualizarContadorCarrinho() {
    const badge = document.getElementById('carrinho-contador');
    if (!badge) return;
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    badge.textContent = totalItens;
    badge.style.display = totalItens > 0 ? 'flex' : 'none';
}

// ===== INICIALIZAÇÃO DA PÁGINA =====
document.addEventListener('DOMContentLoaded', async function () {
    const categorias = [
        { trackId: 'carrosselTrack1', categoria: 'lampadas',   erro: 'Não foi possível carregar as lâmpadas.' },
        { trackId: 'carrosselTrack2', categoria: 'luminarias', erro: 'Não foi possível carregar as luminárias.' },
        { trackId: 'carrosselTrack3', categoria: 'fitas',      erro: 'Não foi possível carregar as fitas LED.' },
        { trackId: 'carrosselTrack4', categoria: 'acessorios', erro: 'Não foi possível carregar os acessórios.' },
        { trackId: 'carrosselTrack5', categoria: 'assistentes',erro: 'Não foi possível carregar os assistentes.' },
    ];

    for (const { trackId, categoria, erro } of categorias) {
        try {
            const produtos = await fetchPorCategoria(categoria);
            preencherCarrossel(trackId, produtos);
        } catch {
            mostrarErroCarrossel(trackId, erro);
        }
    }

    categorias.forEach(({ trackId }, i) => inicializarCarrossel(trackId, i));

    atualizarContadorCarrinho();
});

// ===== CONTROLE DE ARRASTAR OS CARROSSÉIS =====
function inicializarCarrossel(trackId, carrosselIndex) {
    const track = document.getElementById(trackId);
    const container = track.parentElement;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        track.style.transition = 'none';
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const currentTranslate = -indices[carrosselIndex] * produtoWidth;
        track.style.transform = `translateX(${currentTranslate + diff}px)`;
    });

    container.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const diff = currentX - startX;
        const threshold = 50;
        track.style.transition = 'transform 0.3s ease';
        if (diff > threshold) {
            moverCarrossel(-1, trackId, carrosselIndex);
        } else if (diff < -threshold) {
            moverCarrossel(1, trackId, carrosselIndex);
        } else {
            track.style.transform = `translateX(-${indices[carrosselIndex] * produtoWidth}px)`;
        }
    });
}

function moverCarrossel(direcao, trackId, carrosselIndex) {
    const track = document.getElementById(trackId);
    const totalProdutos = track.children.length;
    const maxIndex = totalProdutos - 2;

    indices[carrosselIndex] += direcao;

    if (indices[carrosselIndex] < 0) indices[carrosselIndex] = 0;
    if (indices[carrosselIndex] > maxIndex) indices[carrosselIndex] = maxIndex;

    track.style.transform = `translateX(-${indices[carrosselIndex] * produtoWidth}px)`;
}
