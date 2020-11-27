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

const buscarCobrancas = async (id_user) => {
	const query = {
		text: `SELECT * FROM bills
				WHERE id_client IN (
					SELECT id FROM clients
					WHERE id_user = $1
				);`,
		values: [id_user]
	};
	
	const result = await db.query(query);
	return result.rows;
}

const pagarCobranca = async (idCobranca) => {
	const query = {
		text: `UPDATE bills 
				SET pago = true
				WHERE id = $1
				RETURNING *;`,
		values: [idCobranca]
	}
	
	const response = await db.query(query);
	return response.rows.shift();
}

module.exports = {
	criarCobranca,
	buscarCobrancas,
	pagarCobranca
}