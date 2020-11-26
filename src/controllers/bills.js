const response = require('../utils/response');
const clienteRepositorio = require('../repositories/clients');
const cobrancasRepositorio = require('../repositories/bills');
const pagarmeUtils = require('../utils/pagarme');

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
module.exports = { criarCobranca }