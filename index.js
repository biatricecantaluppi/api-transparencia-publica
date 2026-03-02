const express = require('express');
const conectarBanco = require('./database'); // 1. importação da "receita" do banco de dados

const app = express();
const PORTA = 3000;

app.use(express.json());

let banco; // Variável global para guardar a nossa conexão com o banco

// Rota GET (Boas-vindas)
app.get('/', (req, res) => {
    res.send('API de Transparência Pública operando com Banco de Dados SQL!');
});

// Rota GET (Busca de deputados nos dados abertos)
app.get('/analise/deputados', async (req, res) => {
    try {
        const respostaGoverno = await fetch('https://dadosabertos.camara.leg.br/api/v2/deputados');
        const dadosGoverno = await respostaGoverno.json();
        const listaDeputados = dadosGoverno.dados;
        const contagemPorPartido = {};

        for (let deputado of listaDeputados) {
            let partido = deputado.siglaPartido;
            if (contagemPorPartido[partido]) {
                contagemPorPartido[partido] += 1;
            } else {
                contagemPorPartido[partido] = 1;
            }
        }
        res.json({
            status: 'Sucesso',
            totalDeputadosAtivos: listaDeputados.length,
            distribuicaoPartidario: contagemPorPartido
        });
    } catch (erro) {
        console.error('Falha ao buscar dados:', erro);
        res.status(500).json ({erro: 'Falha ao se comunicar com o Portal da Transparência.'});
    }
});

// Rota POST (Cadastro de alertas - AGORA COM SQL)
app.post('/alertas', async (req, res) => {
    const novoAlerta = req.body;

    if (!novoAlerta.partido || !novoAlerta.motivo) {
        return res.status(400).json ({ erro: 'Por favor, envie o partido e o motivo do alerta.'});
    }

    try {
        const dataAtual = new Date().toISOString(); // Padrão universal de datas

        // 2. Inserindo dados na tabela
        // usar as interrogações (?, ?, ?) para evitar ataques de hackers chamados "SQL Injection".
        const resultado = await banco.run(
            `INSERT INTO alertas (partido, motivo, data_criacao) VALUES (?, ?, ?)`,
            [novoAlerta.partido, novoAlerta.motivo, dataAtual]
        );

        // 3. O banco SQLite devolve automaticamente o "lastID" (o ID que ele acabou de gerar)
        res.status(201).json({
            mensagem: 'Alerta salvo no Banco de Dados com sucesso!',
            idGerado: resultado.lastID
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Falha ao salvar no banco de dados.' });
    }
});

// rota GET (busca de alertas salvos no banco de dados)
app.get('/alertas', async (req, res) => {
    try {
        // No SQL: o 'SELECT *' puxa todas as colunas de todos os registros
        //usar banco.all() para lista completa
        const todosOsAlertas = await banco.all('SELECT * FROM alertas');

        res.status(200).json({
            status: 'Sucesso',
            totalAlertaSalvos: todosOsAlertas.length,
            dados: todosOsAlertas
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({erro: 'Falha ao buscar os alertas no banco de dados.'});
    }
});
// 4. Primeiro ligar o Banco, depois o Servidor.
conectarBanco().then((conexaoPronta) => {
    banco = conexaoPronta; // Guarda a conexão estabelecida na nossa variável
    
    app.listen(PORTA, () => {
        console.log(`Servidor e Banco de Dados (SQLite) rodando na porta ${PORTA}! 💾`);
    });
}).catch((erro) => {
    console.error("Erro fatal ao conectar no banco:", erro);
});