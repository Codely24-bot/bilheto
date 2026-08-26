import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.3";

serve(async (req) => {
  try {
    const body = await req.json();
    const paymentId = body?.data?.id ?? body?.id;
    if (!paymentId) return new Response("ignored", { status: 200 });

    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN")}` }
    });
    if (!paymentRes.ok) throw new Error("payment lookup failed");
    const payment = await paymentRes.json();
    const orderId = payment.external_reference;
    const mapped = mapStatus(payment.status);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      (Deno.env.get("SUPABASE_SECRET_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"))!
    );
    await supabase.from("payments").upsert({
      order_id: orderId,
      provider: "mercadopago",
      provider_payment_id: String(payment.id),
      amount: payment.transaction_amount,
      status: mapped,
      payment_method: payment.payment_method_id,
      raw_status: payment,
      updated_at: new Date().toISOString()
    }, { onConflict: "provider_payment_id" });
    await supabase.from("orders").update({ payment_status: mapped }).eq("id", orderId);
    if (mapped === "approved") await supabase.rpc("confirm_order_paid", { p_order_id: orderId });
    return new Response("ok", { status: 200 });
  } catch (err) {
    return new Response(err instanceof Error ? err.message : "webhook_error", { status: 400 });
  }
});

function mapStatus(status: string) {
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  if (status === "cancelled") return "cancelled";
  if (status === "refunded") return "refunded";
  if (status === "charged_back") return "chargeback";
  return "pending";
}
