const db = require('../utils/database');

const criarCliente = async (cliente) => {
	const {id_user, nome, cpf, email, tel } = cliente;
	const query = {
		text: `INSERT INTO clients (
			id_user,
			nome, 
			cpf,
			email,
			tel
			) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
		values: [id_user, nome, cpf, email, tel],
	};
	const result = await db.query(query);
	return result.rows.shift();
};

const obterCliente = async (campo, valor, id_user) => {
	if (!campo) {
		return null;
	}

	const query = {
		text: `SELECT * FROM clients WHERE ${campo} = $1 AND id_user = $2 AND deletado = FALSE`,
		values: [valor, id_user],
	};
	const result = await db.query(query);
	return result.rows.shift();
};

const editarCliente = async (cliente) => {
	const {id, nome, cpf, email, tel, deletado} = cliente;

	const query = {
		text: `UPDATE clients 
		SET nome = $1,
		cpf = $2,
		email = $3,
		tel = $4,
		deletado = $5
		WHERE id = $6 RETURNING *`,
		values: [nome, cpf, email, tel, deletado,  id]
	}
	const result = await db.query(query);
	return result.rows.shift();
}
//Fazer inner join aqui com as bills
const obterTodosClientes = async (req) => {
	const {id_user, offset, limit = 10} = req

	const query = {
		text:`SELECT * 
		FROM clients 
		WHERE deletado = FALSE 
		AND id_user = $1
		LIMIT $2
		OFFSET $3`,
		values: [id_user, limit, offset]
	}
	const result = await db.query(query);
	return result.rows;
}

const buscarClientes = async (req) => {
	const {id_user, busca, limit, offset} = req;

	const query = {
		text:`SELECT * 
		FROM clients 
		WHERE deletado = FALSE 
		AND id_user = $1 
		AND (nome LIKE $2 OR 
			email LIKE $2 OR
			 cpf LIKE $2)
		LIMIT $3
		OFFSET $4`,
		values: [id_user, `%${busca}%`, limit, offset]
	}
	const result = await db.query(query);
	return result.rows;
}
module.exports = { criarCliente, obterCliente, editarCliente };
