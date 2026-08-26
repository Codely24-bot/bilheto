import { CreditCard, UserRound, UsersRound } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { demoEvents } from "../data/demo";
import { calculateOrder, createLocalOrder } from "../services/checkout";
import { markOrderPaid } from "../services/localOrders";
import type { CartLine } from "../types";
import { useAuth } from "../lib/auth";
import { navigate } from "../lib/navigate";

export function Checkout({ orderId }: { orderId: string }) {
  const { user, profile } = useAuth();
  const saved = JSON.parse(sessionStorage.getItem("checkout") ?? `{"eventId":"evt_aprendendo_a_ser_parceiros","items":[{"batchId":"batch_parceiros_1","quantity":1}],"coupon":""}`) as { eventId: string; items: CartLine[]; coupon: string };
  const event = demoEvents.find((item) => item.id === saved.eventId) ?? demoEvents[0];
  const totals = useMemo(() => calculateOrder(event.id, saved.items, saved.coupon), [event.id, saved.items, saved.coupon]);
  const [buyer, setBuyer] = useState({
    buyerName: profile?.name ?? user?.user_metadata?.name ?? "",
    buyerEmail: user?.email ?? "",
    buyerCpf: "",
    buyerPhone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("pix");

  const pay = async () => {
    const order = await createLocalOrder(event.id, saved.items, buyer);
    sessionStorage.setItem("casaibbi_last_order_id", order.id);
    if (paymentMethod === "demo") {
      markOrderPaid(order.id);
      navigate("/checkout/sucesso");
      return;
    }
    navigate("/checkout/pendente");
  };

  return <main className="section"><div className="container mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28 }}>
    <section className="card" style={{ padding: 24 }}>
      <h1>Checkout</h1>
      <Step icon={<UserRound />} title="Dados do comprador" />
      <div className="grid-auto">
        <input className="input" placeholder="Nome" value={buyer.buyerName} onChange={(e) => setBuyer({ ...buyer, buyerName: e.target.value })} />
        <input className="input" placeholder="CPF" onChange={(e) => setBuyer({ ...buyer, buyerCpf: e.target.value })} />
        <input className="input" placeholder="E-mail" value={buyer.buyerEmail} onChange={(e) => setBuyer({ ...buyer, buyerEmail: e.target.value })} />
        <input className="input" placeholder="Telefone" onChange={(e) => setBuyer({ ...buyer, buyerPhone: e.target.value })} />
      </div>
      <Step icon={<UsersRound />} title="Participantes" /><p className="muted">Neste protótipo, os participantes usam os dados do comprador. A estrutura de participantes já está preparada no banco.</p>
      <Step icon={<CreditCard />} title="Pagamento" />
      <div className="grid-auto">
        <label><input type="radio" name="payment" checked={paymentMethod === "pix"} onChange={() => setPaymentMethod("pix")} /> Pix pelo Mercado Pago</label>
        <label><input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} /> Cartão pelo Mercado Pago</label>
        <label><input type="radio" name="payment" checked={paymentMethod === "demo"} onChange={() => setPaymentMethod("demo")} /> Aprovar pagamento de teste</label>
      </div>
      <p className="muted">O pedido nasce como pendente. Com Supabase configurado, a Edge Function cria a preferência do Mercado Pago sem expor token no navegador.</p>
      <button className="btn btn-primary" onClick={pay}>PAGAR COM MERCADO PAGO</button>
    </section>
    <aside className="card" style={{ padding: 20, alignSelf: "start" }}><h2>{event.title}</h2><p className="muted">Pedido {orderId.slice(0, 8)}</p><OrderSummary {...totals} /></aside>
  </div></main>;
}
function Step({ icon, title }: { icon: ReactNode; title: string }) {
  return <h2 style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 28 }}>{icon}{title}</h2>;
}
