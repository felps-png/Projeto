const { app, BrowserWindow } = require('electron');
const path = require('path');

// Mantenha uma referência global do objeto da janela, se você não fizer isso, a janela será fechada automaticamente quando o objeto JavaScript for coletado pelo coletor de lixo.
let mainWindow;

function createWindow() {
  // Crie uma janela de navegação.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // e carregar o arquivo index.html do seu aplicativo.
  mainWindow.loadFile('index.html');

  // Abrir o DevTools (Ferramentas de Desenvolvedor).
  // mainWindow.webContents.openDevTools();

  // Emitido quando a janela é fechada.
  mainWindow.on('closed', () => {
    // Elimina a referência ao objeto da janela, geralmente você armazena janelas em matrizes se o seu aplicativo suportar várias janelas, esse é o momento em que você deve excluir o elemento correspondente.
    mainWindow = null;
  });
}

// Este método será chamado quando o Electron terminar de inicializar e estiver pronto para criar janelas de navegador.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // Em macOS, é comum recriar uma janela no aplicativo quando o ícone da doca é clicado e não há outras janelas abertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Sair quando todas as janelas estiverem fechadas, exceto no macOS. No macOS, é comum que aplicativos e suas barras de menu permaneçam ativos até que o usuário saia explicitamente com Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Neste arquivo, você pode incluir o resto do código principal específico do seu aplicativo. Você também pode colocar eles em arquivos separados e requeridos-as aqui.
