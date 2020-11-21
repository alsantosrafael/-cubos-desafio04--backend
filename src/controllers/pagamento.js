const Pagarme = require('../utils/pagarme');

const pagamento = async (ctx) => {
	const {
		nome,
		cpf,
		vencimento,
		valor,
		descricao,
		linkBoleto,
	} = ctx.request.body;
};

module.exports = { pagamento };