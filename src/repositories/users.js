const db = require('../utils/database');

const criarUsuario = async (usuario) => {
	const {email, senha, nome} = usuario;
	const query = {text: `INSERT INTO users
						(email, senha, )`}
};

module.exports = { criarUsuario };
