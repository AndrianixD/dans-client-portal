/**
 * Email Service
 * 
 * Gerencia o envio de emails usando Resend
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Envia email usando Resend
 */
export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    const fromEmail = from || process.env.EMAIL_FROM || 'portal@dansautobodyma.com';

    const data = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Envia mensagem do cliente para a oficina
 */
export async function sendClientMessage({
  clientName,
  clientEmail,
  roNumber,
  vin,
  message,
}: {
  clientName: string;
  clientEmail: string;
  roNumber: string;
  vin: string;
  message: string;
}) {
  const emailTo = process.env.EMAIL_TO || 'info@dansautobodyma.com';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #D32F2F;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .content {
      background-color: #f9f9f9;
      padding: 30px;
      border: 1px solid #ddd;
      border-top: none;
    }
    .field {
      margin-bottom: 15px;
    }
    .field-label {
      font-weight: bold;
      color: #555;
    }
    .field-value {
      color: #333;
      padding-left: 10px;
    }
    .message-box {
      background-color: white;
      padding: 20px;
      border-left: 4px solid #D32F2F;
      margin-top: 20px;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📩 Nova Mensagem do Client Portal</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="field-label">Cliente:</span>
        <span class="field-value">${clientName}</span>
      </div>
      <div class="field">
        <span class="field-label">Email:</span>
        <span class="field-value">${clientEmail}</span>
      </div>
      <div class="field">
        <span class="field-label">RO Number:</span>
        <span class="field-value">${roNumber}</span>
      </div>
      <div class="field">
        <span class="field-label">VIN:</span>
        <span class="field-value">${vin}</span>
      </div>
      
      <div class="message-box">
        <div class="field-label">Mensagem:</div>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
    <div class="footer">
      Enviada através do Dan's Auto Body Client Portal
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: emailTo,
    subject: `Mensagem do Cliente - RO #${roNumber}`,
    html,
  });
}

/**
 * Valida se as credenciais de email estão configuradas
 */
export function validateEmailConfig(): boolean {
  return !!process.env.RESEND_API_KEY;
}

