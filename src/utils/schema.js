/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const DB = require('./database');

const schema = {
	1: `CREATE TABLE IF NOT EXISTS users
	(
		id SERIAL PRIMARY KEY,
		email VARCHAR(50),
		senha VARCHAR(255),
		nome VARCHAR(50),
		deletado BOOL DEFAULT FALSE
	);`,
	2: `CREATE TABLE IF NOT EXISTS clients
	(
		id SERIAL PRIMARY KEY,
		id_user INT,
		nome VARCHAR(50),
		cpf VARCHAR(14),
		email VARCHAR(50),
		tel VARCHAR(20),
		deletado BOOL DEFAULT FALSE
	);`,
	3: `CREATE TABLE IF NOT EXISTS bills
	(
		id SERIAL PRIMARY KEY,
		id_client INT,
		descricao VARCHAR(255),
		valor INT,
		vencimento DATE NOT NULL,
		link_do_boleto VARCHAR(255),
		codigo_boleto TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'AGUARDANDO',
		deletado BOOL DEFAULT FALSE
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

up();
// drop('users');
// drop('clients');
// drop('bills');
