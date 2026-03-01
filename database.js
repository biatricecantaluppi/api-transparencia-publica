// Importação das ferramentas do banco de dados (com o modo detalhista ativado)
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

// Função assíncrona para abrir a conexão com o banco
async function conectarBanco() {
    // chamar o open diretamente de dentro do pacote sqlite importado
    const banco = await sqlite.open({
        filename: './banco_de_dados.db', // O arquivo que será criado na sua pasta
        driver: sqlite3.Database
    });

    // uso de SQL para criar a nossa tabela, caso ela não exista!
    await banco.exec(`
        CREATE TABLE IF NOT EXISTS alertas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            partido TEXT,
            motivo TEXT,
            data_criacao TEXT
        )
    `);

    return banco;
}

// exportação da função para usar no index.js
module.exports = conectarBanco;