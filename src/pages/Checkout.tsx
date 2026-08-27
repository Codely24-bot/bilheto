import { useState } from "react";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import { useAuth } from "../lib/auth";
import { createOrder } from "../services/orders";
import { demoEvents } from "../data/demo";
import { brl } from "../lib/format";

const PIX_KEY = "17509738000181";

export function Checkout({ slug }: { slug: string }) {
  const { user } = useAuth();
  const event = demoEvents.find((item) => item.slug === slug) ?? demoEvents[0];
  const batch = event.batches[0];

  const [coupleName, setCoupleName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const total = batch.price * quantity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setError("Faça login para continuar."); return; }
    if (!coupleName.trim()) { setError("Informe o nome do casal."); return; }
    if (!email.trim()) { setError("Informe seu e-mail."); return; }
    if (!cpf.trim()) { setError("Informe seu CPF."); return; }
    if (!phone.trim()) { setError("Informe seu telefone."); return; }

    setLoading(true);
    setError("");

    try {
      const newOrder = await createOrder({
        userId: user.id,
        eventId: event.id,
        buyerName: coupleName.trim(),
        buyerEmail: email.trim(),
        buyerCpf: cpf.trim(),
        buyerPhone: phone.trim(),
        items: [{ batchId: batch.id, quantity }],
        total,
      });
      setOrder(newOrder);
    } catch (err: any) {
      setError(err.message || "Erro ao criar pedido.");
    } finally {
      setLoading(false);
    }
  }

  if (order) {
    return (
      <main>
        <section className="ibbi-event-hero" style={{ minHeight: 260, maxHeight: 260 }}>
          <div className="ibbi-container">
            <div className="ibbi-event-hero-inner">
              <div className="ibbi-event-hero-info">
                <span className="section-label">Pagamento via PIX</span>
                <h1>PIX para pagamento</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="ibbi-section" style={{ padding: "60px 0 100px" }}>
          <div className="ibbi-container" style={{ maxWidth: 500, margin: "0 auto" }}>
            <div className="ibbi-checkout-success-card">
              <CheckCircle size={64} style={{ color: "var(--success, #22c55e)" }} />
              <h2>Pedido criado!</h2>
              <p style={{ color: "#A6ADAF", textAlign: "center" }}>
                Faça o pagamento via PIX e envie o comprovante pelo WhatsApp.
              </p>

              <div className="ibbi-checkout-success-divider" />

              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <p style={{ fontSize: 13, color: "#A6ADAF", marginBottom: 12 }}>Escaneie o QR Code abaixo para pagar via PIX:</p>
                <img
                  src="/PIX%20QR%20CODE.png"
                  alt="QR Code PIX"
                  style={{
                    display: "block",
                    margin: "0 auto",
                    width: "100%",
                    maxWidth: 280,
                    borderRadius: 12,
                    border: "2px solid var(--gold, #D6A13A)",
                  }}
                />
                <p style={{ fontSize: 12, color: "#A6ADAF", marginTop: 12 }}>
                  Valor: <strong style={{ color: "#fff" }}>{brl(total)}</strong>
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(PIX_KEY);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  style={{
                    marginTop: 10,
                    background: "none",
                    border: "1px solid var(--gold, #D6A13A)",
                    color: copied ? "var(--success, #22c55e)" : "var(--gold, #D6A13A)",
                    cursor: "pointer",
                    padding: "8px 16px",
                    borderRadius: 6,
                    fontSize: 13,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {copied ? <><CheckCircle size={14} /> Copiado!</> : <><Copy size={14} /> Copiar chave PIX</>}
                </button>
              </div>

              <div className="ibbi-checkout-success-divider" />

              <p style={{ fontSize: 13, color: "#A6ADAF", textAlign: "center" }}>
                Após o pagamento, envie o comprovante via WhatsApp. O administrador irá confirmar seu pagamento e liberar seu ingresso.
              </p>

              <a href="/meus-ingressos" className="ibbi-btn ibbi-btn--primary ibbi-btn--full" style={{ marginTop: 16 }}>
                VER MEUS INGRESSOS
              </a>

              <a href="/" className="ibbi-checkout-success-link">
                Voltar para a página inicial
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="ibbi-event-hero" style={{ minHeight: 260, maxHeight: 260 }}>
        <div className="ibbi-container">
          <div className="ibbi-event-hero-inner">
            <div className="ibbi-event-hero-info">
              <a href={`/evento/${slug}`} className="ibbi-event-back">
                <ArrowLeft size={15} /> Voltar para o evento
              </a>
              <span className="section-label">Inscrição</span>
              <h1>Comprar ingresso</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ibbi-section" style={{ padding: "60px 0 100px" }}>
        <div className="ibbi-container">
          <div className="ibbi-event-grid">
            <form onSubmit={handleSubmit} className="ibbi-event-content" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && <div style={{ background: "#3b1111", border: "1px solid #dc2626", borderRadius: 8, padding: 14, color: "#fca5a5", fontSize: 14 }}>{error}</div>}

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: "#A6ADAF" }}>Nome do casal no ingresso *</span>
                <input className="input" value={coupleName} onChange={(e) => setCoupleName(e.target.value)} placeholder="Ex: Joao e Maria" required />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: "#A6ADAF" }}>E-mail *</span>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: "#A6ADAF" }}>CPF *</span>
                <input className="input" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" required />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: "#A6ADAF" }}>Telefone / WhatsApp *</span>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(31) 99999-0000" required />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, color: "#A6ADAF" }}>Quantidade</span>
                <select className="input" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                  {Array.from({ length: batch.maxPerOrder }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "ingresso" : "ingressos"}</option>
                  ))}
                </select>
              </label>

              <button type="submit" className="ibbi-btn ibbi-btn--primary ibbi-btn--full" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? "CRIANDO PEDIDO..." : "CONTINUAR"}
              </button>
            </form>

            <aside className="ibbi-event-sidebar">
              <div className="ibbi-checkout-event-thumb">
                <img src={event.posterUrl ?? event.coverUrl} alt={event.title} />
              </div>
              <h2>{event.title}</h2>
              <div className="ibbi-checkout-event-meta">
                <span>{event.venueName}</span>
                <span>{event.city} - {event.state}</span>
              </div>
              <div style={{ borderTop: "1px solid var(--border, #1a2e36)", paddingTop: 16, marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#A6ADAF" }}>
                  <span>{batch.ticketTypeName} — {batch.name}</span>
                  <span>{brl(batch.price)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, marginTop: 12 }}>
                  <span>Total</span>
                  <span>{brl(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
