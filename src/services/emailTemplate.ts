export type TicketLink = {
  code: string;
  url: string;
};

export function buildTicketEmailHtml(buyerName: string, tickets: TicketLink[]): string {
  const ticketCards = tickets
    .map(
      (t) => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #eee;">
        <span style="font-size:14px; color:#333; font-weight:600;">${t.code}</span>
      </td>
      <td style="padding:8px 0; border-bottom:1px solid #eee; text-align:right;">
        <a href="${t.url}" style="font-size:13px; color:#6d28d9; text-decoration:none; font-weight:600;">Ver ingresso</a>
      </td>
    </tr>`
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Seu ingresso</title>
      </head>
      <body style="margin:0; padding:0; font-family:Helvetica, Arial, sans-serif; background-color:#f4f4f5;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
                <tr>
                  <td style="background:#6d28d9; padding:32px 32px; text-align:center;">
                    <div style="color:#ffffff; font-size:24px; font-weight:800; letter-spacing:1px;">CASA IBBI</div>
                    <div style="color:#c4b5fd; font-size:13px; margin-top:4px;">Seu ingresso confirmado</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px 32px;">
                    <div style="font-size:18px; color:#18181b; font-weight:700; margin-bottom:8px;">Olá, ${buyerName}! 👋</div>
                    <p style="font-size:14px; color:#52525b; line-height:1.6; margin:0 0 24px;">
                      Seu pagamento foi confirmado e seus ingressos já estão disponíveis! Confira abaixo:
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${ticketCards}
                    </table>
                    <div style="background:#faf5ff; border:1px solid #e9d5ff; border-radius:8px; padding:16px 16px; margin-top:24px;">
                      <div style="font-size:13px; color:#6d28d9; font-weight:700; margin-bottom:4px;">📱 Como usar</div>
                      <p style="font-size:13px; color:#6b7280; line-height:1.6; margin:0;">
                        Para cada ingresso, clique em <strong>Ver ingresso</strong> e apresente o QR Code na entrada do evento.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 32px; text-align:center; background:#fafafa; border-top:1px solid #f4f4f5;">
                    <div style="font-size:11px; color:#a1a1aa;">Casa IBBI</div>
                    <div style="font-size:11px; color:#a1a1aa; margin-top:4px;">Dúvidas? Responda este e-mail</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function buildTicketEmailPlain(buyerName: string, tickets: TicketLink[]): string {
  const ticketLines = tickets.map((t) => `  - ${t.code}: ${t.url}`).join("\n");
  return `Olá ${buyerName}!

Seu pagamento foi confirmado!

Seus ingressos:
${ticketLines}

Apresente o QR Code na entrada do evento.

Casa IBBI`;
}
