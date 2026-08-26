import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { demoTickets } from "../data/demo";
import { testClientEmail } from "../lib/localUsers";

export function Checkin() {
  const [result, setResult] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const ticket = demoTickets.find((item) => item.token === result);
  useEffect(() => {
    if (!open) return;
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    scanner.render((text) => setResult(text), () => undefined);
    return () => { scanner.clear().catch(() => undefined); };
  }, [open]);
  return <main className="section"><div className="container" style={{ maxWidth: 760 }}>
    <h1>Check-in</h1><select className="input"><option>Casados para Sempre - IGREJA BATISTA DO BAIRRO INDUSTRIAL</option></select>
    <button className="btn btn-primary" style={{ margin: "16px 0" }} onClick={() => setOpen(true)}><Camera size={18} />ABRIR LEITOR</button>
    <div id="reader" className="card" style={{ overflow: "hidden" }} />
    {result && <div className="card" style={{ marginTop: 18, padding: 22, borderColor: ticket ? "var(--success)" : "var(--danger)" }}>
      {ticket ? <><CheckCircle2 color="var(--success)" /><h2>{confirmed ? "ENTRADA CONFIRMADA" : "INGRESSO VALIDO"}</h2><p>Nome: {ticket.attendeeName}</p><p>Email: {testClientEmail}</p><p>Ingresso: {ticket.ticketType}</p><button className="btn btn-primary" onClick={() => setConfirmed(true)} disabled={confirmed}>{confirmed ? "CHECK-IN REALIZADO" : "CONFIRMAR ENTRADA"}</button></> : <><XCircle color="var(--danger)" /><h2>INGRESSO NAO ENCONTRADO</h2></>}
    </div>}
  </div></main>;
}
