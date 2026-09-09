import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { jsPDF } from "jspdf";
import { ArrowLeft, Download, CalendarDays, MapPin, User, Tag, MessageCircle } from "lucide-react";
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
  orders: { buyer_phone: string } | null;
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
        orders (buyer_phone),
        events (title, start_date, venue_name, address)
      `)
      .eq("token", token)
      .single()
      .then(({ data }) => {
        if (data) {
          const attendees = Array.isArray(data.attendees) ? data.attendees[0] : data.attendees;
          const tb = Array.isArray(data.ticket_batches) ? data.ticket_batches[0] : data.ticket_batches;
          const tt = tb ? (Array.isArray(tb.ticket_types) ? tb.ticket_types[0] : tb.ticket_types) : null;
          const ord = Array.isArray(data.orders) ? data.orders[0] : data.orders;
          const ev = Array.isArray(data.events) ? data.events[0] : data.events;
          setTicket({
            ...data,
            attendees: attendees ?? null,
            ticket_batches: { ...tb, ticket_types: tt },
            orders: ord ?? null,
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
  const startDate = "2026-09-19T19:00:00-03:00";
  const venueName = ticket.events?.venue_name ?? "";
  const address = ticket.events?.address ?? "";
  const attendeeName = ticket.attendees?.name ?? "";
  const ticketType = ticket.ticket_batches?.ticket_types?.name ?? "";
  const phoneDigits = (ticket.orders?.buyer_phone ?? "").replace(/\D+/g, "");
  const waNumber = phoneDigits.length >= 12 && phoneDigits.startsWith("55")
    ? phoneDigits
    : phoneDigits
      ? `55${phoneDigits}`
      : "";
  const ticketUrl = `${window.location.origin}/ingresso/${ticket.token}`;
  const whatsappUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Olá, ${attendeeName || "você"}! Aqui está o seu ingresso para ${eventName}:\n\n${ticketUrl}\n\nCódigo do ingresso: ${ticket.code}`
      )}`
    : null;

  async function shareTicketPdf() {
    let qrDataUrl = "";

    const qrSvg = document.querySelector<SVGSVGElement>(".ibbi-print-ticket-qr svg");
    if (qrSvg) {
      const svgSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(qrSvg))}`;
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Falha ao gerar o QR Code."));
        img.src = svgSrc;
      });
      const canvas = document.createElement("canvas");
      const size = 600;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        qrDataUrl = canvas.toDataURL("image/png");
      }
    }

    const width = 100;
    const height = 150;
    const pdf = new jsPDF({ unit: "mm", format: [width, height], orientation: "portrait" });

    pdf.setDrawColor(214, 161, 58);
    pdf.setLineWidth(1);
    pdf.rect(4, 4, width - 8, height - 8);
    pdf.rect(7, 7, width - 14, height - 14);

    let y = 18;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(214, 161, 58);
    pdf.text("CASA IBBI", width / 2, y, { align: "center" });
    y += 9;

    pdf.setFontSize(20);
    pdf.setTextColor(7, 17, 22);
    let lines = pdf.splitTextToSize(eventName, width - 20);
    pdf.text(lines, width / 2, y, { align: "center" });
    y += lines.length * 7 + 2;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(85, 85, 85);
    lines = pdf.splitTextToSize(longDate(startDate), width - 20);
    pdf.text(lines, width / 2, y, { align: "center" });
    y += lines.length * 5 + 3;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(7, 17, 22);
    lines = pdf.splitTextToSize(attendeeName, width - 20);
    pdf.text(lines, width / 2, y, { align: "center" });
    y += lines.length * 8 + 5;

    if (qrDataUrl) {
      const qrSize = 58;
      pdf.addImage(qrDataUrl, "PNG", (width - qrSize) / 2, y, qrSize, qrSize);
      y += qrSize + 8;
    }

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(85, 85, 85);
    pdf.text(`Nº do ingresso: ${ticket.code}`, width / 2, y, { align: "center" });

    const file = new File([pdf.output("blob")], `ingresso-${ticket.code}.pdf`, { type: "application/pdf" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `Ingresso - ${eventName}`,
        text: `Seu ingresso para ${eventName} (${ticket.code})`,
      });
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    if (whatsappUrl) window.open(whatsappUrl, "_blank");
  }

  return (
    <main>
      <section className="ibbi-event-hero ibbi-simple-hero">
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
                  <strong>{address || venueName}</strong>
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

            {waNumber && (
              <button
                type="button"
                onClick={shareTicketPdf}
                className="ibbi-btn ibbi-btn--full"
                style={{ marginTop: 12, background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", cursor: "pointer" }}
              >
                <MessageCircle size={16} /> ENVIAR INGRESSO (PDF) PELO WHATSAPP
              </button>
            )}
          </div>
        </div>
      </section>

      {createPortal(
        <div className="ibbi-print-ticket">
          <div className="ibbi-print-ticket-card">
            <p className="ibbi-print-ticket-brand">Casa IBBI</p>
            <h1 className="ibbi-print-ticket-event">{eventName}</h1>
            <p className="ibbi-print-ticket-date">{longDate(startDate)}</p>
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
