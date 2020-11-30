const axios = require('axios').default;

require('dotenv').config();

const criarBoleto = async (
	customer, 
	amount, 
	boleto_expiration_date
	) => {
		try {
			const transaction = await axios.post(
				'https://api.pagar.me/1/transactions', {
					amount,
					payment_method: 'boleto',
					customer,
					api_key: process.env.PAGARME_CHAVE,
					boleto_expiration_date,
				}
			);
			return transaction;
		} catch(err) {
			console.log(err.response.data);
			return { mensagem: 'erro na criacao do boleto' };
		} 
};

module.exports = { criarBoleto }

