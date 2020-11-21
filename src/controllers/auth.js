const Users = require('../repositories/users');
const jwt = require('jsonwebtoken');
const response = require('../utils/response');
const Password = require('../utils/password');

require('dotenv').config();

const autenticar = async (ctx) => {
	const { email = null, senha = null } = ctx.request.body;
	if (!email || !senha) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado' });
	}

	const user = Users.obterUsuarioPorEmail(email);

	if (user) {
		const compara = await Password.checarSenha(senha, user.senha);
		if (compara) {
			const token = await jwt.sign(
				{ id: user.id, email: user.email },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			);
			return response(ctx, 200, { token });
		}
	}
	return response(ctx, 200, { mensagem: 'Email ou senha incorretos' });
};

module.exports = autenticar;
