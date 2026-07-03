
import SendMail from '../utils/SendMail.js';

const APP_URL = process.env.APP_URL || 'http://localhost:7340';

class MailService {

    async enviarEmailBoasVindas(email, { token, nome }) {
        const linkDefinirSenha = `${APP_URL}/usuarios/confirmar-cadastro?token=${token}`;

        const html = `
            <p>Olá, <strong>${nome}</strong>!</p>
            <p>Você foi cadastrado no sistema <strong>Viveiro</strong>.</p>
            <p>Para acessar, clique no botão abaixo e defina sua senha:</p>
            <p>
                <a href="${linkDefinirSenha}"
                   style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;
                          text-decoration:none;border-radius:8px;font-weight:bold;">
                    Definir Minha Senha
                </a>
            </p>
            <p style="color:#666;font-size:12px;">Este link expira em 48 horas.</p>
            <p style="color:#666;font-size:12px;">Se você não esperava este e-mail, ignore-o.</p>
        `;

        return SendMail.enviaEmail({
            to: email,
            subject: 'Bem-vindo ao Viveiro — Defina sua senha',
            text: `Olá ${nome},\n\nVocê foi cadastrado no sistema Viveiro.\nPara acessar, defina sua senha no link abaixo:\n\n${linkDefinirSenha}\n\nEste link expira em 48 horas.`,
            html,
        });
    }

    async enviarEmailRecuperacaoSenha(email, { token, nome }) {
        const linkReset = `${APP_URL}/recuperar-senha?token=${token}`;

        const html = `
            <p>Olá, <strong>${nome}</strong>!</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Viveiro</strong>.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            <p>
                <a href="${linkReset}"
                   style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;
                          text-decoration:none;border-radius:8px;font-weight:bold;">
                    Redefinir Senha
                </a>
            </p>
            <p style="color:#666;font-size:12px;">Este link expira em 30 minutos.</p>
            <p style="color:#666;font-size:12px;">Se você não solicitou a redefinição, ignore este e-mail — sua senha permanece a mesma.</p>
        `;

        return SendMail.enviaEmail({
            to: email,
            subject: 'Redefinição de senha — Viveiro',
            text: `Olá ${nome},\n\nRecebemos uma solicitação para redefinir sua senha.\nUse o link abaixo:\n\n${linkReset}\n\nEste link expira em 30 minutos.\n\nSe você não solicitou, ignore este e-mail.`,
            html,
        });
    }
}

export default MailService;