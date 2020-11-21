const Router = require('koa-router');

const router = new Router();
const Autenticar = require('./controllers/auth');
const Users = require('./controllers/users');
const Password = require('./middlewares/encrypt');
const Session = require('./middlewares/session');
/*
 ** Definição de rotas
 */
router.get('/', (ctx) => {
	ctx.body = 'Hello, World!';
});
router.post('/auth', Autenticar);
router.post('/usuarios', Password.encrypt, Users.criarUsuario);

module.exports = router;
