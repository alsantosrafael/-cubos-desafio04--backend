const jwt = require('jsonwebtoken');
const response = require('../utils/response');

// require('dotenv').config();

const verifica = async (ctx, next) => {
	const [, token] = ctx.headers.authorization.split(' ');

	try {
		const verificacao = await jwt.verify(token, process.env.JWT_SECRET);

		ctx.state.userId = verificacao.id;
		ctx.state.email = verificacao.email;
	} catch (err) {
		return response(ctx, 'Ação proibida', 403, 'Erro!');
	}
	return next();
};

module.exports = { verifica };
