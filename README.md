# Monitoramento Parlamentar API

Um serviço backend desenvolvido em Node.js projetado para consumir dados abertos do governo brasileiro e gerenciar um sistema interno de alertas políticos. 

Este projeto foi construído como parte prática do curso de Análise e Desenvolvimento de Sistemas, com foco em integração de APIs de terceiros (Governo Federal) e persistência de dados utilizando bancos relacionais.

## O problema que este projeto resolve
O sistema atua em duas frentes:
1. Conecta-se diretamente ao Portal de Dados Abertos da Câmara dos Deputados para processar e retornar a atual distribuição partidária.
2. Fornece uma interface de comunicação (CRUD) para que o usuário possa cadastrar, consultar, atualizar e deletar motivos de monitoramento ou fiscalização sobre partidos específicos.

## Stack Tecnológico
- **Node.js**: Ambiente de execução.
- **Express.js**: Roteamento e middlewares.
- **SQLite / SQLite3**: Banco de dados relacional leve para armazenamento local.
- **CORS**: Liberação de acesso para futuras integrações com o Frontend.
- **Fetch API nativa**: Para requisições HTTP externas.

---

## Como executar o projeto localmente 

Pré-requisito: É necessário ter o **Node.js** instalado na sua máquina (verifique digitando `node -v` no terminal).

**Passo 1: Obter o código-fonte**
Clone este repositório no seu terminal:
\`\`\`bash
git clone [https://github.com/biatricecantaluppi/api-transparencia-publica.git]
\`\`\`

**Passo 2: Instalar as dependências**
Acesse a pasta do projeto e instale os pacotes necessários (Express, SQLite e CORS):
\`\`\`bash
npm install express sqlite sqlite3 cors
\`\`\`

**Passo 3: Iniciar o servidor**
Dê o comando de partida da aplicação:
\`\`\`bash
node index.js
\`\`\`
O servidor estará rodando na porta `3000`. O arquivo do banco de dados (`banco_de_dados.db`) e suas respectivas tabelas serão criados automaticamente na raiz do projeto logo na primeira execução.

---

## Referência da API (Endpoints)

As requisições podem ser testadas via navegador (para rotas GET) ou utilizando ferramentas como Thunder Client, Postman ou Insomnia.

### Dados Governamentais
- **`GET /analise/deputados`**: Retorna o total de deputados em exercício e a contagem de cadeiras por partido, consumindo a API oficial da Câmara.

### Sistema de Alertas (CRUD Local)
- **`GET /alertas`**: Lista todos os alertas de monitoramento cadastrados no banco.
- **`POST /alertas`**: Cria um novo alerta.
  - Payload esperado (JSON): `{ "partido": "PL", "motivo": "Acompanhamento de votações de pautas econômicas" }`
- **`PUT /alertas/:id`**: Atualiza os dados de um alerta existente com base no ID da URL.
  - Payload esperado (JSON): `{ "partido": "Novo Partido", "motivo": "Novo motivo atualizado" }`
- **`DELETE /alertas/:id`**: Remove um alerta específico do banco de dados.
