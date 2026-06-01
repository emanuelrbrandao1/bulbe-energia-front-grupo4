// LOGIN/login.js
// Tela de autenticacao. POST /api/v1/auth/login, salva o token no localStorage
// (key 'token', alinhado com PRODUTO/CARRINHO/FAVORITOS/PAGAMENTO) e redireciona
// pra HOME. Tambem age como guard: se o user ja tem token, pula direto pra HOME.

const API_BASE = 'http://localhost:3000/api/v1';
const TOKEN_KEY = 'token';
const NOME_KEY  = 'nome';
const DESTINO_POS_LOGIN = '../HOME/home.html';

document.addEventListener('DOMContentLoaded', () => {
    // Se ja esta logado, pula a tela de login
    if (localStorage.getItem(TOKEN_KEY)) {
        window.location.href = DESTINO_POS_LOGIN;
        return;
    }

    const form     = document.getElementById('login-form');
    const inputEmail = document.getElementById('email');
    const inputSenha = document.getElementById('senha');
    const msgErro  = document.getElementById('msg-erro');
    const btn      = document.getElementById('btn-entrar');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        ocultarErro(msgErro);

        const email = inputEmail.value.trim();
        const senha = inputSenha.value;

        if (!email || !senha) {
            mostrarErro(msgErro, 'Preencha e-mail e senha.');
            return;
        }

        btn.disabled = true;
        const textoOriginal = btn.textContent;
        btn.textContent = 'Entrando...';

        try {
            const resposta = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                // Backend devolve { mensagem: '...' } em 401/422
                const erroMsg = dados.mensagem || dados.erro || 'Falha na autenticacao.';
                mostrarErro(msgErro, erroMsg);
                return;
            }

            // Sucesso: persistir token + nome e redirecionar
            localStorage.setItem(TOKEN_KEY, dados.token);
            if (dados.nome) localStorage.setItem(NOME_KEY, dados.nome);

            window.location.href = DESTINO_POS_LOGIN;
        } catch (erro) {
            mostrarErro(msgErro, 'Erro de conexao. Verifique se o servidor esta rodando.');
        } finally {
            btn.disabled = false;
            btn.textContent = textoOriginal;
        }
    });
});

function mostrarErro(el, texto) {
    el.textContent = texto;
    el.classList.remove('oculto');
}

function ocultarErro(el) {
    el.classList.add('oculto');
    el.textContent = '';
}
