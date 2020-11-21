const db = require('../utils/database');

const criarUsuario = async (usuario) => {
	const { email, senha, nome } = usuario;
	const query = {
		text: `INSERT INTO users(
				email, 
				senha,
				nome
			) VALUES ($1, $2, $3) RETURNING *;`,
		values: [email, senha, nome],
	};
	const result = await db.query(query);
	return result.rows.shift();
};

module.exports = { criarUsuario };