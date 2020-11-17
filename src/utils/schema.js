const DB = require('./database');

const schema = {
	1: `CREATE TABLE IF NOT EXISTS users
	(
		id SERIAL PRIMARY KEY,
		email VARCHAR(50),
		senha VARCHAR(24),
		nome VARCHAR(50)
	);`,
	2: `CREATE TABLE IF NOT EXISTS clients
	(
		id SERIAL PRIMARY KEY,
		idUser INT,
		nome VARCHAR(50),
		cpf VARCHAR(14),
		email VARCHAR(50),
		tel VARCHAR(20),
		cobrancasFeitas INT DEFAULT 0,
		cobrancasRecebidas INT DEFAULT 0,
		estaInadimplente BOOL DEFAULT FALSE
	);`,
	3: `CREATE TABLE IF NOT EXISTS bills
	(
		idDoCliente INT,
		descricao VARCHAR(255),
		valor INT,
		vencimento DATE NOT NULL,
		linkDoBoleto VARCHAR(70)
	);`,
};
/* TOda vez que ocorrer um insert de bills ou pagamento de conta,
atualizar a tabela de clients com os valores das cobrancas! */

const drop = async (nomeTabela) => {
	if (nomeTabela) {
		await DB.query(`DROP TABLE ${nomeTabela}`);
		console.log(`Tabela ${nomeTabela} dropada!`);
	}
};

const up = async (num = null) => {
	if (!num) {
		const schemaKeys = Object.keys(schema);

		for (const key of schemaKeys) {
			await DB.query({ text: schema[key] });
		}
	} else {
		await DB.query({ text: schema[num] });
	}
	console.log('Migração executada!');
};

// up();
drop('users');
