const Users = require('../repositories/users');
const response = require('../utils/response');

const criarUsuario = (ctx) => {
	const { email = null, nome = null } = ctx.request.body;
	const { hash } = ctx.state;
	if (!email || !nome) {
		return response(ctx, 400, { messagem: 'Pedido mal-formatado!' });
	}

	const existeUsuario = await Users.obterUsuarioPorEmail(email);

	if(existeUsuario) {
		return response(ctx, 400, { messagem: 'E-mail de usuário já cadastrado!' });
	}

	const usuario = {email, senha: hash, nome};

	const result = await Users.criarUsuario(usuario);

	/*Adicionar email de confirmação/registro */

	return response(ctx, 201, result)

};

module.exports = { criarUsuario };
