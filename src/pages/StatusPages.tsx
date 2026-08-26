export function Success() {
  return <main className="section"><div className="container" style={{ maxWidth: 620, textAlign: "center" }}><div className="card" style={{ padding: 36 }}><h1>Pagamento recebido!</h1><p>Seus ingressos estão prontos.</p><a className="btn btn-primary" href="/meus-ingressos">VER MEUS INGRESSOS</a></div></div></main>;
}

export function Pending() {
  return <main className="section"><div className="container" style={{ maxWidth: 620, textAlign: "center" }}><div className="card" style={{ padding: 36 }}><h1>Estamos aguardando a confirmação do pagamento.</h1><p className="muted">Quando o webhook confirmar o Mercado Pago, os ingressos e QR Codes serão liberados.</p><a className="btn btn-ghost" href="/meus-ingressos">VER STATUS</a></div></div></main>;
}
