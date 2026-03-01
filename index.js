const express = require('express');
const app = express();
const PORTA = 3000;

app.get('/', (req, res) => {
    res.send('API de Transferência Pública operando com dados reais!');
});

// 
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

app.listen(PORTA, () => {
    console.log('Servidor Fullstack rodando na porta ${PORTA}!');
});