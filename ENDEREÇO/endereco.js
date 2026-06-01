const botao = document.querySelector(".but");
const cep = document.getElementById("cep");
const endereco = document.getElementById("ender");
const numero = document.getElementById("num");
const complemento = document.getElementById("comp");
const cepInfoContainer = document.getElementById('cep-info');
const cepInfoTexto = document.querySelector('.txtcep');
const msgErro = document.getElementById('error-message');

// Salvar dados
botao.addEventListener("click", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../LOGIN/login.html";
    return;
  }

  const dadosEndereco = {
    cep: cep.value,
    logradouro: endereco.value,
    numero: numero.value,
    complemento: complemento.value
  };

  try {
    const response = await fetch('/api/v1/pedidos/endereco', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dadosEndereco)
    });

    if (response.status === 401) {
      window.location.href = "../LOGIN/login.html";
      return;
    }

    if (response.ok) {
      localStorage.setItem("cep", cep.value);
      localStorage.setItem("endereco", endereco.value);
      localStorage.setItem("numero", numero.value);
      localStorage.setItem("complemento", complemento.value);

      window.location.href = "../PAGAMENTO/pagamento.html";
    } else {
      exibirErro("Não foi possível salvar o endereço. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao conectar com o servidor:", error);
    exibirErro("Erro de comunicação com o servidor.");
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

// Melhoria ao digitar CEP
cep.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
  this.value = this.value.replace(/^(\d{5})(\d)/, "$1-$2");
  if (this.value.length > 9) {
    this.value = this.value.slice(0, 9);
  }
});

// API do CEP
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
    ocultarErro();
    
    const response = await fetch(`/api/v1/enderecos/cep/${cepLimpo}`);
    
    if (!response.ok) {
      if (response.status === 503) {
        exibirErro("O serviço de busca de CEP está temporariamente indisponível. Por favor, preencha manualmente.");
      } else {
        exibirErro("CEP inválido ou não encontrado.");
      }
      limparFormularioParcial();
      return;
    }

    const data = await response.json();

    if (data.erro) {
      console.error("CEP não encontrado.");
      exibirErro("CEP não localizado.");
      limparFormularioParcial();
    } else {
      preencherCampos(data);
    }
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    exibirErro("Erro ao consultar o serviço de CEP.");
    limparFormularioParcial();
  }
}

function preencherCampos(data) {
  endereco.value = data.logradouro || '';
  
  const detalhes = [data.uf, data.localidade, data.bairro].filter(Boolean).join(', ');
  cepInfoTexto.textContent = detalhes;
  cepInfoContainer.classList.remove('escondido');
  
  endereco.readOnly = true; 
  numero.focus(); 
  verificarCampos();
}

function limparFormularioParcial() {
  endereco.value = "";
  endereco.readOnly = false;
  cepInfoContainer.classList.add('escondido');
  verificarCampos();
}

// Funções utilitárias para exibição de erros na interface
function exibirErro(mensagem) {
  if (msgErro) {
    msgErro.textContent = mensagem;
    msgErro.classList.remove('escondido');
  }
}

function ocultarErro() {
  if (msgErro) {
    msgErro.textContent = "";
    msgErro.classList.add('escondido');
  }
}