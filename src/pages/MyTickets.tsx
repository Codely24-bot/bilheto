import { LogOut } from "lucide-react";
import { demoTickets } from "../data/demo";
import { useAuth, logoutUser } from "../lib/auth";

export function MyTickets() {
  const { user, profile } = useAuth();
  const displayName = profile?.name ?? user?.email ?? "";
  return <main className="section"><div className="container" style={{ textAlign: "center" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
      <h1 style={{ margin: 0 }}>Meus ingressos</h1>
      <button className="btn btn-ghost" onClick={logoutUser} style={{ padding: "8px 12px", fontSize: 13 }}><LogOut size={15} />Sair</button>
    </div>
    <p className="muted">Logado como: {user?.email}{displayName ? ` • ${displayName}` : ""}</p>
    <h2>Próximos eventos</h2>
    <div className="grid-auto">{demoTickets.map((ticket) => <div className="card" key={ticket.token} style={{ padding: 18 }}>
      <h3>{ticket.eventTitle}</h3><p>{ticket.date}</p><p className="muted">{ticket.venue}</p><a className="btn btn-primary" href={`/ingresso/${ticket.token}`}>VER INGRESSO</a>
    </div>)}</div>
    <h2>Eventos anteriores</h2>
    <p className="muted">Nenhum evento anterior encontrado.</p>
  </div></main>;
}
