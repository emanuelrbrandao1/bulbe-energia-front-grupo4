// assets/js/menu-usuario.js
// Dropdown do icone de usuario com a opcao "Sair da conta".
// Incluido apenas em Home, Favoritos e Carrinho (paginas antes do fluxo de finalizacao de compra).

document.addEventListener('DOMContentLoaded', function () {
    const botaoUsuario = document.getElementById('btn-usuario');
    const menuUsuario  = document.getElementById('menu-usuario');
    const botaoSair    = document.getElementById('btn-sair-conta');

    if (!botaoUsuario || !menuUsuario || !botaoSair) return;

    function fecharMenu() {
        menuUsuario.classList.add('oculto');
        botaoUsuario.setAttribute('aria-expanded', 'false');
    }

    function alternarMenu(event) {
        event.stopPropagation();
        const estaAberto = !menuUsuario.classList.contains('oculto');
        if (estaAberto) {
            fecharMenu();
        } else {
            menuUsuario.classList.remove('oculto');
            botaoUsuario.setAttribute('aria-expanded', 'true');
        }
    }

    botaoUsuario.addEventListener('click', alternarMenu);

    document.addEventListener('click', function (event) {
        if (!menuUsuario.contains(event.target) && event.target !== botaoUsuario) {
            fecharMenu();
        }
    });

    botaoSair.addEventListener('click', function () {
        fecharMenu();

        const confirmou = window.confirm('Tem certeza que deseja sair da sua conta?');
        if (!confirmou) return;

        localStorage.removeItem('token');
        localStorage.removeItem('nome');
        localStorage.removeItem('enderecoEntrega');
        localStorage.removeItem('entregaTipo');

        window.location.href = '../LOGIN/login.html';
    });
});
