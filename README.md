# Pipeline de Ingestão de Dados Públicos: Monitoramento Parlamentar 🏛️

Este projeto é um serviço especializado no consumo, tratamento e monitoramento de dados provenientes do Portal de Dados Abertos do Governo Brasileiro. O foco principal é a criação de um fluxo de dados (pipeline) que integra informações públicas com critérios personalizados de fiscalização política.

##  Objetivo do Projeto
Centralizar e estruturar dados governamentais para facilitar a análise da distribuição partidária e permitir o monitoramento customizado de atividades parlamentares através de um sistema de alertas.

##  Tecnologias e Ferramentas
* **Ambiente:** Node.js
* **Framework de Serviço:** Express.js
* **Armazenamento e Estruturação:** SQLite (Banco de Dados Relacional)
* **Ingestão de Dados:** Fetch API nativa para consumo de dados externos da Câmara dos Deputados.

##  Fluxo de Dados (Data Workflow)
1. **Ingestão (Ingestion):** Conexão direta com a API da Câmara dos Deputados para extração de dados brutos em tempo real.
2. **Processamento (Processing):** Filtagem e mapeamento da distribuição partidária para o esquema de dados interno.
3. **Persistência & Enriquecimento:** Armazenamento em banco relacional, permitindo que o dado público seja enriquecido com metadados de fiscalização (CRUD de monitoramento).
4. **Entrega (Delivery):** Disponibilização dos dados tratados através de uma API própria, pronta para consumo por ferramentas de BI ou interfaces de usuário.

##  Diferenciais de Análise
* **Transparência Automática:** Redução da latência entre a atualização dos dados do governo e a disponibilidade para análise interna.
* **Integridade Relacional:** Uso de SQLite para garantir que cada motivo de monitoramento esteja corretamente vinculado à entidade partidária correspondente.
* **Escalabilidade de Consulta:** Estrutura pronta para suportar futuras integrações com dashboards de visualização de dados.

##  Organização do Sistema
* `Câmera Ingestion`: Lógica de consumo da API governamental.
* `Data Schema`: Definição da estrutura relacional dos partidos e alertas.
* `Access Layer`: Interface de comunicação para consulta e gestão dos dados.

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
