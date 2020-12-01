const repositorioUsers = require('../repositories/users');
const response = require('../utils/response');
const { enviarEmailNovoUsuário } = require('../utils/email')

const criarUsuario = async (ctx) => {
	const { email = null, nome = null } = ctx.request.body;
	const { hash } = ctx.state;

	if (!email || !nome) {
		return response(ctx, 400, { messagem: 'Pedido mal-formatado!' });
	}

	const existeUsuario = await repositorioUsers.obterUsuarioPorEmail(email);

	if (existeUsuario) {
		return response(ctx, 400, {
			messagem: 'E-mail de usuário já cadastrado!',
		});
	}

	const usuario = { email, senha: hash, nome };

	const result = await repositorioUsers.criarUsuario(usuario);

	enviarEmailNovoUsuário(email);

	return response(ctx, 201, { id: result.id });
};

module.exports = { criarUsuario };
