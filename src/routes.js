const Router = require('koa-router');

const router = new Router();
const Autenticar = require('./controllers/auth');
const Users = require('./controllers/users');
const Clients = require('./controllers/clients')
const Password = require('./middlewares/encrypt');
const Session = require('./middlewares/session');
const controllerCobranca = require('./controllers/bills')

/*
 ** Definição de rotas
 */
// auth
router.post('/auth', Autenticar);

// usuários
router.post('/usuarios', Password.encrypt, Users.criarUsuario);

// clientes
router.post('/clientes', Session.verifica, Clients.criarCliente);
router.put('/clientes', Session.verifica, Clients.editarCliente);
router.get('/clientes', Session.verifica, Clients.listarClientes);

// cobranças
router.post('/cobrancas', Session.verifica, controllerCobranca.criarCobranca);
router.get('/cobrancas', Session.verifica, controllerCobranca.listarCobrancas);

module.exports = router;
