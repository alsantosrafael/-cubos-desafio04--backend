/**
 * Formata o modelo para resposta sobre cobrança.
 * @param {array} listaDeBoletos 
 */
const formatarCobranca = (listaDeBoletos) => {
	const boletosFormatados = listaDeBoletos.map(item => {
		const resposta = {
			id: item.id,
			idDoCliente: item.id_client,
			descricao: item.descricao,
			valor: item.valor,
			vencimento: item.vencimento,
			linkDoBoleto: item.link_do_boleto,
			status: item.pago ? 'PAGO' : new Date().getTime() > new Date(item.vencimento).getTime() ? 'VENCIDO' : "AGUARDANDO"
		}
		return resposta
	})
	return boletosFormatados
}

/**
 * Formata o modelo de resposta sobre cliente.
 * @param {array} listaDeClientes 
 * @param {array} listaDeCobrancas 
 */
const formatarClientes = (listaDeClientes, listaDeCobrancas) => {
	const cobrancasFormatadas = formatarCobranca(listaDeCobrancas);
	 
	let clientesFormatadosObjeto = {};
	for (let cliente of listaDeClientes) {
		clientesFormatadosObjeto[cliente.id] = {	
			nome: cliente.nome,			
			email: cliente.email,			
			cobrancasFeitas: 0,  			
			cobrancasRecebidas: 0,         
			estaInadimplente: false,				
		}
	}
	
	for (let cobranca of cobrancasFormatadas) {
		if (clientesFormatadosObjeto[cobranca.idDoCliente]) {
			if (cobranca.status === "PAGO") {
				clientesFormatadosObjeto[cobranca.idDoCliente].cobrancasFeitas += cobranca.valor;
				clientesFormatadosObjeto[cobranca.idDoCliente].cobrancasRecebidas += cobranca.valor 
			} else if (cobranca.status === "AGUARDANDO") {
				clientesFormatadosObjeto[cobranca.idDoCliente].cobrancasFeitas += cobranca.valor;
			} else if (cobranca.status === "VENCIDO") {
				clientesFormatadosObjeto[cobranca.idDoCliente].cobrancasFeitas += cobranca.valor;
				clientesFormatadosObjeto[cobranca.idDoCliente].estaInadimplente = true;
			}
		} else {
			continue
		}
	}

	const clientesFormatadosArray = listaDeClientes.map(cliente => {
		return clientesFormatadosObjeto[cliente.id]
	})
	
	return clientesFormatadosArray
}

/**
 * Formata o mdelo de resposta sobre usuário.
 * @param {array} listaDeClientes 
 * @param {array} listaDeCobrancas 
 */
const formatarRelatorio = (listaDeClientes, listaDeCobrancas) => {
	const relatorio = {
		qtdClientesAdimplentes: 0,
		qtdClientesInadimplentes: 0,
		qtdCobrancasPrevistas: 0,
		qtdCobrancasPagas: 0,
		qtdCobrancasVencidas: 0,
		saldoEmConta: 0,
	}

	const clientesFormatados = formatarClientes(listaDeClientes, listaDeCobrancas);
	const cobrancasFormatadas = formatarCobranca(listaDeCobrancas);

	for (let cliente of clientesFormatados) {
		if (cliente.estaInadimplente) {
			relatorio.qtdClientesInadimplentes += 1;
		} else {
			relatorio.qtdClientesAdimplentes += 1
		}
	}

	for (let cobranca of cobrancasFormatadas) {
		if (cobranca.status === "PAGO") {
			relatorio.qtdCobrancasPagas += 1;
			relatorio.saldoEmConta += cobranca.valor;
		} else if (cobranca.status === "AGUARDANDO") {
			relatorio.qtdCobrancasPrevistas += 1;
		} else {
			relatorio.qtdCobrancasVencidas += 1;
		}
	}
	return relatorio
}

module.exports = {
	formatarCobranca,
	formatarClientes,
	formatarRelatorio
}