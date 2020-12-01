# Cubos Academy - desafio04--backend

## O que é este projeto? 

<p>Este projeto é o quarto e último desafio do Curso intensivo de programação do zero, ministrado pela Cubos Academy e foi feito por Rafael Almeida e Felipe Isaac Ferreira. 
O desafio consistia em desenvolver uma plataforma na qual os usuários podem gerenciar seus clientes e seus respectivos pagamentos. Entre as funcionalidades,
consta a criação de usuário, criação e edição de clientes, criação e pagamento de cobranças, entre outras.</p>

<p> O projeto possui um código para Front-end que está em outro repositório. Caso exista interesse, <a href='https://github.com/alsantosrafael/cubos-desafio04--frontend'>clique aqui</a></p>

## O que este projeto utiliza?

- javascript;
- `Koa`, para criar o servidor;
- `dotenv`, para guardar os segredos;
- `eslint`, para manter a consistência do código;
- `jwt`, para a funcionalidade de sessão;
- `axios`, para a integração com a api externa.

## Como instalar e rodar este projeto?

### Variáveis de ambiente

<p> O projeto possui algumas variáveis de ambiente. Para preenche-las, renomeie o arquivo `.env-example` para `.env` e preencha-as.</p>

<p> Segue uma relação das variáveis de ambiente:</p>

| Variável           | Datatype | Descrição                                                               |
| ------------------ | -------- | ----------------------------------------------------------------------- |
| JWT_SECRET=        | string   | String utilizada como segredo para encriptar token de acesso a API;     |
| JWT_EXPIRING_TIME= | string   | Tempo de expiração do token de acesso. Formato: '7d' equivale a 7 dias; |
| PAGARME_BASE_URL=  | string   | URL Base para interagir com a Pagar.me;                                 |
| PAGARME_CHAVE=     | string   | Chave utilizada para interagir com a Pagar.me;                          |
| PORT=              | number   | Porta de utilização da aplicação;                                       |
| DB_URI=            | string   | Link para conexão com o banco de dados;                                 |
| MAILTRAP_HOST=     | string   | Link para acesso ao mailtrap;                                           |
| MAILTRAP_USER=     | string   | Usuário de Acesso a conta do mailtrap;                                  |
| MAILTRAP_PORT=     | number   | Porta de acesso a conta do mailtrap;                                    |
| MAILTRAP_PW=       | number   | Senha de Acesso a conta do mailtrap;                                    |


<p> Para obter sua própria chave da pagar.me, faça o cadastro <a href='https://beta.dashboard.sandbox.pagar.me/#/account/login'>aqui</a>.</p>
<p> Para obter suas variáveis do mailtrap, é necessário criar a conta <a href='https://mailtrap.io/register/signup?ref=header'>aqui</a>.</p>

### Rodando o projeto

<p> Baixar o repositório, preencher as variáveis de ambiente e rodar `npm ci`;</p>
<p> Em seguida, rodar o comando `npm run createTables`, para que as tabelas sejam criadas no banco de dados;</p>
<p> Em seguida, basta rodar o comando `npm run start` para poder utilizar.</p>

## Funcionalidades

- Autenticação:
  - A funcionalidade de autenticação de sessão funciona requisitando `POST /auth`.
  
- Usuarios
  - A funcionalidade de cadastro de usuários funciona requisitando `POST /usuarios`.
  
- Clientes
  - A funcionalidade de cadastro de clientes funciona requisitando `POST /clientes`;
  - A funcionalidade de listagem de clientes funciona requisitando `GET /clientes`;
  - A funcionalidade de edição de clientes funciona requisitando `PUT /clientes`.
  
- Cobranças 
  - A funcionalidade de criação de cobranças funciona requisitando `POST /cobrancas`;
  - A funcionalidade de listagem de cobranças funciona requisitando `GET /cobrancas`;
  - A funcionalidade de pagamento de cobranças funciona requisitando `PUT /cobrancas`.
  
- Relatório
  - A funcionalidade de geração de relatório funciona requisitando `GET /relatorios`
  
  
 ## Fluxo da aplicação
 
 <p> Segue um pequeno fluxo para testar as funcionalidades do projeto: </p>
 
 1) Criar um usuário;
 2) Autenticação do usuário e obtenção do token de acesso;
 3) Criação novo cliente;
 4) Edição de cliente;
 5) Listagem de clientes;
 6) Criação de nova cobrança;
 7) Pagamento de cobrança;
 8) Listagem de cobranças;
 9) Obtençao de relatório.
 
 nota: A funcionalidade de relatório não poderá ser visualizada propriamente, visto o baixo volume de clientes e de cobranças. Além disso, para que existam clientes inadimplentes, 
 é necessária que existam cobranças vencidas, porém a criação de cobranças com datas passadas é proibida pelo programa. Desta maneira, caso exista interesse de ver clientes 
 inadimplentes, se faz necessária a inserção de cobranças diretamente pelo banco de dados.
 
 
  
  
  
