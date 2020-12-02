const bcrypt = require('bcryptjs');

/**
 * Compara a senha fornecida com a hash no banco de dados.
 * @param {string} senha 
 * @param {string} hash 
 */
const checarSenha = async (senha, hash) => {
    const compara = await bcrypt.compare(senha, hash);
    return compara;
};

/**
 * Responsável por criar a hash da senha no momento do cadastro de usuário.
 * @param {string} senha 
 */
const encrypt = async (senha) => {
    const hash = await bcrypt.hash(senha, 10);
    return hash;
};

module.exports = { checarSenha, encrypt };