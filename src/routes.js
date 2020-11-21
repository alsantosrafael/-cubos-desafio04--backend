const Router = require('koa-router');

const router = new Router();

const Users = require('./controllers/users');

/*
 ** Definição de rotas
 */
router.get('/', (ctx) => {
	ctx.body = 'Hello, World!';
});

router.post('/usuarios', Users.criarUsuario);
module.exports = router;
