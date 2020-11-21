const Axios = require('axios').default;
/* MUDAR FUNçÃO PARA BOLETOS */
require('dotenv').config();

const pay = async (cobranca) => {
	const { nome, cpf, vencimento, valor, descricao, linkBoleto } = cobranca;
	try {
		const transaction = await Axios.post(
			'https://api.pagar.me/1/transactions',
			{
				amount: valor,
				payment_method: 'boleto',
				descricao,
				expiration_date: vencimento,
				customer: {
					name: nome,
					documents: [
						{
							type: 'cpf',
							number: cpf,
						},
					],
				},
				linkBoleto,
				api_key: process.env.PAGARME_CHAVE,
			}
		);
		return transaction.data;
	} catch (err) {
		console.log(err.response.data);
		return {
			status: 'error',
			data: {
				mensagem: 'Erro no pagamento!',
			},
		};
	}
};

module.exports = { pay };
