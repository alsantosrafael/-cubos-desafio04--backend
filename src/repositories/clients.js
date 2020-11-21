const db = require('../utils/database');

const criarCliente = (cliente) => {
	const { nome, cpf, email, tel } = cliente;
	const query = {
		text: `INSERT INTO clients(
			nome, 
			cpf,
			email,
			tel
			) VALUES ($1, $2, $3, $4) RETURNING *;`,
		values: [nome, cpf, email, tel],
	};
	const result = await db.query(query);
	return result.rows.shift();
};

const obterClientePorEmail = async (email = null) => {
	if (!email) {
		return null;
	}

	const query = {
		text: `SELECT * FROM clients WHERE email = $1 AND deletado = FALSE`,
		values: [email],
	};
	const result = await db.query(query);
	return result.rows.shift();
};

const editarCliente = async (cliente) => {
	const {id, nome, cpf, email} = cliente;

	const query = {
		text: `UPDATE clients 
		SET nome = $1,
		cpf = $2,
		email = $3
		tel = $4
		WHERE id = $5 RETURNING *`,
		values: [nome, cpf, email, tel, id]
	}
	const result = await db.query(query);
	return result.rows.shift();
}
//Fazer inner join aqui com as bills
const obterClientes = async (idUser) => {
	const query = {
		text:`SELECT * 
		FROM clients 
		WHERE deletado = FALSE 
		AND id_user = $1`,
		values: [idUser]
	}
	const result = await db.query(query);
	return result.rows;
}
module.exports = { criarCliente, obterClientePorEmail, editarCliente };
