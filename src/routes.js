const Router = require('koa-router');

const router = new Router();
const PasswordMiddleware = require('./middlewares/encrypt');
const SessionMiddleware = require('./middlewares/session');
const Autenticar = require('./controllers/auth');
const UsersController = require('./controllers/users');
const ClientsController = require('./controllers/clients');
const cobrancaController = require('./controllers/bills');
const obterRelatorio = require('./controllers/relatorio');

/*
 ** Definição de rotas
 */
// auth
router.post('/auth', Autenticar);

// usuários
router.post('/usuarios', PasswordMiddleware.encrypt, UsersController.criarUsuario);

// clientes
router.post('/clientes', SessionMiddleware.verifica, ClientsController.criarCliente);
router.put('/clientes', SessionMiddleware.verifica, ClientsController.editarCliente);
router.get('/clientes', SessionMiddleware.verifica, ClientsController.listarClientes);

// cobranças
router.post('/cobrancas', SessionMiddleware.verifica, cobrancaController.criarCobranca);
router.get('/cobrancas', SessionMiddleware.verifica, cobrancaController.listarCobrancas);
router.put('/cobrancas', SessionMiddleware.verifica, cobrancaController.pagarCobranca);

// relatório 
router.get('/relatorios', SessionMiddleware.verifica, obterRelatorio)

module.exports = router;
