import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.3";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { orderId } = await req.json();
    if (!orderId) throw new Error("orderId required");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      (Deno.env.get("SUPABASE_SECRET_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"))!
    );
    const { data: order, error } = await supabase.from("orders").select("*, order_items(*)").eq("id", orderId).single();
    if (error || !order) throw new Error("order not found");
    if (order.payment_status !== "pending") throw new Error("invalid payment status");

    const calculated = order.order_items.reduce((sum: number, item: any) => sum + Number(item.unit_price) * Number(item.quantity), 0);
    if (Math.abs(calculated - Number(order.subtotal)) > 0.01) throw new Error("order amount mismatch");

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        external_reference: order.id,
        notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook`,
        back_urls: {
          success: `${Deno.env.get("SITE_URL")}/checkout/sucesso`,
          pending: `${Deno.env.get("SITE_URL")}/checkout/pendente`,
          failure: `${Deno.env.get("SITE_URL")}/checkout/pendente`
        },
        auto_return: "approved",
        payer: { name: order.buyer_name, email: order.buyer_email },
        items: [{ title: `Pedido ${order.id}`, quantity: 1, currency_id: "BRL", unit_price: Number(order.total) }]
      })
    });
    if (!mpRes.ok) throw new Error(await mpRes.text());
    const pref = await mpRes.json();
    await supabase.from("payments").insert({ order_id: order.id, provider_preference_id: pref.id, amount: order.total, status: "pending" });
    return new Response(JSON.stringify({ preference_id: pref.id, init_point: pref.init_point }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "payment_error" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
