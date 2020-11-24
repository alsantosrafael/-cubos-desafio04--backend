const bcrypt = require('bcryptjs');

/**
 * Função responsável por estabelecer a comparação da senha enviada pelo usuário
 * com a hash obtida do banco de dados
 */
const checarSenha = async (senha, hash) => {
    const compara = await bcrypt.compare(senha, hash);
    return compara;
};

/**
 * Função responsável por codificar a senha enviada pelo usuário quando
 * for cadastrado.
 */
const encrypt = async (senha) => {
    const hash = await bcrypt.hash(senha, 10);
    return hash;
};

module.exports = { checarSenha, encrypt };