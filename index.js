const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

require('dotenv').config();

const PORT = process.env.PORT || 8000;
// Ou o usuário insere a porta com um arquivo
// .env ou a porta usada será a 8000
const server = new Koa();
const router = require('./src/routes');

server.use(bodyparser());

server.use(router.routes());

server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}!`);
});
