// Fetch para cabeçalho em HTML 
fetch('cabecalho.html')
  .then(resposta => resposta.text())
  .then(html => {
    // Insere o conteúdo do cabeçalho no elemento com o id "header-placeholder"
    document.getElementById('header-placeholder').innerHTML = html;
  });

/*fetch('clientes.html')
  .then(resposta => resposta.text())
  .then(data => {
    const verificador = new DOMParser();
    const htmlVerificado = verificador.parseFromString(data, 'text/html');
    const conteudoPrincipal = htmlVerificado.querySelector('main').innerHTML;
    document.getElementById('nomeCliente').innerText = conteudoPrincipal;
  })
  .catch(erro => {
    console.error('Erro ao recuperar o conteúdo da página:', erro);
  });*/

function pesquisarNomeCliente() {

  const buscaCliente = document.getElementById('txtPesquisar-Nome-Cliente').value;

  // Enviar uma solicitação para o servidor com o termo de pesquisa
  fetch(`http://localhost:5500/informacoescliente?searchTerm=${buscaCliente}`)
    .then(resposta => resposta.json())
    .then(data => {
      // Processar os resultados da pesquisa
      console.log(data);
      exibirResultados(data);
    })
    .catch(error => console.error('Erro ao realizar a pesquisa:', error));

}

function limparDados() {
  // Limpe os dados da página aqui
  // Por exemplo, você pode redefinir os valores dos campos de entrada para vazio
  window.location.reload();

  // ... e assim por diante
}


function exibirResultados(resultados) {

  const corpoTabela = document.getElementById('corpo-tabela');
  corpoTabela.innerHTML = ''; // Limpa o conteúdo anterior

  if (resultados.length === 0) {
    // Caso não haja resultados
    const linhaVazia = document.createElement('tr');
    const colunaMensagem = document.createElement('td');
    colunaMensagem.textContent = 'Nenhum resultado encontrado.';
    colunaMensagem.setAttribute('colspan', '5');
    linhaVazia.appendChild(colunaMensagem);
    corpoTabela.appendChild(linhaVazia);
  } else {
    // Caso haja resultados
    // Dados padrões do Cliente
    let dadosCliente = window.document.getElementById('dadosCliente');
    dadosCliente.innerHTML = '';
    const codigoTexto = resultados[0].codigo;
    const nomeTexto = resultados[0].nome;
    const estadoTexto = resultados[0].estado;
    const atendenteTexto = resultados[0].atendente;
    const contatoTexto = resultados[0].contato;
    dadosCliente.innerHTML += `<p>Código: ${codigoTexto}  |  Cliente: ${nomeTexto}</p>`
    dadosCliente.innerHTML += `<p>Estado: ${estadoTexto}  |  Atendente: ${atendenteTexto}  |  Contato: ${contatoTexto}</p>`

    dadosCliente.style.fontSize = '18px';
    dadosCliente.style.fontFamily = 'Arial, sans-serif';
    dadosCliente.style.fontWeight = 'bold';
    dadosCliente.style.textAlign = 'left';

    resultados.forEach(resultado => {
      const linha = document.createElement('tr');

      const colunaParafuso = document.createElement('td');
      colunaParafuso.textContent = resultado.parafuso;
      linha.appendChild(colunaParafuso);

      const colunaVisor = document.createElement('td');
      colunaVisor.textContent = resultado.visor;
      linha.appendChild(colunaVisor);

      const colunaMedidas = document.createElement('td');
      colunaMedidas.textContent = resultado.medidas;
      linha.appendChild(colunaMedidas);

      const colunaLogotipo = document.createElement('td');
      colunaLogotipo.textContent = resultado.logotipo;
      linha.appendChild(colunaLogotipo);

      const colunaProduto = document.createElement('td');
      colunaProduto.textContent = resultado.produto;
      colunaProduto.style.cursor = 'pointer';
      colunaProduto.style.backgroundColor = '#f35858';
      colunaProduto.addEventListener('click', () => {
        const observacoes = resultado.observacoes;
        const textareaObservacoes = document.getElementById('observacoes');
        textareaObservacoes.value = observacoes;
      });
      linha.appendChild(colunaProduto);

      corpoTabela.appendChild(linha);
    });



    const linhasTabela = document.querySelectorAll('table tbody tr');

    // Adiciona um evento de clique em cada linha
    linhasTabela.forEach(linha => {
      linha.addEventListener('click', () => {
        // Obtém o valor da coluna "observacoes" da linha clicada
        const observacoes = linha.querySelector('.observacoes').textContent;

        // Define o valor do textarea como as observações recuperadas
        const textareaObservacoes = document.getElementById('observacoes');
        textareaObservacoes.value = observacoes;
      });
    });
  }
}

function exibirObservacao(observacao) {
  const observacaoDiv = document.getElementById('observacaoDiv');
  observacaoDiv.textContent = observacao;
}


function voltarInicio() {
  const diretorioAtual = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1);

  if (diretorioAtual === "Projeto_Consulta.html") {
    window.location.href = "index.html";
  } else if (diretorioAtual === "clientesEstado.html") {
    window.location.href = "../index.html";
  } else {
    // se não estiver em nenhum diretório específico, redirecionar para "index.html"
    window.location.href = "../../index.html";
  }
}
// INICIO - BANCO DE DADOS - CLIENTE
const tableBody = document.querySelector('#clientesTable tbody');


// CADASTRO CLIENTE
function submitForm(event) {
  event.preventDefault();

  // Função para enviar o formulário de cadastro

  // Obter os valores dos campos do formulário
  const codigo = document.getElementById('codigo').value;
  const nome = document.getElementById('nome').value;
  const estado = document.getElementById('estado').value;
  const parafuso = document.getElementById('parafuso').value;
  const visor = document.getElementById('visor').value;
  const medidas = document.getElementById('medidas').value;
  const logotipo = document.getElementById('logotipo').value;
  const produto = document.getElementById('produto').value;
  const atendente = document.getElementById('atendente').value;
  const contato = document.getElementById('contato').value;
  const observacoes = document.getElementById('observacoes').value;


  // Criar um objeto cliente com os valores dos campos
  const cliente = {
    codigo,
    nome,
    estado,
    parafuso,
    visor,
    medidas,
    logotipo,
    produto,
    atendente,
    contato,
    observacoes
  };

  // POST para o server
  fetch('http://localhost:5500/cadastrarCliente', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cliente)
  })
    .then(resposta => resposta.json())
    .then(data => {
      // Processasa a resposta do server se necessário
      console.log(data);
      alert('CADASTRO DE CLIENTE REALIZADO COM SUCESSO!');
    })
    .catch(error => {
      // erros de requisição
      console.error('Erro:', error);
    });
}

function adicionarEventoFormulario() {
  const form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', submitForm);
  } else {
    console.error("Elemento 'form' não encontrado.");
  }
}

document.addEventListener('DOMContentLoaded', adicionarEventoFormulario);




function pesquisarCliente() {
  const codigoInput = document.getElementById('codigoInput');
  const nomeCliente = document.getElementById('nomeCliente');

  const codigo = codigoInput.value;

  // Fazer uma requisição ao servidor para pesquisar o cliente pelo ID
  fetch(`http://localhost:5500/clientes/${codigo}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(resposta => resposta.json())
    .then(data => {
      if (data && data.nome) {
        nomeCliente.value = data.nome;
      } else {
        nomeCliente.value = "Cliente não encontrado";
      }
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function buscarClienteCodigo() {
  const codigo = document.getElementById("codigo").value;

  // Faziruma solicitação AJAX para buscar os dados do cliente no servidor
  const url = "http://localhost:5500/clientes/" + codigo;

  // Fazer a solicitação AJAX usando o objeto XMLHttpRequest ou a função fetch
  fetch(url)
    .then(resposta => resposta.json())
    .then(data => {
      // Preencher os campos do formulário com os dados do cliente
      document.getElementById("nome").value = data.nome;
      document.getElementById("estado").value = data.estado;
      document.getElementById("parafuso").value = data.parafuso;
      document.getElementById("atendente").value = data.atendente;
      document.getElementById("contato").value = data.contato;
    })
    .catch(error => {
      console.error('Erro ao buscar cliente:', error);
    });
}

// ABAIXO PESQUISAR ENTRE FUROS 
function pesquisarEntreFuros() {

  const textareaObservacoesEf = document.getElementById('observacoesEf');
  textareaObservacoesEf.value = ''; // Apaga o conteúdo anterior

  //limpar imagem sempre que clica no botao pesquisar
  /* const recarregarAmbiente = window.document.getElementById('carouselExampleDark');
   if (recarregarAmbiente) {
     recarregarAmbiente.src = ''; // Limpar o caminho da imagem para remover a imagem atual
     console.log('Galera de Imagens resetada com sucesso!');
   } else {
     console.log('Elemento de imagem não encontrado!');
   }*/


  const entreFuros = window.document.getElementById('txtPesquisar-Entre-Furos').value;
  const endereço = "http://localhost:5500/medidas/" + entreFuros;
  fetch(endereço)
    .then(resposta => resposta.json())
    .then(data => {
      // Processar os resultados da pesquisa
      console.log(data);
      exibirEntreFuros(data);
    })
    .catch(error => {
      console.error('Erro ao realizar a pesquisa:', error);
    });

  //limpar imagem sempre que clica no botao pesquisar
  const recarregarAmbiente = window.document.getElementById('imagem1');
  const carrossel = window.document.getElementById('criarAmbiente');

  if (carrossel) {
    recarregarAmbiente.src = ''; // Limpar o caminho da imagem para remover a imagem atual
    console.log('Galera de Imagens resetada com sucesso!');
  }

}

function exibirEntreFuros(resultados) {
  const corpoTabela = document.getElementById('corpo-tabela');
  corpoTabela.innerHTML = '';


  if (resultados.length === 0) {
    const linhaVazia = document.createElement('tr');
    const colunaMensagem = document.createElement('td');
    colunaMensagem.textContent = 'Nenhum entre furos encontrado, tente novamente!';
    colunaMensagem.setAttribute('colspan', '5');
    linhaVazia.appendChild(colunaMensagem);
    corpoTabela.appendChild(linhaVazia);
    alert('Nenhum entre furos encontrado, tente novamente!');
  } else {
    resultados.forEach((resultado) => {
      var linha = document.createElement('tr');
      var colunaEntreFuros = document.createElement('td');
      colunaEntreFuros.style.backgroundColor = '#d6dee2';
      colunaEntreFuros.textContent = resultado.entreFuros;
      colunaEntreFuros.style.textAlign = 'center';
      colunaEntreFuros.setAttribute('data-entreFuros', resultado.entreFuros); 
      linha.appendChild(colunaEntreFuros);

      var colunaProduto = document.createElement('td');
      colunaProduto.textContent = resultado.produto;
      colunaProduto.setAttribute('data-produto', resultado.produto); 
      linha.appendChild(colunaProduto);

      var colunaParafuso = document.createElement('td');
      colunaParafuso.style.backgroundColor = '#d6dee2';
      colunaParafuso.textContent = resultado.parafuso;
      colunaParafuso.setAttribute('data-parafuso', resultado.parafuso); 
      linha.appendChild(colunaParafuso);

      var colunaBotoeira = document.createElement('td');
      colunaBotoeira.textContent = resultado.botoeira;
      colunaBotoeira.setAttribute('data-botoeira', resultado.botoeira); 
      linha.appendChild(colunaBotoeira);

      var colunaFabricante = document.createElement('td');
      colunaFabricante.textContent = resultado.fabricante;
      colunaFabricante.style.cursor = 'pointer';
      colunaFabricante.style.fontWeight = 'bold';
      colunaFabricante.style.backgroundColor = '#d6dee2';
      colunaFabricante.setAttribute('data-fabricante', resultado.fabricante); // Adicionar atributo para identificação
      colunaFabricante.addEventListener('click', () => {

        // Restaurar as cores padrão antes de atualizar a observação
        restaurarCoresPadrao();

        colunaFabricante.style.backgroundColor = '#f35858';
        colunaFabricante.style.fontWeight = 'bold';
        colunaBotoeira.style.backgroundColor = '#f35858';
        colunaBotoeira.style.fontWeight = 'bold';
        colunaProduto.style.backgroundColor = '#f35858';
        colunaProduto.style.fontWeight = 'bold';
        colunaParafuso.style.backgroundColor = '#f35858';
        colunaParafuso.style.fontWeight = 'bold';
        colunaEntreFuros.style.backgroundColor = '#f35858';
        colunaEntreFuros.style.fontWeight = 'bold';

        var observacoesEf = resultado.observacoesEf;
        console.log(observacoesEf);
        const textareaObservacoesEf = document.getElementById('observacoesEf');
        textareaObservacoesEf.value = observacoesEf;
        textareaObservacoesEf.style.fontWeight = 'bold';

        adicionarImagem(resultado);
        galeriaImagem(resultado);
      });

      linha.appendChild(colunaFabricante);
      corpoTabela.appendChild(linha);
    });
  }
}

function restaurarCoresPadrao() {
  const celulasFabricantes = document.querySelectorAll('td[data-fabricante]');
  const celulasProdutos = document.querySelectorAll('td[data-produto]');
  const celulasParafusos = document.querySelectorAll('td[data-parafuso]');
  const celulasBotoeiras = document.querySelectorAll('td[data-botoeira]');
  const celulasEntreFuros = document.querySelectorAll('td[data-entreFuros]');

  const celulasDesativadasBrancas = [
    ...celulasProdutos,
    ...celulasBotoeiras,
  ];
  
  const celulasDesativadasCinzas = [
    ...celulasFabricantes,
    ...celulasParafusos,
    ...celulasEntreFuros,
  ];

  celulasDesativadasBrancas.forEach((celula) => {
    celula.style.backgroundColor = 'white';
    celula.style.fontWeight = 'normal';
  });

  celulasDesativadasCinzas.forEach((celula) => {
    celula.style.backgroundColor = '#d6dee2';
    celula.style.fontWeight = 'normal';
  });
}



function adicionarImagem(resultado) {
  const caminhoImagem1 = resultado.imagem1; // Caminho da imagem vindo do banco de dados
  const avisoImagem = "Imagens/semImagem.jpg";

  //IMAGEM - 1
  const img1 = document.getElementById('imagem1');
  const pastaImagem = `http://localhost:5500/imagensPavimento`; // Pasta base das imagens
  const enderecoServidor1 = `${pastaImagem}/${caminhoImagem1}`;
  console.log('Endereço da imagem:', enderecoServidor1);
  if (enderecoServidor1.length <= 55) {
    console.log('Não foi possível inserir a imagem1 !');
    img1.src = avisoImagem;
    img1.style.display = 'block';
    img1.style.marginLeft = '23%';
  } else {
    console.log('Imagem 1 recebida com sucesso!');
    img1.src = enderecoServidor1;
    img1.style.display = 'block'; // Exibe a imagem
    img1.style.marginLeft = '23%'
  }

  //IMAGEM 2
  const img2 = document.getElementById('imagem2');
  const caminhoImagem2 = resultado.imagem2; // Caminho da imagem vindo do banco de dados
  const enderecoServidor2 = `${pastaImagem}/${caminhoImagem2}`;
  console.log('Endereço da imagem:', enderecoServidor2);
  if (enderecoServidor2.length <= 55) {
    console.log('Não foi possível inserir a imagem 2!');
    img2.src = avisoImagem;
    img2.style.display = 'block';
    img2.style.marginLeft = '23%'
  } else {
    console.log('Imagem 2 recebida com sucesso!');
    img2.src = enderecoServidor2;
    img2.style.display = 'block'; // Exibe a imagem
    img2.style.marginLeft = '23%'
  }

  //IMAGEM 3
  const img3 = document.getElementById('imagem3');
  const caminhoImagem3 = resultado.imagem3;
  const enderecoServidor3 = `${pastaImagem}/${caminhoImagem3}`;
  console.log('Endereço da imagem:', enderecoServidor3);
  if (enderecoServidor3.length <= 55) {
    console.log('Não foi possível inserir a imagem 3!');
    img3.src = avisoImagem;
    img3.style.display = 'block'; // Exibe a imagem
    img3.style.marginLeft = '23%'
  } else {
    console.log('Imagem 3 recebida com sucesso!');
    img3.src = enderecoServidor3;
    img3.style.display = 'block'; // Exibe a imagem
    img3.style.marginLeft = '23%'
  }

  //IMAGEM 4
  const img4 = document.getElementById('imagem4');
  const caminhoImagem4 = resultado.imagem4;
  const enderecoServidor4 = `${pastaImagem}/${caminhoImagem4}`;
  console.log('Endereço da imagem:', enderecoServidor4);
  if (enderecoServidor4.length <= 55) {
    console.log('Não foi possível inserir a imagem 4!');
    img4.src = avisoImagem;
    img4.style.display = 'block'; // Exibe a imagem
    img4.style.marginLeft = '23%'
  } else {
    console.log('Imagem 4 recebida com sucesso!');
    img4.src = enderecoServidor4;
    img4.style.display = 'block'; // Exibe a imagem
    img4.style.marginLeft = '23%'
  }

  //IMAGEM 5
  const img5 = document.getElementById('imagem5');
  const caminhoImagem5 = resultado.imagem5;
  const enderecoServidor5 = `${pastaImagem}/${caminhoImagem5}`;
  console.log('Endereço da imagem:', enderecoServidor5);
  if (enderecoServidor5.length <= 55) {
    console.log('Não foi possível inserir a imagem 5!');
    img5.src = avisoImagem;
    img5.style.display = 'block'; // Exibe a imagem
    img5.style.marginLeft = '23%'
  } else {
    console.log('Imagem 5 recebida com sucesso!');
    img5.src = enderecoServidor5;
    img5.style.display = 'block'; // Exibe a imagem
    img5.style.marginLeft = '23%'
  }

  const carrosselImagens1 = document.getElementById('carrosselImagens1');


  if (enderecoServidor1) {
    console.log('Galeria criada com sucesso!');
    carrosselImagens1.classList.add('active');
  } else {
    console.log('[ERRO] Esta pavimento não contém fotos na base!');
  }
}

function galeriaImagem(resultado) {
  const resultadoImagem = resultado.imagem1;
  const criarAmbiente = window.document.getElementById('criarAmbiente')

  if (resultadoImagem) {
    console.log('A galeria de imagens obteve sucesso em seu início!')
    criarAmbiente.style.borderStyle = 'solid';
    criarAmbiente.style.borderColor = 'rgb(168, 168, 168)';
    criarAmbiente.style.display = 'flex';
    criarAmbiente.style.alignItems = 'center';
    criarAmbiente.style.justifyContent = 'center';

    botao = window.document.getElementById('botaoAvancar')
    botao.focus();
    mostrarBalao();
    setTimeout(esconderBalao, 6000); // Depois de um certo tempo (por exemplo, 5 segundos), esconda o balão 
    // 5000 milissegundos = 5 segundos
  }
}

// Função para mostrar o balão com a mensagem
function mostrarBalao() {
  const balao = document.getElementById('balao');
  balao.style.display = 'flex';
}

// Função para esconder o balão com a mensagem
function esconderBalao() {
  const balao = document.getElementById('balao');
  balao.style.display = 'none';
}


function validacao() {
  const feedback = document.getElementById('feedbackValidacao');
  const codigo = document.getElementById('codigo');
  const alertaCerto = "Muito bem!"
  const alertaErrado = "Preencher a informação solicitada!"
  const emjCerto = '\u2714️';
  const emjErrado = '\u274C';

  if (codigo.length <= 0) {
    console.log(`${emjErrado} Inserir os dados!`)
    feedback.innerHTML = `${emjErrado} ${alertaErrado}`;
  } else {
    console.log('Muito bem!');
    feedback.innerHTML = `${emjCerto} ${alertaCerto}`;
  }
}

// ABAIXO CADASTRO DE ENTRE FUROS

// Função para enviar o formulário do cadastro de Entre Furos
function submitFormEf(event) {
  event.preventDefault();

  const emjCerto = '\u2714️';
  const emjErrado = '\u274C';

  // Obter valores do forms
  const entreFuros = document.getElementById('entreFuros').value;
  const produto = document.getElementById('produto').value;
  const parafuso = document.getElementById('parafuso').value;
  const botoeira = document.getElementById('botoeira').value;
  const fabricante = document.getElementById('fabricante').value;
  const observacoesEf = document.getElementById('observacoesEf').value;
  const imagem1 = document.getElementById('imagem1').value;
  const imagem2 = document.getElementById('imagem2').value;
  const imagem3 = document.getElementById('imagem3').value;
  const imagem4 = document.getElementById('imagem4').value;
  const imagem5 = document.getElementById('imagem5').value;

  // Criar um objeto com os valores acima

  const padraoFabricante = {
    entreFuros,
    produto,
    parafuso,
    botoeira,
    fabricante,
    observacoesEf,
    imagem1,
    imagem2,
    imagem3,
    imagem4,
    imagem5,
  };

  // POST para o server
  fetch('http://localhost:5500/cadastrarEf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(padraoFabricante)
  })
    .then(resposta => resposta.json())
    .then(data => {
      // Processa a resposta do servidor conforme necessário
      console.log(data);
      alert(`${emjCerto} Cadastro de Entre Furos realizado com sucesso!`)
    })
    .catch(error => {
      // Erros de requisição
      console.error('Erro:', error);
      alert(`${emjErrado} Não foi possível realizar o cadastro!`)
    })
}

// Função para adicionar o event listener ao formulário
function adicionarEventoFormsEf() {
  const formEf = document.getElementById('formEf');
  if (formEf) {
    formEf.addEventListener('submit', submitFormEf);
  } else {
    console.error("Elemento 'formEf' não encontrado.");
  }
}

document.addEventListener('DOMContentLoaded', adicionarEventoFormsEf);
