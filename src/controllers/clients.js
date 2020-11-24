const response = require('../utils/response');
const repositorioClientes = require('../repositories/clients');

const criarCliente = async (ctx) => {
	const { nome, cpf, email, tel } = ctx.request.body;
	if (!nome || !cpf || !email || !tel) {
		return response(ctx, 403, { mensagem: "Requisição mal formatada" })
	}

	const clienteExistenteEmail = await repositorioClientes.obterCliente('email', email);
	const clienteExistenteCPf = await repositorioClientes.obterCliente("cpf", cpf);
	if (clienteExistenteEmail || clienteExistenteCPf) {
		return (response(ctx, 403, { mensagem: "Cliente já cadastrado!" }));
	}

	const novoCliente = {
		id_user: ctx.state.userId,
		nome, 
		cpf,
		email,
		tel,
	};
	
	const retorno = await repositorioClientes.criarCliente(novoCliente)
	return response(ctx, 201, { id: retorno.id })
}

module.exports = {
	criarCliente,
}