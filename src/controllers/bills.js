const response = require('../utils/response');
const clienteRepositorio = require('../repositories/clients');
const cobrancasRepositorio = require('../repositories/bills');
const pagarmeUtils = require('../utils/pagarme');
const calcularPaginas = require('../utils/paginacao');

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
	if  (!padraoData.test(vencimento)  || Number.isNaN(new Date(vencimento).getTime()) ||
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

	const respostaApiPagarme = await pagarmeUtils.criarBoleto(pagarmeCliente, valor, vencimento, descricao);
	
	const boleto = {
		id_cliente: Number(respostaApiPagarme.data.customer.external_id),
		// descricao: ,
		valor: respostaApiPagarme.data.amount,
		vencimento: respostaApiPagarme.data.boleto_expiration_date,
		link_do_boleto: respostaApiPagarme.data.boleto_url,
		codigo_boleto: respostaApiPagarme.data.boleto_barcode
	}; //sem link do boleto e sem descrição
	
	const retornoBancoDeDados = await cobrancasRepositorio.criarCobranca(boleto);
	
	const cobranca = {
		idDoCliente: retornoBancoDeDados.id_client,
		descricao: retornoBancoDeDados.descricao,
		valor: retornoBancoDeDados.valor,
		vencimento : retornoBancoDeDados.vencimento,
		linkDoBoleto: retornoBancoDeDados.link_do_boleto,
		status: 'AGUARDANDO'
	};

	return response(ctx, 201, { cobranca });
}

const listarCobrancas = async (ctx) => {
	const { cobrancasPorPagina = 10, offset = 0} = ctx.query;
	const { userId } = ctx.state;
	
	const todasAscobrancas = await cobrancasRepositorio.buscarCobrancas(userId);
	const paginacao = calcularPaginas(todasAscobrancas, cobrancasPorPagina, offset);
	
	const boletosResposta = paginacao['itensDaPagina'].map(item => {
		const resposta = {
			id: item.id,
			idDoCliente: item.id_client,
			descricao: item.descricao,
			valor: item.valor,
			vencimento: item.vencimento,
			linkDoBoleto: item.link_do_boleto,
			status: item.pago ? 'PAGO' : new Date().getTime() > new Date(item.vencimento).getTime() ? 'VENCIDO' : "AGUARDANDO"
		}
		return resposta
	})
	
	const resposta = {
		paginaAtual: paginacao['paginaAtual'],
		totalDePaginas: paginacao['paginasTotais'],
		cobrancas: boletosResposta
	}
	return response(ctx, 200, resposta )
}

const pagarCobranca = async (ctx) => {
	const { idDaCobranca } = ctx.request.body;

	if (!idDaCobranca || Number.isNaN(idDaCobranca)) {  // enviar uma id nao numerica retorna erro, porque?
		return response(ctx, 400, { mensagem: 'Id inválida'})
	}

	const cobrancaPaga = await cobrancasRepositorio.pagarCobranca(idDaCobranca);

	if (!cobrancaPaga) {
		return response(ctx, 404, { mensgem: 'Não foi localizada a cobrança' } )
	}
	
	return response(ctx, 200, { mensagem: 'cobrança paga com sucesso'});
}

module.exports = { 
	criarCobranca,
	listarCobrancas,
	pagarCobranca
}