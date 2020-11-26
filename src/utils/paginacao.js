const calcularPaginas = (lista, itensPorPagina, offset) => {
	const paginaAtual = offset % itensPorPagina +1;
	const paginasTotais = Math.ceil(lista.length % itensPorPagina);
	const itensDaPagina = lista.slice(offset+1, offset + itensPorPagina);
	return [paginaAtual, paginasTotais, itensDaPagina];
};

module.exports = calcularPaginas