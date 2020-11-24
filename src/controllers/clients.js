const Clients = require('../repositories/clients');
// const Bills =
const response = require('../utils/response');

const obterTodosClientes = async (ctx) => {
	const { offset = 0, limit = 10 } = ctx.params;
	const { userId } = ctx.state;

	const req = { id_user: userId, offset, limit };
	const clientes = await Clients.obterTodosClientes(req);
	if (!clientes) {
		return response(ctx, 404, {
			mensagem:
				'Erro! Não existem clientes cadastrados para esse usuário!',
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
	const clientes = await Clients.buscarClientes(req);

	if (!clientes) {
		return response(ctx, 404, {
			mensagem:
				'Erro! Não existem clientes cadastrados para esse usuário!',
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

module.exports = { obterTodosClientes, buscarClientes };
