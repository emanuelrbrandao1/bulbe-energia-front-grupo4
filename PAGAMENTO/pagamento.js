// PAGAMENTO/pagamento.js
 const BASE_URL = 'http://localhost:3000/api/v1';
 
function getToken() {
    return localStorage.getItem('token');
}
 
function verificarAutenticacao() {
    if (!getToken()) {
        window.location.href = '../LOGIN/login.html';
    }
}
 
function mostrarErro(msg) {
    const el = document.getElementById('msg-erro');
    el.textContent = msg;
    el.style.display = 'block';
}
 
function esconderErro() {
    const el = document.getElementById('msg-erro');
    el.style.display = 'none';
}
 
async function selecionarEntrega(tipo) {
    const resposta = await fetch(`${BASE_URL}/bulbe/entrega`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()   
        },
        body: JSON.stringify({ tipo })
    });
 
    if (resposta.status === 401) {
        window.location.href = '../LOGIN/login.html';
        return null;
    }
 
    const dados = await resposta.json();
 
    if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao selecionar entrega');
    }
 
    return dados; 
}
 
async function criarPedido(formaEntrega, metodoPagamento) {
    const enderecoEntrega = JSON.parse(localStorage.getItem('enderecoEntrega') || 'null');
    if (!enderecoEntrega) {
        throw new Error('Endereço não encontrado. Volte e preencha o endereço.');
    }

    const resposta = await fetch(`${BASE_URL}/pedidos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        },
        body: JSON.stringify({ enderecoEntrega, formaEntrega, metodoPagamento }),
    });

    if (resposta.status === 401) {
        window.location.href = '../LOGIN/login.html';
        return null;
    }

    const dados = await resposta.json();
    if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao criar pedido.');
    }

    return dados.pedidoId;
}

async function processarPagamento(pedidoId, corpo) {
    const resposta = await fetch(`${BASE_URL}/bulbe/pedidos/${pedidoId}/pagamento`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()  
        },
        body: JSON.stringify(corpo)
    });
 
    if (resposta.status === 401) {
        window.location.href = '../LOGIN/login.html';
        return null;
    }
 
    const dados = await resposta.json();
 
    if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao processar pagamento');
    }
 
    return dados; 
}
 
document.addEventListener('DOMContentLoaded', function () {
 
    verificarAutenticacao();
 
    const selectEntrega  = document.getElementById('seletor');
    const infoEntrega    = document.getElementById('info-entrega');
    const selectPagamento = document.getElementById('pagamento');
    const formCredito    = document.querySelector('.credito');
    const btnConfirmar   = document.getElementById('btn-confirmar');
 
    selectEntrega.addEventListener('change', async function () {
        const tipo = selectEntrega.value;
        esconderErro();
        infoEntrega.style.display = 'none';
 
        try {
            const entrega = await selecionarEntrega(tipo);
            if (!entrega) return;
 
            infoEntrega.textContent =
                `Prazo: ${entrega.prazoEstimado} | Custo: R$ ${Number(entrega.custoEntrega).toFixed(2)}`;
            infoEntrega.style.display = 'block';

            localStorage.setItem('entregaTipo', entrega.tipo);
 
        } catch (erro) {
            mostrarErro(erro.message);
        }
    });
 
    selectPagamento.addEventListener('change', function () {
        const valor = selectPagamento.value;
        if (valor === 'credito' || valor === 'debito') {
            formCredito.style.display = 'flex';
        } else {
            formCredito.style.display = 'none';
        }
        esconderErro();
    });
 
    btnConfirmar.addEventListener('click', async function (event) {
        event.preventDefault();
        esconderErro();
        const metodo   = selectPagamento.value;
        const entrega  = selectEntrega.value;

        if (!entrega) {
            mostrarErro('Selecione uma forma de entrega.');
            return;
        }
        if (!metodo) {
            mostrarErro('Selecione uma forma de pagamento.');
            return;
        }
 
        const metodosComCartao = ['credito', 'debito'];
        let corpo = { metodo };
 
        if (metodosComCartao.includes(metodo)) {
            const nome_titular  = document.getElementById('nome_cartao').value.trim();
            const num_cartao    = document.getElementById('num_cc').value.trim();
            const validade      = document.getElementById('validade').value.trim();
            const cod_seguranca = document.getElementById('cod_seg').value.trim();
 
            if (!nome_titular || !num_cartao || !validade || !cod_seguranca) {
                mostrarErro('Preencha todos os dados do cartão.');
                return;
            }
            corpo = { metodo, nome_titular, num_cartao, validade, cod_seguranca };
        }
 
        btnConfirmar.textContent = 'Processando...';
        btnConfirmar.disabled = true;

        try {
            const pedidoId = await criarPedido(entrega, metodo);
            if (!pedidoId) return;

            const pagamento = await processarPagamento(pedidoId, corpo);
            if (!pagamento) return;
            window.location.href = `../CONFIRMACAO/TCC.html?pedidoId=${pagamento.idPedido}`;
 
        } catch (erro) {
            mostrarErro(erro.message);
            btnConfirmar.textContent = 'Confirmar Pagamento';
            btnConfirmar.disabled = false;
        }
    });
});