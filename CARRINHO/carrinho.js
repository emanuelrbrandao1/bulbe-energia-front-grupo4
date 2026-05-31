// CARRINHO.JS - GERENCIAMENTO DO CARRINHO (integrado com API)

const API = 'http://localhost:3000/api/v1';

function getToken() {
    return localStorage.getItem('token');
}

function redirecionarSeNaoLogado() {
    if (!getToken()) {
        window.location.href = '../LOGIN/login.html';
    }
}

function formatarPreco(valor) {
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

async function fetchCarrinho() {
    const resposta = await fetch(`${API}/carrinho`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (resposta.status === 401) {
        window.location.href = '../LOGIN/login.html';
        return null;
    }

    if (!resposta.ok) {
        throw new Error('Falha ao buscar carrinho.');
    }

    return resposta.json();
}

function renderizarCarrinho(dados) {
    const container = document.querySelector('.lista-produtos');
    const itens = dados.itens || [];

    if (itens.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <img src="../assets/images/carrinho-cinza.png" alt="Carrinho vazio" style="width: 150px; opacity: 0.5; margin-bottom: 20px;">
                <h2 style="color: var(--C700); font-size: 20px; margin-bottom: 10px;">Seu carrinho está vazio</h2>
                <p style="color: var(--C500); margin-bottom: 20px;">Adicione produtos para começar suas compras!</p>
                <a href="../HOME/home.html" style="background-color: var(--AU700); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Ver Produtos</a>
            </div>
        `;
        atualizarResumo({ subtotal: 0, totalDesconto: 0, valorFinal: 0, vazio: true });
        return;
    }

    container.innerHTML = '';

    itens.forEach(item => {
        // A API retorna 'preco' (unitário); precoTotal calculado no cliente
        const precoUnitario = item.precoUnitario ?? item.preco ?? 0;
        const precoTotal = item.precoTotal ?? (precoUnitario * item.quantidade);
        const imagemSrc = item.imagem || '../assets/images/img-produto-carrinho.png';

        container.innerHTML += `
            <article class="caixaproduto" data-id="${item.produtoId}">
                <div class="produto-imagem">
                    <img src="${imagemSrc}" alt="${item.nome}" onerror="this.src='../assets/images/img-produto-carrinho.png'">
                </div>
                <div class="produto-info">
                    <div class="info-header">
                        <h2 class="produto-nome">${item.nome}</h2>
                    </div>
                    <div class="produto-footer">
                        <div class="controle-quantidade">
                            <button class="btn-controle remover" onclick="diminuirQuantidade(${item.produtoId}, ${item.quantidade})" aria-label="Diminuir quantidade">
                                <img src="../assets/images/lixo.png" alt="">
                            </button>
                            <span class="quantidade">${item.quantidade}</span>
                            <button class="btn-controle adicionar" onclick="aumentarQuantidade(${item.produtoId}, ${item.quantidade})" aria-label="Aumentar quantidade">+</button>
                        </div>
                        <div class="preco-container">
                            <span class="preco">${formatarPreco(precoTotal)}</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    });

    // Usa totais da API se existirem; caso contrário calcula no cliente
    const subtotal = dados.subtotal ?? itens.reduce((acc, i) => acc + ((i.precoUnitario ?? i.preco ?? 0) * i.quantidade), 0);
    const totalDesconto = dados.totalDesconto ?? 0;
    const valorFinal = dados.valorFinal ?? (subtotal - totalDesconto);
    atualizarResumo({ subtotal, totalDesconto, valorFinal, vazio: false });
}

function atualizarResumo({ subtotal, totalDesconto, valorFinal, vazio }) {
    const resumo = document.querySelector('.resumo-pedido');
    const botaoFinalizar = document.querySelector('.container-botao');
    const botaoLimpar = document.querySelector('.container-botao2');

    const subtotalEl = document.querySelector('.linhas-resumo .linha-item:first-child .valor');
    const descontoEl = document.querySelector('.linhas-resumo .linha-item:nth-child(2) .valor');
    const totalEl = document.querySelector('.valor-atual');

    if (subtotalEl) subtotalEl.textContent = formatarPreco(subtotal);
    if (descontoEl) descontoEl.textContent = formatarPreco(totalDesconto);
    if (totalEl) totalEl.textContent = formatarPreco(valorFinal);

    if (resumo) resumo.style.display = vazio ? 'none' : 'block';
    if (botaoFinalizar) botaoFinalizar.style.display = vazio ? 'none' : 'block';
    if (botaoLimpar) botaoLimpar.style.display = vazio ? 'none' : 'block';
}

async function carregarCarrinho() {
    const container = document.querySelector('.lista-produtos');
    container.innerHTML = `<p style="text-align:center; padding:20px; color:var(--C500);">Carregando...</p>`;

    try {
        const dados = await fetchCarrinho();
        if (dados) renderizarCarrinho(dados);
    } catch (erro) {
        container.innerHTML = `<p style="text-align:center; padding:20px; color:red;">Erro ao carregar o carrinho. Tente novamente.</p>`;
    }
}

async function aumentarQuantidade(produtoId, quantidadeAtual) {
    try {
        const resposta = await fetch(`${API}/carrinho/itens/${produtoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ quantidade: quantidadeAtual + 1 }),
        });

        if (resposta.status === 401) {
            window.location.href = '../LOGIN/login.html';
            return;
        }

        if (!resposta.ok) throw new Error('Falha ao atualizar quantidade.');

        await carregarCarrinho();
    } catch (erro) {
        alert('Erro ao atualizar quantidade. Tente novamente.');
    }
}

async function diminuirQuantidade(produtoId, quantidadeAtual) {
    if (quantidadeAtual <= 1) {
        if (!confirm('Deseja remover este produto do carrinho?')) return;
        await removerItem(produtoId);
        return;
    }

    try {
        const resposta = await fetch(`${API}/carrinho/itens/${produtoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ quantidade: quantidadeAtual - 1 }),
        });

        if (resposta.status === 401) {
            window.location.href = '../LOGIN/login.html';
            return;
        }

        if (!resposta.ok) throw new Error('Falha ao atualizar quantidade.');

        await carregarCarrinho();
    } catch (erro) {
        alert('Erro ao atualizar quantidade. Tente novamente.');
    }
}

async function removerItem(produtoId) {
    try {
        const resposta = await fetch(`${API}/carrinho/itens/${produtoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });

        if (resposta.status === 401) {
            window.location.href = '../LOGIN/login.html';
            return;
        }

        if (!resposta.ok) throw new Error('Falha ao remover item.');

        await carregarCarrinho();
    } catch (erro) {
        alert('Erro ao remover item. Tente novamente.');
    }
}

async function limparCarrinho() {
    if (!confirm('Tem certeza que deseja limpar todo o carrinho?')) return;

    try {
        const resposta = await fetch(`${API}/carrinho`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });

        if (resposta.status === 401) {
            window.location.href = '../LOGIN/login.html';
            return;
        }

        if (!resposta.ok) throw new Error('Falha ao limpar carrinho.');

        await carregarCarrinho();
    } catch (erro) {
        alert('Erro ao limpar o carrinho. Tente novamente.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    redirecionarSeNaoLogado();
    carregarCarrinho();

    const botaoLimpar = document.querySelector('.container-botao2');
    if (botaoLimpar) {
        botaoLimpar.addEventListener('click', function (event) {
            event.preventDefault();
            limparCarrinho();
        });
    }
});
