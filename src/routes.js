const Router = require('koa-router');

const router = new Router();
const Autenticar = require('./controllers/auth');
const Users = require('./controllers/users');
const Clients = require('./controllers/clients')
const Password = require('./middlewares/encrypt');
const Session = require('./middlewares/session');
/*
 ** Definição de rotas
 */
router.post('/auth', Autenticar);

router.post('/usuarios', Password.encrypt, Users.criarUsuario);

router.post('/clientes', Session.verifica, Clients.criarCliente);
router.put('/clientes', Session.verifica, Clients.editarCliente);
//router.put('/clientes/:id', Session.verifica, Clients. )

module.exports = router;
