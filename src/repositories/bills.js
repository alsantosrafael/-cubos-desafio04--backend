const db = require('../utils/database');

/**
 * Cria um novo item de cobrança no banco de dados.
 * @param {Object} boleto 
 */
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

/**
 * Busca no banco de dados todos os items de cobrança do usuário.
 * @param {number} id_user 
 */
const listarCobrancas = async (id_user) => {
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

/**
 * Busca uma cobrança específica.
 * @param {number} idDaCobranca 
 */
const buscarCobranca = async (idDaCobranca) => {
	const query = {
		text: `SELECT * FROM bills
				WHERE id = $1;`,
		values: [idDaCobranca]
	};

	const result = await db.query(query);
	return result.rows.shift();
}

/**
 * Troca o status do item de cobrança no banco de dados para true. 
 * @param {number} idCobranca 
 */
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
	buscarCobranca,
	criarCobranca,
	listarCobrancas,
	pagarCobranca
}