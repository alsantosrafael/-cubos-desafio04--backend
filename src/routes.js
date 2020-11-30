const Router = require('koa-router');

const router = new Router();
const passwordMiddleware = require('./middlewares/encrypt');
const sessionMiddleware = require('./middlewares/session');
const authController = require('./controllers/auth');
const usersController = require('./controllers/users');
const clientsController = require('./controllers/clients');
const cobrancaController = require('./controllers/bills');
const relatorioController = require('./controllers/relatorio');

/*
 ** Definição de rotas
 */
// auth
router.post('/auth', authController.autenticar);

// usuários
router.post('/usuarios', passwordMiddleware.encrypt, usersController.criarUsuario);

// clientes
router.post('/clientes', sessionMiddleware.verifica, clientsController.criarCliente);
router.put('/clientes', sessionMiddleware.verifica, clientsController.editarCliente);
router.get('/clientes', sessionMiddleware.verifica, clientsController.listarClientes);

// cobranças
router.post('/cobrancas', sessionMiddleware.verifica, cobrancaController.criarCobranca);
router.get('/cobrancas', sessionMiddleware.verifica, cobrancaController.listarCobrancas);
router.put('/cobrancas', sessionMiddleware.verifica, cobrancaController.pagarCobranca);

// relatório 
router.get('/relatorios', sessionMiddleware.verifica, relatorioController.obterRelatorio)

module.exports = router;
