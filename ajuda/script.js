
function search() {
  const searchTerm = document.getElementById("txtPesquisar-hp").value.toUpperCase();
  // lista de estados do Brasil
  const estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES',
    'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  // objeto mapeando cada estado para o arquivo HTML correspondente
  const estadoToHtml = {
    'SP': 'clientesSP.html',
    'RJ': 'clientesRJ.html',
    'SC': 'clientesSantaCatarina.html',
    // adicione mais estados e arquivos HTML aqui
  };

  for (let i = 0; i < estados.length; i++) {
    const estado = estados[i];
    if (estado.startsWith(searchTerm)) {
      const htmlFile = estadoToHtml[estado];
      if (htmlFile) {
        window.location.href = htmlFile; //COMO UTILIZAR ESSE SCRIPT//
        return;
      }
    }
  }

  alert('Nenhum cliente encontrado para o UF digitado.');
}
      


function voltarPesquisa () {
  window.location.href = "index.html"; // substitua "index.html" pelo caminho da sua página inicial
  document.getElementById("txtPesquisar-hp").focus(); // coloca o foco na barra de pesquisa
}
