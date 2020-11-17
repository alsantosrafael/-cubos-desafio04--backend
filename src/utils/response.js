/**
 * Função responsável por obter informações e formatar resposta à requisições
 */

const response = (ctx, dados, codeStatus = 200, mensagem = 'Sucesso!') => {
	const status = codeStatus >= 200 && codeStatus <= 399 ? 'Sucesso' : 'Erro';
	ctx.status = codeStatus;
	ctx.body = {
		status,
		dados,
		mensagem,
	};
};

module.exports = response;
