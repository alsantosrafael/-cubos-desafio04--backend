const response = require('../utils/response');
const clienteRepositorio = require('../repositories/clients');
const cobrancasRepositorio = require('../repositories/bills');
const pagarmeUtils = require('../utils/pagarme');
const calcularPaginas = require('../utils/paginacao');
const formatacaoRelatorios = require('../utils/formatacaoRelatorios');
const { enviarEmailNovaCobranca } = require('../utils/email')

const criarCobranca = async (ctx) => {
	const idDoUsuario = ctx.state.userId;

	const {
		idDoCliente = null,
		descricao = null,
		valor = null,
		vencimento = null
	} = ctx.request.body;

	if (!idDoCliente || !descricao || !valor || !vencimento) {
		return reponse(ctx, 400, { mensagem: "Pedido mal formatado" });
	}

	if (Number.isNaN(valor) || valor < 100) {
		return response(ctx, 400, { mensagem: 'Valor inválido' });
	}

	const padraoData = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/;
	const arrayData = vencimento.parse('-')
	arrayData[1] -= 1;
	vencimento = arrayData.join('-')
	if  (!padraoData.test(vencimento)  || !(typeof (new Date(vencimento).getTime() === Number)) ||
	new Date().getTime() > new Date(vencimento).getTime()) {
		return response(ctx, 400, { mensagem: 'Data inválida'});
	} 

	const cliente  = await clienteRepositorio.obterCliente('id', idDoCliente, idDoUsuario);

	if (!cliente) {
		return response(ctx, 400, { mensagem: 'Cliente não identificado' });
	}

	const pagarmeCliente = {
		type: 'individual',
		country: 'br',
		name: cliente.nome,
		email: cliente.email,
		external_id: `${cliente.id}`,
		documents: [
			{
				type: 'cpf',
				number: '040.850.815-94'
			}
		]
	};

	const respostaApiPagarme = await pagarmeUtils.criarBoleto(pagarmeCliente, valor, vencimento);
	
	const boleto = {
		id_cliente: Number(respostaApiPagarme.data.customer.external_id),
		descricao,
		valor: respostaApiPagarme.data.amount,
		vencimento: respostaApiPagarme.data.boleto_expiration_date,
		link_do_boleto: respostaApiPagarme.data.boleto_url,
		codigo_boleto: respostaApiPagarme.data.boleto_barcode
	};  // TODO ENDPOINT POSTBACK/PAGAMENTO DE BOLETO PELA PAGAR.ME https://docs.pagar.me/docs/realizando-uma-transacao-de-boleto-bancario (Simulando o pagamento de um boleto em teste)
	
	const retornoBancoDeDados = await cobrancasRepositorio.criarCobranca(boleto);
	
	const cobranca = {
		idDoCliente: retornoBancoDeDados.id_client,
		descricao: retornoBancoDeDados.descricao,
		valor: retornoBancoDeDados.valor,
		vencimento : retornoBancoDeDados.vencimento,
		linkDoBoleto: retornoBancoDeDados.link_do_boleto,
		status: 'AGUARDANDO'
	};

	await enviarEmailNovaCobranca(cliente.email);

	return response(ctx, 201, { cobranca });
}

const listarCobrancas = async (ctx) => {
	const { cobrancasPorPagina = 10, offset = 0} = ctx.query;
	const { userId } = ctx.state;
	
	const todasAscobrancas = await cobrancasRepositorio.listarCobrancas(userId);
	const paginacao = calcularPaginas(todasAscobrancas, cobrancasPorPagina, offset);
	
	const boletosResposta = formatacaoRelatorios.formatarCobranca(paginacao['itensDaPagina']);
	
	const resposta = {
		paginaAtual: paginacao['paginaAtual'],
		totalDePaginas: paginacao['paginasTotais'],
		cobrancas: boletosResposta
	}
	return response(ctx, 200, resposta )
}

const pagarCobranca = async (ctx) => {
	const { userId } = ctx.state
	const { idDaCobranca } = ctx.request.body;

	if (!idDaCobranca || !(typeof idDaCobranca === Number) ) { 
		return response(ctx, 400, { mensagem: 'Id inválida'})
	}

	const cobrancasDoUsuario = await cobrancasRepositorio.listarCobrancas(userId);
	const cobrancaDoUsuario = cobrancasDoUsuario.find(cobranca => cobranca.id === idDaCobranca);
	if (!cobrancaDoUsuario) {
		return response(ctx, 403, { mensagem: "Id inválida" })
	}

	const cobranca = await cobrancasRepositorio.buscarCobranca(idDaCobranca);  // como garantir que a cobranca é do usuario? por enquanto um usuario pode pagar cobrança de outro

	if (!cobranca) {
		return response(ctx, 404, { mensagem: 'Cobrança não encontrada' });
	}

	if (cobranca.pago) {
		return response(ctx, 400, { mensagem: 'Essa cobrança já foi paga' });
	}

	if (new Date().getTime() > new Date(cobranca.vencimento).getTime()) {
		console.log('oi')
		return response(ctx, 400, { mensagem: "O boleto está vencido." });
	}

	const cobrancaPaga = await cobrancasRepositorio.pagarCobranca(idDaCobranca);

	if (!cobrancaPaga) {
		return response(ctx, 404, { mensgem: 'Não foi localizada a cobrança' });
	}
	
	return response(ctx, 200, { mensagem: 'cobrança paga com sucesso'});
}

module.exports = { 
	criarCobranca,
	listarCobrancas,
	pagarCobranca
}