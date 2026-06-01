const API = 'http://localhost:3000/api/v1';

const botao = document.querySelector(".but");
const cep = document.getElementById("cep");
const endereco = document.getElementById("ender");
const numero = document.getElementById("num");
const complemento = document.getElementById("comp");
const cepInfoContainer = document.getElementById('cep-info');
const cepInfoTexto = document.querySelector('.txtcep');

let dadosLocalizacao = {};

// Salvar endereço no backend e redirecionar para pagamento
botao.addEventListener("click", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../LOGIN/login.html';
    return;
  }

  const cepLimpo = cep.value.replace(/\D/g, '');

  const dadosEndereco = {
    cep: cepLimpo,
    logradouro: endereco.value,
    numero: numero.value,
    complemento: complemento.value,
  };

  try {
    const resposta = await fetch(`${API}/pedidos/endereco`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dadosEndereco),
    });

    if (resposta.status === 401) {
      window.location.href = '../LOGIN/login.html';
      return;
    }

    if (!resposta.ok) {
      exibirErro('Erro ao salvar endereço. Tente novamente.');
      return;
    }

    // Salva endereço completo para pagamento.js usar ao criar o pedido
    localStorage.setItem('enderecoEntrega', JSON.stringify({
      cep: cepLimpo,
      logradouro: endereco.value,
      numero: numero.value,
      complemento: complemento.value,
      bairro: dadosLocalizacao.bairro || '',
      localidade: dadosLocalizacao.localidade || '',
      uf: dadosLocalizacao.uf || '',
    }));

    window.location.href = '../PAGAMENTO/pagamento.html';
  } catch (error) {
    exibirErro('Erro de conexão. Verifique se o servidor está rodando.');
  }
});

// Ativar botão
const inputsobg = [cep, endereco, numero];

function verificarCampos() {
  const todosPreenchidos = inputsobg.every(input => input.value.trim() !== '');
  if (todosPreenchidos) {
    botao.classList.remove('desabilitado');
  } else {
    botao.classList.add('desabilitado');
  }
}

inputsobg.forEach(input => {
  input.addEventListener('input', verificarCampos);
});

verificarCampos();

// Máscara do CEP
cep.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
  this.value = this.value.replace(/^(\d{5})(\d)/, "$1-$2");
  if (this.value.length > 9) {
    this.value = this.value.slice(0, 9);
  }
});

// Busca CEP via backend
cep.addEventListener('blur', function() {
  buscarCEP(this.value);
});

async function buscarCEP(cepVal) {
  const cepLimpo = cepVal.replace(/\D/g, '');
  if (cepLimpo.length !== 8) {
    limparFormularioParcial();
    return;
  }

  try {
    const response = await fetch(`${API}/enderecos/cep/${cepLimpo}`);

    if (response.status === 503) {
      exibirErro('Serviço de CEP temporariamente indisponível. Preencha o endereço manualmente.');
      limparFormularioParcial();
      return;
    }

    const data = await response.json();

    if (!response.ok || data.erro) {
      console.error("CEP não encontrado.");
      limparFormularioParcial();
    } else {
      ocultarErro();
      preencherCampos(data);
    }
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    limparFormularioParcial();
  }
}

function preencherCampos(data) {
  endereco.value = data.logradouro;
  cepInfoTexto.innerHTML = `${data.uf}, ${data.localidade}, ${data.bairro}`;
  cepInfoContainer.classList.remove('escondido');
  endereco.readOnly = true;
  numero.focus();
  verificarCampos();

  dadosLocalizacao = {
    bairro: data.bairro || '',
    localidade: data.localidade || '',
    uf: data.uf || '',
  };
}

function limparFormularioParcial() {
  endereco.value = "";
  endereco.readOnly = false;
  cepInfoContainer.classList.add('escondido');
  dadosLocalizacao = {};
  verificarCampos();
}

function exibirErro(msg) {
  const el = document.getElementById('error-message');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('escondido');
}

function ocultarErro() {
  const el = document.getElementById('error-message');
  if (!el) return;
  el.classList.add('escondido');
  el.textContent = '';
}
