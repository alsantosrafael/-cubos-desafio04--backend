const response = require('../utils/response');
const repositorioClientes = require('../repositories/clients');
// const Bills =

const testarExistenciaCliente = async (email = null, cpf = null) => {
	let clienteExistenteEmail;
	let clienteExistenteCPF;

	if (email) {
		clienteExistenteEmail = await repositorioClientes.obterCliente(
			'email',
			email
		);
	}

	if (cpf) {
		clienteExistenteCPF = await repositorioClientes.obterCliente(
			'cpf',
			cpf
		);
	}

	if (clienteExistenteEmail || clienteExistenteCPF) {
		return true;
	} else {
		return false;
	}
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

const criarCliente = async (ctx) => {
	const { nome, cpf, email, tel } = ctx.request.body;
	if (!nome || !cpf || !email || !tel) {
		return response(ctx, 400, { mensagem: 'Requisição mal formatada' });
	}

	const clienteExistente = await testarExistenciaCliente(email, cpf);
	if (clienteExistente) {
		return response(ctx, 403, { mensagem: 'Cliente já cadastrado!' });
	}

	const novoCliente = {
		id_user: ctx.state.userId,
		nome,
		cpf,
		email,
		tel,
	};

	const retorno = await repositorioClientes.criarCliente(novoCliente);
	return response(ctx, 201, { id: retorno.id });
};

const editarCliente = async (ctx) => {
	const { id, nome, cpf, email, tel, deletado } = ctx.request.body;
	if (!id) {
		return response(ctx, 400, { mensagem: 'Não foi localizada id' })
	}

	const cliente = await repositorioClientes.obterCliente('id', id);
	if (!cliente) {
		return response(ctx, 404, { mensagem: 'Cliente não encontrado' });
	}

	if (cliente.id_user !== ctx.state.userId) {
		return response(ctx, 401, { mensagem: "Você não tem autorização para efetuar esta ação." });
	}

	const novoCliente = {
		id,
		id_user: cliente.id_user,
		nome: nome ? nome : cliente.nome,
		cpf: cpf ? cpf : cliente.cpf,
		email: email ? email : cliente.email,
		tel: tel ? tel : cliente.tel,
		deletado: deletado ? deletado : cliente.deletado,
	};

	const clienteExistente = await testarExistenciaCliente(novoCliente.email, novoCliente.cpf);
	if (clienteExistente) {
		if (novoCliente.id !== id) {
			return response(ctx, 403, { mensagem: 'Os dados fornecidos já estão em uso' });
		}
	}

	const retorno = await repositorioClientes.editarCliente(novoCliente);
	return response(ctx, 200, {
		id: retorno.id,
		nome: retorno.nome,
		cpf: retorno.cpf,
		email: retorno.email,
	});
};

const obterTodosClientes = async (ctx) => {
	const { offset = 0, limit = 10 } = ctx.params;
	const { userId } = ctx.state;

	const req = { id_user: userId, offset, limit };
	const clientes = await repositorioClientes.obterTodosClientes(req);
	if (!clientes) {
		return response(ctx, 404, {
			mensagem: 'Não existem clientes cadastrados para esse usuário!',
		});
	}
	const clientesCompletos = clientes.map((cliente) => {
		// const cobrancasFeitas = await Bills.
		// const cobrancasRecebidas = await Bills.
		return {
			nome: cliente.nome,
			email: cliente.email,
			tel: cliente.tel /*VER COM JUNINHO SE COLOCA OU NAO */,
			cobrancasFeitas: 0,
			cobrancasRecebidas: 0,
			estaInadimplente: false,
		};
	});

	return response(ctx, 201, { clientesCompletos });
};

const buscarClientes = async (ctx) => {
	const { busca } = ctx.request.body;
	const { offset = 0, limit = 10 } = ctx.params;
	const { userId } = ctx.state;

	const req = { id_user: userId, busca, offset, limit };
	const clientes = await repositorioClientes.buscarClientes(req);

	if (!clientes) {
		return response(ctx, 404, {
			mensagem: 'Não existem clientes cadastrados para esse usuário!',
		});
	}

	const clientesCompletos = clientes.map((cliente) => {
		// const cobrancasFeitas = await Bills.
		// const cobrancasRecebidas = await Bills.
		return {
			nome: cliente.nome,
			email: cliente.email,
			tel: cliente.tel /*VER COM JUNINHO SE COLOCA OU NAO */,
			cobrancasFeitas: 0,
			cobrancasRecebidas: 0,
			estaInadimplente: false,
		};
	});

	return response(ctx, 201, { clientesCompletos });
};

module.exports = {
	criarCliente,
	editarCliente,
	obterTodosClientes,
	buscarClientes,
};
