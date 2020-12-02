const Password = require('../utils/password');
const response = require('../utils/response');

/**
 * Função responsável por encriptar a senha do usuário no momento do cadastro.
 * @param {*Contexto} ctx
 * @param {*Next} next
 */
const encrypt = async (ctx, next) => {
	const { senha = null } = ctx.request.body;

	if (!senha) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado.' });
	}

	const hash = await Password.encrypt(senha);

	ctx.state.hash = hash;
	return next();
};

module.exports = { encrypt };
