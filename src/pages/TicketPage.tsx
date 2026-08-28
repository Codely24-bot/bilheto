import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Download, CalendarDays, MapPin, User, Tag } from "lucide-react";
import { supabase } from "../lib/supabase";
import { longDate, statusLabel } from "../lib/format";

type TicketData = {
  id: string;
  code: string;
  token: string;
  status: string;
  checked_in: boolean;
  attendees: { name: string; email: string } | null;
  ticket_batches: {
    ticket_types: { name: string };
    name: string;
    price: number;
  };
  events: {
    title: string;
    start_date: string;
    venue_name: string;
    address: string;
  };
};

export function TicketPage({ token }: { token: string }) {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const downloadTicket = () => window.print();

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from("tickets")
      .select(`
        id, code, token, status, checked_in,
        attendees (name, email),
        ticket_batches (ticket_types (name), name, price),
        events (title, start_date, venue_name, address)
      `)
      .eq("token", token)
      .single()
      .then(({ data }) => {
        if (data) {
          const attendees = Array.isArray(data.attendees) ? data.attendees[0] : data.attendees;
          const tb = Array.isArray(data.ticket_batches) ? data.ticket_batches[0] : data.ticket_batches;
          const tt = tb ? (Array.isArray(tb.ticket_types) ? tb.ticket_types[0] : tb.ticket_types) : null;
          const ev = Array.isArray(data.events) ? data.events[0] : data.events;
          setTicket({
            ...data,
            attendees: attendees ?? null,
            ticket_batches: { ...tb, ticket_types: tt },
            events: ev,
          } as TicketData);
        }
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <main style={{ textAlign: "center", padding: 80, color: "#A6ADAF" }}>
        Carregando ingresso...
      </main>
    );
  }

  if (!ticket) {
    return (
      <main style={{ textAlign: "center", padding: 80, color: "#A6ADAF" }}>
        <p>Ingresso não encontrado.</p>
        <a href="/meus-ingressos" className="ibbi-btn ibbi-btn--primary" style={{ marginTop: 16 }}>
          Voltar
        </a>
      </main>
    );
  }

  const eventName = ticket.events?.title ?? "Evento";
  const startDate = ticket.events?.start_date ?? "";
  const venueName = ticket.events?.venue_name ?? "";
  const address = ticket.events?.address ?? "";
  const attendeeName = ticket.attendees?.name ?? "";
  const ticketType = ticket.ticket_batches?.ticket_types?.name ?? "";

  return (
    <main>
      <section className="ibbi-event-hero" style={{ minHeight: 260, maxHeight: 260 }}>
        <div className="ibbi-container">
          <div className="ibbi-event-hero-inner">
            <div className="ibbi-event-hero-info">
              <a href="/meus-ingressos" className="ibbi-event-back">
                <ArrowLeft size={15} /> Voltar para meus ingressos
              </a>
              <span className="section-label">Casa IBBI</span>
              <h1>Seu ingresso</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ibbi-section" style={{ padding: "60px 0 100px" }}>
        <div className="ibbi-container" style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="ibbi-ticket-detail">
            <div className="ibbi-ticket-detail-header">
              <img src="/logo-casa-ibbi.svg" alt="Casa IBBI" className="ibbi-ticket-detail-logo" />
              <span className={`ibbi-ticket-detail-badge ibbi-ticket-detail-badge--${ticket.status === "valid" ? "valid" : "invalid"}`}>
                {ticket.status === "valid" ? "VÁLIDO" : ticket.status === "used" ? "UTILIZADO" : statusLabel(ticket.status).toUpperCase()}
              </span>
            </div>

            <div className="ibbi-ticket-detail-divider" />

            <h2 className="ibbi-ticket-detail-event">{eventName}</h2>

            <div className="ibbi-ticket-detail-info">
              <div className="ibbi-ticket-detail-row">
                <User size={16} />
                <div>
                  <span className="ibbi-ticket-detail-label">Casal</span>
                  <strong>{attendeeName}</strong>
                </div>
              </div>
              <div className="ibbi-ticket-detail-row">
                <Tag size={16} />
                <div>
                  <span className="ibbi-ticket-detail-label">Tipo</span>
                  <strong>{ticketType}</strong>
                </div>
              </div>
              <div className="ibbi-ticket-detail-row">
                <CalendarDays size={16} />
                <div>
                  <span className="ibbi-ticket-detail-label">Data e hora</span>
                  <strong>{startDate ? longDate(startDate) : ""}</strong>
                </div>
              </div>
              <div className="ibbi-ticket-detail-row">
                <MapPin size={16} />
                <div>
                  <span className="ibbi-ticket-detail-label">Local</span>
                  <strong>{venueName}{address ? ` — ${address}` : ""}</strong>
                </div>
              </div>
            </div>

            <div className="ibbi-ticket-detail-qr">
              <div className="ibbi-ticket-detail-qr-frame">
                <QRCodeSVG value={ticket.token} size={180} bgColor="#FFFFFF" fgColor="#071116" />
              </div>
              <p className="ibbi-ticket-detail-code">
                Código: <strong>{ticket.code}</strong>
              </p>
            </div>

            <div className="ibbi-ticket-detail-divider" />

            <button className="ibbi-btn ibbi-btn--primary ibbi-btn--full" onClick={downloadTicket}>
              <Download size={16} /> BAIXAR INGRESSO
            </button>
          </div>
        </div>
      </section>

      {createPortal(
        <div className="ibbi-print-ticket">
          <div className="ibbi-print-ticket-card">
            <p className="ibbi-print-ticket-brand">Casa IBBI</p>
            <h1 className="ibbi-print-ticket-event">{eventName}</h1>
            <p className="ibbi-print-ticket-name">{attendeeName}</p>
            <div className="ibbi-print-ticket-qr">
              <QRCodeSVG value={ticket.token} size={200} bgColor="#FFFFFF" fgColor="#071116" />
            </div>
            <p className="ibbi-print-ticket-code">
              Nº do ingresso: <strong>{ticket.code}</strong>
            </p>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}
