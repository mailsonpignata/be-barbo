const nodemailer = require('nodemailer'),
	ejs = require('ejs'),
	fs = require('fs').promises,
	path = require('path');

const projectRoot = path.dirname(process.argv[1]);

exports.sendEmail = async (role, toEmail, title, templateDir, data) => {
	try
	{
		if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local') {
			toEmail = ['mailsonpignata@gmail.com'];
		}
		
		const credencial = getCredencial(role);
		
		// O primeiro passo é configurar um transporte para este
		// e-mail, precisamos dizer qual servidor será o encarregado
		// por enviá-lo:
		let transporte = nodemailer.createTransport({
			host: credencial.host,
			port: credencial.port,
			secure: false, // true for 465, false for other ports
			auth: {
				user: credencial.user, // Basta dizer qual o usuário
				pass: credencial.pass // e a senha da nossa conta
			},
			tls: {
				rejectUnauthorized: false
			}
		});
		
		const template = await fs.readFile(`${projectRoot}/api/views/${templateDir}/index.ejs`, 'utf8');
		
		// Após configurar o transporte chegou a hora de criar um e-mail
		// para enviarmos, para isso basta criar um objeto com algumas configurações
		console.log('data', data);
		let email = {
			from: credencial.fromEmail, // Quem enviou este e-mail
			to: toEmail, // Quem receberá
			subject: title,  // Um assunto bacana :-)
			html: ejs.render(template, { data, title })
		};
		
		// Pronto, tudo em mãos, basta informar para o transporte
		// que desejamos enviar este e-mail
		let result = await transporte.sendMail(email);
		
		console.log('envio de email', result);
		return true;
	}
	catch (error) {
		console.log('Erro:', error);
		throw { error: 'erro enviar email' };
	}
};


const getCredencial = (role) => {
	const credencials = {
		'rocketit': {
			user: 'no-reply@rocketit.com.br',
			pass: 'RFbMvwKPZY43fBhC',
			host: 'smtp-relay.sendinblue.com',
			port: 587,
			fromEmail: 'Contato App TEC <no-reply@rocketit.com.br>'
		},
		
	};
	
	return credencials[role];
}