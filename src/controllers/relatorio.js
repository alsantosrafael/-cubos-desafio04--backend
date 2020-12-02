const clientesRepositorio = require('../repositories/clients');
const cobrancasRepositorio = require('../repositories/bills')
const { formatarRelatorio } = require('../utils/formatacaoRelatorios');
const response = require('../utils/response');

/**
 * Gera o relatório do usuário.
 * @param {context} ctx 
 */
const obterRelatorio = async (ctx) => {
	const { userId } = ctx.state;

	const todosOsClientes = await clientesRepositorio.listarClientesSemBusca(userId);
	const todosAsCobrancas = await cobrancasRepositorio.buscarCobrancas(userId);

	const relatorio = formatarRelatorio(todosOsClientes, todosAsCobrancas);
	
	return response(ctx, 200, { relatorio })
}

module.exports = { obterRelatorio }