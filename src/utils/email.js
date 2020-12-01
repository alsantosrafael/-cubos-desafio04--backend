const nodemailer = require('nodemailer');

require('dotenv').config();

const config = {
	host: process.env.MAILTRAP_HOST,
	port: process.env.MAILTRAP_PORT,
	secure: false,
	auth: {
		user: process.env.MAILTRAP_USER,
		pass: process.env.MAILTRAP_PW,
	},
};

const transport = nodemailer.createTransport(config);

const enviarEmail = async (to, subject, html) => {
	const email = await transport.sendMail({
		from: '"Cubos Payments 👻" <cubos@cubos.payments.io>',
		to,
		subject,
		html,
	});

	return email;
};

const enviarEmailNovaCobranca = async (to) => {
	const html = '';

	await enviarEmail(
		to, 
		'Você tem uma nova cobrança!', 
		html
	);
};

const enviarEmailNovoUsuário = async (to) => {
	const html = '';

	await enviarEmail(
		to, 
		'Bem-vindo(a)! Confirme sua conta para continuar!', 
		html
	);
}

module.exports = { 
	enviarEmailNovaCobranca,
	enviarEmailNovoUsuário
};