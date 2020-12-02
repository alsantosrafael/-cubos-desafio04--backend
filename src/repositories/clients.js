const db = require('../utils/database');

/**
 * Cria um item de cliente no banco de dados.
 * @param {Object} cliente 
 */
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

/**
 * Procura por um item de cliente no banco de dados a partir de um dado específico.
 * @param {string} campo 
 * @param {string} valor 
 * @param {number} id_user 
 */
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

/**
 * Modifica um item de cliente no banco de dados. 
 * @param {Object} cliente 
 */
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

/**
 * Lista clientes filtrando apenas pelo ID do usuário responsável.
 * @param {number} id_user 
 */
const listarClientesSemBusca = async (id_user) => {
	const query = {
		text:`SELECT * 
		FROM clients 
		WHERE deletado = FALSE 
		AND id_user = $1`,
		values: [id_user]
	}
	const result = await db.query(query);
	return result.rows;
}

/**
 * lista clientes usando como filtro a ID do usuário e de um texto fornecido.
 * @param {number} userId 
 * @param {string} busca 
 */
const listarClientesComBusca = async (userId, busca) => {

	const query = {
		text:`SELECT * 
		FROM clients 
		WHERE deletado = FALSE 
		AND id_user = $1 
		AND (nome LIKE $2 OR 
			email LIKE $2 OR
			cpf LIKE $2)`,
		values: [userId, `%${busca}%`]
	}
	
	const result = await db.query(query);
	return result.rows;
}
module.exports = { 
	criarCliente, 
	obterCliente, 
	editarCliente, 
	listarClientesSemBusca,
	listarClientesComBusca 
};
