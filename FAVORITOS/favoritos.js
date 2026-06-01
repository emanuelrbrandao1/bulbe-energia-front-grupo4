// ===== FAVORITOS.JS - GERENCIAMENTO DE FAVORITOS =====

const API = 'http://localhost:3000/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

function redirecionarSeNaoLogado() {
  if (!getToken()) {
    window.location.href = '../LOGIN/login.html';
  }
}

function formatarPreco(preco) {
  return `R$ ${Number(preco).toFixed(2).replace('.', ',')}`;
}

function renderizarFavoritos(favoritos) {
  const container = document.querySelector('.lista-produtos');

  if (favoritos.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <img src="../assets/images/coracao-cinza.png" alt="Sem favoritos" style="width: 150px; margin-bottom: 20px;">
        <h2 style="color: var(--C700); font-size: 20px; margin-bottom: 10px;">Nenhum produto favorito</h2>
        <p style="color: var(--C500); margin-bottom: 20px;">Adicione produtos aos favoritos para vê-los aqui!</p>
        <a href="../HOME/home.html" style="background-color: var(--AU700); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Ver Produtos</a>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  favoritos.forEach(item => {
    container.innerHTML += `
      <article class="caixaproduto" data-id="${item.produtoId}">
        <div class="produto-imagem">
          <img src="../${item.imagem}" alt="${item.nome}" onerror="this.src='../assets/images/bulbe-ex-produto.png'">
        </div>
        <div class="produto-info">
          <div class="info-header">
            <h2 class="produto-nome">${item.nome}</h2>
          </div>
          <div class="produto-footer">
            <div class="preco-container">
              <span class="preco">${formatarPreco(item.preco)}</span>
            </div>
          </div>
        </div>
        <img class="carrinho" src="../assets/images/carrinho.png" alt="Adicionar ao carrinho"
          onclick="adicionarAoCarrinhoDeFavoritos(${item.produtoId})" style="cursor: pointer;">
        <img class="lixeira" src="../assets/images/lixo.png" alt="Desfavoritar"
          onclick="desfavoritar(${item.produtoId})" style="cursor: pointer;">
      </article>
    `;
  });
}

async function carregarFavoritos() {
  redirecionarSeNaoLogado();

  const container = document.querySelector('.lista-produtos');
  container.innerHTML = `<p style="text-align:center; padding:20px; color:var(--C500);">Carregando...</p>`;

  try {
    const resposta = await fetch(`${API}/favoritos`, {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (resposta.status === 401) {
      window.location.href = '../LOGIN/login.html';
      return;
    }

    if (!resposta.ok) {
      throw new Error('Falha ao carregar favoritos.');
    }

    const dados = await resposta.json();
    renderizarFavoritos(dados.favoritos || []);

  } catch (erro) {
    container.innerHTML = `<p style="text-align:center; padding:20px; color:red;">Erro ao carregar favoritos. Tente novamente.</p>`;
  }
}

async function desfavoritar(produtoId) {
  try {
    const resposta = await fetch(`${API}/favoritos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ produtoId }),
    });

    if (resposta.status === 401) {
      window.location.href = '../LOGIN/login.html';
      return;
    }

    if (!resposta.ok) {
      throw new Error('Falha ao desfavoritar.');
    }

    await carregarFavoritos();

  } catch (erro) {
    console.error('Erro ao desfavoritar:', erro);
  }
}

async function adicionarAoCarrinhoDeFavoritos(produtoId) {
  try {
    const resposta = await fetch(`${API}/carrinho/itens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ produtoId, quantidade: 1 }),
    });

    if (resposta.status === 401) {
      window.location.href = '../LOGIN/login.html';
      return;
    }

    if (!resposta.ok) throw new Error('Falha ao adicionar ao carrinho.');

    alert('Produto adicionado ao carrinho!');
  } catch (erro) {
    console.error('Erro ao adicionar ao carrinho:', erro);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  carregarFavoritos();
});
