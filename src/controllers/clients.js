const response = require('../utils/response');
const repositorioClientes = require('../repositories/clients');
// const Bills =

const testarExistenciaCliente = async (email = null, cpf = null, id_user) => {
	let clienteExistenteEmail;
	let clienteExistenteCPF;

	if (email) {
		clienteExistenteEmail = await repositorioClientes.obterCliente('email', email, id_user);
	}

	if (cpf) {
		clienteExistenteCPF = await repositorioClientes.obterCliente('cpf', cpf, id_user);
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

	const clienteExistente = await testarExistenciaCliente(email, cpf, ctx.state.userId);
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

	const cliente = await repositorioClientes.obterCliente('id', id, ctx.state.userId);
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

	const clienteExistente = await testarExistenciaCliente(novoCliente.email, novoCliente.cpf, ctx.state.userId);
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

const listarClientes = async (ctx) => {
	const { offset = 0, clientesPorPagina = 10, busca = null } = ctx.query;
	const { userId } = ctx.state;

	const req = { id_user: userId, busca, offset, limit: clientesPorPagina };
	let clientes;

	if (!busca) {
		clientes = await repositorioClientes.listarClientesSemBusca(req);

		if (clientes.length === 0) {
			return response(ctx, 204, {
				mensagem: 'Não existem clientes cadastrados para esse usuário!',
			});
		}
	} else {
		clientes = await repositorioClientes.listarClientesComBusca(req);

		if (clientes.length === 0) {
			return response(ctx, 204, {
				mensagem: 'Não existem clientes para essa busca!',
			});
		}
	}

	const clientesCompletos = clientes.map((cliente) => {
		// const cobrancasFeitas = await Bills.
		// const cobrancasRecebidas = await Bills.
		return {
			nome: cliente.nome,
			email: cliente.email,	
			cobrancasFeitas: 0,
			cobrancasRecebidas: 0,
			estaInadimplente: false,
		};
	});

	return response(ctx, 200, { clientes: [...clientesCompletos] });
};

module.exports = {
	criarCliente,
	editarCliente,
	listarClientes,
};
