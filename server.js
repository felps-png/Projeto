const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const newLocal = 'express-static';
const expressStatic = require(newLocal);
const app = express();
const port = 5500;
const pastaImagem = 'N:\\ARQUIVOS CAD\\- INFORMACOES GERAIS\\! PROJETO_CONSULTA';


// Configurar as informações de conexão com o banco de dados
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'elevcom@4815',
  database: 'clienteinformativo',
  charset: 'utf8mb4' // Define a codificação como UTF-8
});

// Middleware para analisar o corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/imagensPavimento', expressStatic(pastaImagem));

// Configurar as opções CORS
app.use(cors());

// Rota para buscar os dados da tabela "informacoescliente"
app.get('/informacoescliente', (req, res) => {
  const termoBusca = req.query.searchTerm || '';

  // Executar uma consulta na tabela "informacoescliente" filtrando pelo nome do cliente
  connection.query('SELECT * FROM informacoescliente WHERE nome LIKE ? OR codigo LIKE ? ', [`%${termoBusca}%`, `%${termoBusca}%`], (error, results) => {
    if (error) {
      console.error('Erro ao executar consulta na tabela "informacoescliente": ', error);
      res.status(500).json({ error: 'Erro ao buscar os dados.' });
    } else {
      res.setHeader('Content-Type', 'application/json'); // Definir o cabeçalho Content-Type
      res.json(results); // Enviar a resposta JSON
    }
  });
});

// Rota cadastro cliente
app.post('/cadastrarCliente', (req, res) => {
  const { codigo, nome, estado, parafuso, visor, medidas, logotipo, produto, atendente, contato, observacoes } = req.body;

  // Faça a inserção dos dados no banco de dados
  connection.query(
    'INSERT INTO informacoescliente (codigo, nome, estado, parafuso, visor, medidas, logotipo, produto, atendente, contato, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [codigo, nome, estado, parafuso, visor, medidas, logotipo, produto, atendente, contato, observacoes],
    (error) => {
      if (error) {
        console.error('Erro ao cadastrar:', error);
        res.status(500).json({ error: 'Erro ao cadastrar.' });
      } else {
        res.json({ message: 'Cadastro realizado com sucesso.' });
      }
    }
  );
});

// Rota cadastro entre furos
app.post('/cadastrarEf', (req, res) => {
  const { entreFuros, produto, parafuso, botoeira, fabricante, observacoesEf, imagem1, imagem2, imagem3, imagem4, imagem5 } = req.body;


  // Fazer inserção dos dados no banco..
  connection.query(
    'INSERT INTO medidaspadroes (entreFuros, produto, parafuso, botoeira, fabricante, observacoesEf, imagem1, imagem2, imagem3, imagem4, imagem5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [entreFuros, produto, parafuso, botoeira, fabricante, observacoesEf, imagem1, imagem2, imagem3, imagem4, imagem5],
    (error) => {
      if (error) {
        console.error('Erro ao cadastrar:', error);
        res.status(500).json({ error: 'Erro ao cadastrar.' });
      } else {
        res.json({ message: 'Cadastro realizado com sucesso.' });
      }
    }
  );
});

// Rota para pesquisar cliente pelo ID
app.get('/clientes/:codigo', (req, res) => {
  const codigo = req.params.codigo;

  // Executar uma consulta no banco de dados para buscar o cliente pelo ID
  connection.query('SELECT * FROM informacoescliente WHERE codigo = ?', [codigo], (error, results) => {
    if (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({ error: 'Erro ao buscar cliente.' });
    } else {
      if (results.length > 0) {
        const cliente = results[0];
        res.json({ nome: cliente.nome, estado: cliente.estado, parafuso: cliente.parafuso, atendente: cliente.atendente, contato: cliente.contato });
      } else {
        res.status(404).json({ error: 'Cliente não encontrado.' });
      }
    }
  });
});

app.get('/medidas/:entreFuros', (req, res) => {
  const entreFuros = req.params.entreFuros || '';
  const buscarMedidas = `%${entreFuros}%`;

  connection.query('SELECT * FROM medidaspadroes WHERE entreFuros LIKE ? OR fabricante LIKE ? ', [buscarMedidas, buscarMedidas], (error, results) => {
    if (error) {
      console.error('Erro ao realizar a busca', error);
      res.status(500).json({ error: 'Erro ao buscar entre furos.' });
    } else {
      res.setHeader('Content-Type', 'application/json'); // Definir o cabeçalho Content-Type
      res.json(results); // Enviar a resposta JSON
    }
  });
});

// Iniciar o servidor e manter a conexão com o banco de dados
connection.connect((error) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } else {
    app.listen(port, () => {
      console.log(`Servidor rodando com sucesso em http://localhost:${port}`);
    });
  }
});
