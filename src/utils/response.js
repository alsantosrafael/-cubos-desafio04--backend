/**
 * Responsável por modelar a resposta de retorno dos endpoints.
 * @param {context} ctx 
 * @param {number} code 
 * @param {Object} dados 
 */
 const response = (ctx, code, dados) => {
	ctx.status = code;
	ctx.body = {
		status: code,
		dados,
	}
}

module.exports = response;
