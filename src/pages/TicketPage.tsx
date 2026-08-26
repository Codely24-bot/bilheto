import { QRCodeSVG } from "qrcode.react";
import { StatusBadge } from "../components/ui/StatusBadge";
import { demoTickets } from "../data/demo";

export function TicketPage({ token }: { token: string }) {
  const ticket = demoTickets.find((item) => item.token === token) ?? demoTickets[0];
  const downloadTicket = () => window.print();
  return <main className="section"><div className="container" style={{ maxWidth: 680 }}>
    <div className="card" style={{ padding: 28, textAlign: "center" }}>
      <div style={{ width: 230, height: 72, margin: "0 auto 18px", display: "flex", alignItems: "center" }}>
        <img src="/logo-casa-ibbi.svg" alt="Casa IBBI" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div><h1>INGRESSO</h1><StatusBadge status={ticket.status === "valid" ? "VALIDO" : ticket.status.toUpperCase()} />
      <h2>{ticket.eventTitle}</h2><p>{ticket.attendeeName}</p><p className="muted">{ticket.ticketType} - {ticket.batchName}</p><p>{ticket.date}</p><p>{ticket.venue}</p>
      <div style={{ margin: "24px auto", background: "white", padding: 18, width: 260 }}><QRCodeSVG value={ticket.token} size={220} /></div>
      <p className="muted">Codigo: <strong>{ticket.code}</strong></p><button className="btn btn-primary" onClick={downloadTicket}>BAIXAR INGRESSO</button>
    </div>
  </div></main>;
}
