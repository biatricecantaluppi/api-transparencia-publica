const express = require('express');
const conectarBanco = require('./database'); 

const app = express();
const PORTA = 3000;

app.use(express.json());

let banco; 

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

// Rota POST (Criar novo alerta no Banco de Dados)
app.post('/alertas', async (req, res) => {
    const novoAlerta = req.body;

    if (!novoAlerta.partido || !novoAlerta.motivo) {
        return res.status(400).json ({ erro: 'Por favor, envie o partido e o motivo do alerta.'});
    }

    try {
        const dataAtual = new Date().toISOString(); 
        const resultado = await banco.run(
            `INSERT INTO alertas (partido, motivo, data_criacao) VALUES (?, ?, ?)`,
            [novoAlerta.partido, novoAlerta.motivo, dataAtual]
        );

        res.status(201).json({
            mensagem: 'Alerta salvo no Banco de Dados com sucesso!',
            idGerado: resultado.lastID
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Falha ao salvar no banco de dados.' });
    }
});

// Rota GET (Ler todos os alertas salvos)
app.get('/alertas', async (req, res) => {
    try {
        const todosOsAlertas = await banco.all('SELECT * FROM alertas');
        res.status(200).json({
            status: 'Sucesso',
            totalAlertasSalvos: todosOsAlertas.length,
            dados: todosOsAlertas
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Falha ao buscar os alertas no banco de dados.' });
    }
});

// Rota DELETE (Apagar um alerta pelo ID)
app.delete('/alertas/:id', async (req, res) => {
    const idDoAlerta = req.params.id; 

    try {
        const resultado = await banco.run(
            'DELETE FROM alertas WHERE id = ?',
            [idDoAlerta]
        );

        if (resultado.changes === 0) {
            return res.status(404).json({ erro: 'Nenhum alerta encontrado com esse ID.' });
        }

        res.status(200).json({ mensagem: `Alerta ${idDoAlerta} apagado com sucesso do banco!` });
        
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Falha ao tentar apagar o alerta.' });
    }
});

// Rota PUT (Atualizar um alerta pelo ID - CORRIGIDA)
app.put('/alertas/:id', async (req, res) => {
    const idDoAlerta = req.params.id; 
    const dadosAtualizados = req.body; 

    if (!dadosAtualizados.partido || !dadosAtualizados.motivo) {
        return res.status(400).json({ erro: 'Por favor, envie o partido e o motivo atualizados.' });
    }

    try {
        const resultado = await banco.run(
            `UPDATE alertas SET partido = ?, motivo = ? WHERE id = ?`,
            [dadosAtualizados.partido, dadosAtualizados.motivo, idDoAlerta]
        );

        if (resultado.changes === 0) {
            return res.status(404).json({ erro: 'Nenhum alerta encontrado com esse ID.' });
        }

        res.status(200).json({ mensagem: `Alerta ${idDoAlerta} atualizado com sucesso no banco de dados!` });
        
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Falha ao tentar atualizar o alerta.' });
    }
});

// Ligando o Banco e o Servidor
conectarBanco().then((conexaoPronta) => {
    banco = conexaoPronta; 
    
    app.listen(PORTA, () => {
        console.log(`Servidor e Banco de Dados (SQLite) rodando na porta ${PORTA}! 💾`);
    });
}).catch((erro) => {
    console.error("Erro fatal ao conectar no banco:", erro);
});