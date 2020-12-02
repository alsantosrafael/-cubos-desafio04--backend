const jwt = require('jsonwebtoken');
const response = require('../utils/response');

/**
 * Verifica se o usuário possui token autorizado.
 * @param {contect} ctx 
 * @param {*} next 
 */
const verifica = async (ctx, next) => {
	const { authorization } = ctx.headers

	if (typeof authorization === 'string') {
		const [, token] = ctx.headers.authorization.split(' ');

		try {
			const verificacao = await jwt.verify(token, process.env.JWT_SECRET);

			ctx.state.userId = verificacao.id;
			ctx.state.email = verificacao.email;
		} catch (err) {
			return response(ctx, 401, { mensagem: "Você não tem autorização para efetuar esta ação." });
		}
		return next();
	}
	return response(ctx, 401, { mensagem: "Você não tem autorização para efetuar esta ação." });
	
};

module.exports = { verifica };
