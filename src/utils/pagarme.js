const axios = require('axios').default;

require('dotenv').config();

/**
 * Faz a integração com a api externa da pagar.me
 * @param {Object} customer 
 * @param {number} amount 
 * @param {string} boleto_expiration_date 
 */
const criarBoleto = async (
	customer, 
	amount, 
	boleto_expiration_date
	) => {
		try {
			const transaction = await axios.post(
				process.env.PAGARME_BASE_URL, {
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

