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

const editarCliente = async (ctx) => {
	const { id, nome, cpf, email, tel, deletado } = ctx.request.body;

	const cliente = await repositorioClientes.obterCliente("id", id)
	
	if (!cliente) {
		return response(ctx, 404, { mensagem: "cliente não encontrado" })
	}

	if (cliente.deletado) {
		return (ctx, 403, { mensagem: "o cliente foi deletado." })
	}

	const novoCliente = {
		id,
		id_user: cliente.id_user,
		nome: nome ? nome : cliente.nome,
		cpf: cpf ? cpf : cliente.cpf,
		email: email ? email : cliente.email,
		tel: tel ? tel : cliente.tel,
		deletado: deletado ? deletado : cliente.deletado
	}

	const retorno = await repositorioClientes.editarCliente(novoCliente);
	return response(ctx, 200, { 
		id: retorno.id,
		nome: retorno.nome,
		cpf: retorno.cpf,
		email: retorno.email  
	})
}

module.exports = {
	criarCliente,
	editarCliente
}