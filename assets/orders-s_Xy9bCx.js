import{a as o}from"./index-By-k2fNn.js";function g(e,r){const t=r.map(a=>`
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #eee;">
        <span style="font-size:14px; color:#333; font-weight:600;">${a.code}</span>
      </td>
      <td style="padding:8px 0; border-bottom:1px solid #eee; text-align:right;">
        <a href="${a.url}" style="font-size:13px; color:#6d28d9; text-decoration:none; font-weight:600;">Ver ingresso</a>
      </td>
    </tr>`).join("");return`
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
                    <div style="font-size:18px; color:#18181b; font-weight:700; margin-bottom:8px;">Olá, ${e}! 👋</div>
                    <p style="font-size:14px; color:#52525b; line-height:1.6; margin:0 0 24px;">
                      Seu pagamento foi confirmado e seus ingressos já estão disponíveis! Confira abaixo:
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${t}
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
  `}async function w(e){if(!o)throw new Error("Banco de dados não conectado.");const{data:r,error:t}=await o.from("orders").insert({user_id:e.userId,event_id:e.eventId,buyer_name:e.buyerName,buyer_email:e.buyerEmail,buyer_cpf:e.buyerCpf,buyer_phone:e.buyerPhone,subtotal:e.total,discount:0,fee:0,total:e.total,payment_status:"pending",status:"open"}).select().single();if(t)throw new Error(t.message);const a=e.items.map(i=>({order_id:r.id,ticket_batch_id:i.batchId,quantity:i.quantity,unit_price:e.total/i.quantity,total:e.total})),{error:n}=await o.from("order_items").insert(a);if(n)throw new Error(n.message);const{error:c}=await o.from("attendees").insert({order_id:r.id,name:e.buyerName,email:e.buyerEmail,cpf:e.buyerCpf});if(c)throw new Error(c.message);return r}async function b(e){if(!o)return[];const{data:r,error:t}=await o.from("orders").select("*").eq("user_id",e).order("created_at",{ascending:!1});if(t||!r)return console.error("Erro ao carregar pedidos do usuario:",t),[];if(r.length===0)return[];const a=r.map(l=>l.id),n=Array.from(new Set(r.map(l=>l.event_id).filter(Boolean))),[{data:c,error:i},{data:s,error:d},{data:m,error:p}]=await Promise.all([o.from("order_items").select("*, ticket_batches (*, ticket_types (*))").in("order_id",a),o.from("tickets").select("*").in("order_id",a),o.from("events").select("id, title, start_date, venue_name, address, city, state").in("id",n)]);return i&&console.error("Erro ao carregar itens dos pedidos do usuario:",i),d&&console.error("Erro ao carregar ingressos do usuario:",d),p&&console.error("Erro ao carregar eventos dos pedidos do usuario:",p),r.map(l=>({...l,order_items:(c??[]).filter(f=>f.order_id===l.id),tickets:(s??[]).filter(f=>f.order_id===l.id),events:(m??[]).find(f=>f.id===l.event_id)??null}))}async function y(){if(!o)return[];const{data:e,error:r}=await o.from("orders").select("*").order("created_at",{ascending:!1});if(r||!e)return console.error("Erro ao carregar pedidos do admin:",r),[];if(e.length===0)return[];const t=e.map(s=>s.id),[{data:a,error:n},{data:c,error:i}]=await Promise.all([o.from("order_items").select("*, ticket_batches (*, ticket_types (*))").in("order_id",t),o.from("tickets").select("*").in("order_id",t)]);return n&&console.error("Erro ao carregar itens dos pedidos:",n),i&&console.error("Erro ao carregar ingressos dos pedidos:",i),e.map(s=>({...s,order_items:(a??[]).filter(d=>d.order_id===s.id),tickets:(c??[]).filter(d=>d.order_id===s.id)}))}async function h(e){if(!o)throw new Error("Banco de dados não conectado.");const{error:r}=await o.rpc("confirm_order_paid",{p_order_id:e});if(r)throw new Error(r.message)}async function x(e){if(!o)throw new Error("Banco de dados não conectado.");const{error:r}=await o.from("orders").update({payment_status:"rejected",status:"cancelled"}).eq("id",e);if(r)throw new Error(r.message)}async function _(e){if(!o)throw new Error("Banco de dados não conectado.");const{data:r,error:t}=await o.rpc("perform_checkin",{ticket_token:e,device:{userAgent:navigator.userAgent}});if(t)throw new Error(t.message);return r}async function v(e){if(!o)throw new Error("Banco de dados não conectado.");const{data:r,error:t}=await o.from("orders").select("buyer_email, buyer_name").eq("id",e).single();if(t||!r)throw new Error("Pedido não encontrado.");const{data:a}=await o.from("tickets").select("code, token").eq("order_id",e);if(!a||a.length===0)throw new Error("Nenhum ingresso encontrado.");const n=a.map(d=>({code:d.code,url:`${window.location.origin}/ingresso/${d.token}`})),c=encodeURIComponent("Seu ingresso - Casa IBBI"),i=encodeURIComponent(g(r.buyer_name,n)),s=encodeURIComponent("matrizibbi@matrizriodavida.com");window.open(`mailto:${r.buyer_email}?cc=${s}&subject=${c}&body=${i}`,"_blank")}export{h as a,w as c,b as g,y as l,_ as p,x as r,v as s};
