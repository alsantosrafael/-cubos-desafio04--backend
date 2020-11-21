/**
 * Função responsável por obter informações e formatar resposta à requisições
 */

const response = (ctx, dados, codeStatus = 200) => {
	const status = codeStatus >= 200 && codeStatus <= 399 ? 'Sucesso' : 'Erro';
	ctx.status = codeStatus;
	ctx.body = {
		status,
		dados,
	};
};

module.exports = response;
