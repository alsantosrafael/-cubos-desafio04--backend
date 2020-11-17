const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const Cors = require('@koa/cors');

require('dotenv').config();

const PORT = process.env.PORT || 8000;

const server = new Koa();
const router = require('./src/routes');

server.use(bodyparser());
server.use(Cors());
server.use(router.routes());

server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}!`);
});
