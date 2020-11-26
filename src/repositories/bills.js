const db = require('../utils/database');

const criarCobranca = async (boleto) => {
	const {id_cliente, descricao = '', valor, vencimento, link_do_boleto, codigo_boleto } = boleto;
	const query = {
		text: `INSERT INTO bills (
				id_client,
				descricao,
				valor,
				vencimento,
				link_do_boleto,
				codigo_boleto
				) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
		values: [id_cliente, descricao , valor, vencimento, link_do_boleto, codigo_boleto ],
	};
	const result = await db.query(query);
	return result.rows.shift();
}

module.exports = {
	criarCobranca,
}