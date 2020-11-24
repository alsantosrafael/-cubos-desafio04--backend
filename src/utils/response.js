/**
 * Função responsável por obter informações e formatar resposta à requisições
 */
 const response = (ctx, code, dados) => {
	ctx.status = code;
	ctx.body = {
		status: code,
		dados,
	}
}

module.exports = response;
