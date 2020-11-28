const calcularPaginas = (lista, itensPorPagina, offset) => {
	
	const paginaAtual = offset % itensPorPagina +1;
	const paginasTotais = Math.ceil(lista.length / itensPorPagina);
	const itensDaPagina = lista.slice(offset, Number(offset) + Number(itensPorPagina));
	
	return {
		paginaAtual,
		paginasTotais,
		itensDaPagina
	};
};

module.exports = calcularPaginas