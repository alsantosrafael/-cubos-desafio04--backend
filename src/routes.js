const Router = require('koa-router');

const router = new Router();

/*
 ** Definição de rotas
 */
router.get('/', (ctx) => {
	ctx.body = 'Hello, World!';
});
module.exports = router;
