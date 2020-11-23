/**
 * Função responsável por obter informações e formatar resposta à requisições
 */

const response = (ctx, codeStatus = 200, dados) => {
	const status = codeStatus >= 200 && codeStatus <= 399 ? 'Sucesso' : 'Erro';
	ctx.status = codeStatus;
	ctx.body = {
		status,
		dados,
	};
};

/* const response = (ctx, code, dados) => {
	ctx.status = code;
	ctx.body = {
		status: code >= 200 && code <= 399 ? 'Sucesso' : 'Erro',
		dados,
	}
} */

module.exports = response;
