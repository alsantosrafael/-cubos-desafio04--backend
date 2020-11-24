const db = require('../utils/database');

const criarCobranca = async (cobranca) => {
	const {
		id_client,
		descricao,
		valor,
		vencimento,
		link_do_boleto,
		codigo_boleto,
		data_vencimento,
	} = cobranca;
	const query = {
		text: `INSERT INTO bills (
			id_client
			descricao,
			valor,
			vencimento,
			link_do_boleto,
			codigo_boleto,
			data_vencimento,
			) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
		values: [
			id_client,
			descricao,
			valor,
			vencimento,
			link_do_boleto,
			codigo_boleto,
			data_vencimento,
		],
	};
	const result = await db.query(query);
	return result.rows.shift();
	/*Após criação de cobrança, enviar email para cliente! */
};

const listarCobrancas = async (req) => {
	const { busca, limit, offset } = req;

	const query = {
		text: `SELECT * 
		FROM bills 
		WHERE deletado = FALSE 
		AND (nome LIKE $1 OR 
			email LIKE $1 OR
			 cpf LIKE $1)
		LIMIT $2
		OFFSET $3`,
		values: [`%${busca}%`, limit, offset],
	};
	const result = await db.query(query);
	return result.rows;
};

module.exports = { criarCobranca, listarCobrancas };
