const response = require('../utils/response');
const clienteRepositorio = require('../repositories/clients')
const { isValid } = require("@fnando/cpf");
const calcularPaginas = require('../utils/paginacao');
const { formatarClientes } = require('../utils/formatacaoRelatorios');
const cobrancasRepositorio = require('../repositories/bills');


const testarExistenciaCliente = async (email = null, cpf = null, id_user) => {
	let clienteExistenteEmail;
	let clienteExistenteCPF;

	if (email) {
		clienteExistenteEmail = await clienteRepositorio.obterCliente('email', email, id_user);
	}

	if (cpf) {
		clienteExistenteCPF = await clienteRepositorio.obterCliente('cpf', cpf, id_user);
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

	if (!isValid(cpf)) {
		return response(ctx, 400, { mensagem: 'O cpf não é válido'});
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

	const retorno = await clienteRepositorio.criarCliente(novoCliente);
	return response(ctx, 201, { id: retorno.id });
};

const editarCliente = async (ctx) => {
	const { id, nome, cpf, email, tel, deletado } = ctx.request.body;
	if (!id) {
		return response(ctx, 400, { mensagem: 'Não foi localizada id' })
	}

	const cliente = await obterCliente('id', id, ctx.state.userId);
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

	const retorno = await clienteRepositorio.editarCliente(novoCliente);
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
	
	let clientes;
	if (!busca) {
		clientes = await clienteRepositorio.listarClientesSemBusca(userId);
		
		if (clientes.length === 0) {
			return response(ctx, 200, { mensagem: 'Não existem clientes cadastrados para esse usuário!' });
		}
	} else {
		clientes = await clienteRepositorio.listarClientesComBusca(userId, busca);

		if (clientes.length === 0) {
			return response(ctx, 200, { mensagem: 'Nenhum cliente foi encontrado.' });
		}
	}
	
	const cobrancas = await cobrancasRepositorio.buscarCobrancas(userId)
	const paginacao = calcularPaginas(clientes, clientesPorPagina, offset);
	const clientesFomatados = formatarClientes(paginacao['itensDaPagina'], cobrancas)
	
	return response(ctx, 200, { 
		paginaAtual: paginacao.paginaAtual,
        totalDePaginas: paginacao.paginasTotais,
		clientes: clientesFomatados 
	});
};

module.exports = {
	criarCliente,
	editarCliente,
	listarClientes,
};
