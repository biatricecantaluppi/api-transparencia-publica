const express = require('express');
const app = express();
const PORTA = 3000;

// 1. O Tradutor de JSON
app.use(express.json());

// 2. Nossa base de dados temporária (agora no plural, para bater com o código de baixo)
const alertasMonitoramento = [];

// Rota GET (Boas-vindas)
app.get('/', (req, res) => {
    res.send('API de Transparência Pública operando com dados reais!');
});

// Rota GET (Busca de deputados)
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
            }
            else {
                contagemPorPartido[partido] = 1;
            }
        }
        res.json({
            status: 'Sucesso',
            totalDeputadosAtivos: listaDeputados.length,
            distribuicaoPartidario: contagemPorPartido
        });
    }
    catch (erro) {
        console.error('Falha ao buscar dados:', erro);
        res.status(500).json ({erro: 'Falha ao se comunicar com o Portal da Transparência.'});
    }
});

// Rota POST (Cadastro de alertas)
app.post('/alertas', (req, res) => {
    const novoAlerta = req.body; // Pega o JSON que o usuário enviou

    // Validação de segurança
    if (!novoAlerta.partido || !novoAlerta.motivo) {
        return res.status(400).json ({ erro: 'Por favor, envie o partido e o motivo do alerta.'});
    }

    // Cria um ID e a data de hoje para o alerta
    novoAlerta.id = alertasMonitoramento.length + 1;
    novoAlerta.dataCriacao = new Date();

    // Salva na nossa lista
    alertasMonitoramento.push(novoAlerta);

    // Devolve Status 201 (Criado com sucesso)
    res.status(201).json({
        mensagem: 'Alerta cadastrado com sucesso!',
        alertaSalvo : novoAlerta
    });
});

// 3. O "botão de ligar" vai SEMPRE por último e só aparece uma vez!
app.listen(PORTA, () => {
    console.log(`Servidor Fullstack rodando na porta ${PORTA}!`);
});