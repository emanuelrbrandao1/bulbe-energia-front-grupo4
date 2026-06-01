// LOGIN/cadastro.js
const API_BASE = 'http://localhost:3000/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        window.location.href = '../HOME/home.html';
        return;
    }

    const form     = document.getElementById('cadastro-form');
    const inputNome  = document.getElementById('nome');
    const inputEmail = document.getElementById('email');
    const inputSenha = document.getElementById('senha');
    const msgErro  = document.getElementById('msg-erro');
    const btn      = document.getElementById('btn-cadastrar');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        ocultarErro(msgErro);

        const nome  = inputNome.value.trim();
        const email = inputEmail.value.trim();
        const senha = inputSenha.value;

        if (!nome || !email || !senha) {
            mostrarErro(msgErro, 'Preencha todos os campos.');
            return;
        }

        btn.disabled = true;
        const textoOriginal = btn.textContent;
        btn.textContent = 'Cadastrando...';

        try {
            const resposta = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                mostrarErro(msgErro, dados.mensagem || 'Erro ao criar conta.');
                return;
            }

            localStorage.setItem('token', dados.token);
            if (dados.nome) localStorage.setItem('nome', dados.nome);

            window.location.href = '../HOME/home.html';
        } catch (erro) {
            mostrarErro(msgErro, 'Erro de conexão. Verifique se o servidor está rodando.');
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
