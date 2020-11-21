const Password = require('../utils/password');
const response = require('../utils/response');

/**
 * Função responsável por encriptar a senha do usuário quando ele for cadastrado
 * @param {*Contexto} ctx
 * @param {*Next} next
 */
const encrypt = async (ctx, next) => {
	const { senha = null } = ctx.request.body;

	if (!senha) {
		return response(ctx, 'Pedido mal formatado.', 400);
	}

	const hash = await Password.encrypt(senha);

	ctx.state.hash = hash;
	return next();
};

module.exports = { encrypt };
