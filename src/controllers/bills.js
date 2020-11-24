const repositorioBills = require('../repositories/bills');
const repositorioClients = require('../repositories/clients');
const Pagarme = require('../utils/pagarme');
const response = require('../utils/response');

const criarCobranca = async (ctx) => {
	const {
		idDoCliente = null,
		descricao = null,
		valor = null,
		vencimento = null,
	} = ctx.request.body;

	if (!idDoCliente || !descricao || !valor || !vencimento) {
		return response(ctx, 400, { mensagem: 'Requisição mal-formatada!' });
	}
	const existeCliente = await repositorioClients.obterCliente(
		id,
		idDoCliente
	);

	if (!existeCliente) {
		return response(ctx, 404, {
			mensagem: 'Não há clientes registrados com o id inserido!',
		});
	}
	if (Number(valor).isNaN()) {
		return response(ctx, 403, {
			mensagem: 'Insira um valor em centavos no campo "valor"!',
		});
	}
	if (!Date.parse(vencimento)) {
		return response(ctx, 403, {
			mensagem: 'Insira uma data válida!',
		});
	}
	/*Gerar boleto com função da pagar-me, pegar resposta e montar objeto cobranca */
	const cobranca = {
		id_client: idDoCliente,
		descricao,
		valor: Number(valor),
		vencimento: Date.parse(vencimento),
		link_do_boleto,
		codigo_boleto,
	};

	const boleto = await repositorioBills.criarCobranca(cobranca);
	return response(ctx, 201, {
		idDoCliente: boleto.id_client,
		descricao: boleto.descricao,
		valor: boleto.valor,
		vencimento: boleto.vencimento,
	});
};

const listarCobranca = async (ctx) => {};

module.exports = { criarCobranca, listarCobranca };
