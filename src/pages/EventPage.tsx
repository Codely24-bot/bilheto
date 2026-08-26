import { ArrowLeft, CalendarDays, MapPin, MessageCircle, ShieldCheck, Users, Clock, Ticket, Info, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { TicketSelector } from "../components/tickets/TicketSelector";
import { demoEvents } from "../data/demo";
import { calculateOrder } from "../services/checkout";
import type { CartLine } from "../types";
import { longDate } from "../lib/format";
import { navigate } from "../lib/navigate";

export function EventPage({ slug }: { slug: string }) {
  const event = demoEvents.find((item) => item.slug === slug) ?? demoEvents[0];
  const [items, setItems] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState("");
  const totals = useMemo(() => calculateOrder(event.id, items, coupon), [event.id, items, coupon]);
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const beginCheckout = () => {
    sessionStorage.setItem("checkout", JSON.stringify({ eventId: event.id, items, coupon }));
    navigate(`/checkout/${crypto.randomUUID()}`);
  };

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <main>
      {/* Hero */}
      <section className="ibbi-event-hero">
        <div className="ibbi-container">
          <div className="ibbi-event-hero-inner">
            <div className="ibbi-event-hero-info">
              <button className="ibbi-event-back" onClick={() => navigate("/")}>
                <ArrowLeft size={18} /> Voltar
              </button>
              <span className="section-label">{event.category}</span>
              <h1>{event.title}</h1>
              <div className="ibbi-event-hero-meta">
                <span className="ibbi-event-hero-meta-item">
                  <CalendarDays size={16} /> {longDate(event.startDate)}
                </span>
                <span className="ibbi-event-hero-meta-item">
                  <Clock size={16} /> {startDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} – {endDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="ibbi-event-hero-meta-item">
                  <MapPin size={16} /> {event.venueName}
                </span>
                <span className="ibbi-event-hero-meta-item">
                  <Users size={16} /> {event.ageRating}
                </span>
              </div>
            </div>
            <div className="ibbi-event-poster">
              <img src={event.posterUrl ?? event.coverUrl} alt={event.title} />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="ibbi-event-body">
        <div className="ibbi-container">
          <div className="ibbi-event-grid">
            {/* Description */}
            <article className="ibbi-event-content">
              <div className="ibbi-event-section">
                <div className="ibbi-event-section-header">
                  <Info size={20} />
                  <h2>Descrição</h2>
                </div>
                <p>{event.description}</p>
              </div>

              <div className="ibbi-event-section">
                <div className="ibbi-event-section-header">
                  <Ticket size={20} />
                  <h2>Informações do evento</h2>
                </div>
                <div className="ibbi-event-info-grid">
                  <div className="ibbi-event-info-row">
                    <span className="ibbi-event-info-label">Data</span>
                    <span className="ibbi-event-info-value">{longDate(event.startDate)}</span>
                  </div>
                  <div className="ibbi-event-info-row">
                    <span className="ibbi-event-info-label">Horário</span>
                    <span className="ibbi-event-info-value">
                      {startDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} às {endDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="ibbi-event-info-row">
                    <span className="ibbi-event-info-label">Local</span>
                    <span className="ibbi-event-info-value">{event.venueName}</span>
                  </div>
                  <div className="ibbi-event-info-row">
                    <span className="ibbi-event-info-label">Endereço</span>
                    <span className="ibbi-event-info-value">{event.address}</span>
                  </div>
                  <div className="ibbi-event-info-row">
                    <span className="ibbi-event-info-label">Classificação</span>
                    <span className="ibbi-event-info-value">{event.ageRating}</span>
                  </div>
                </div>
              </div>

              <div className="ibbi-event-section">
                <div className="ibbi-event-section-header">
                  <ShieldCheck size={20} />
                  <h2>Política de entrada</h2>
                </div>
                <ul className="ibbi-event-rules">
                  <li>Apresente o QR Code na entrada do evento.</li>
                  <li>Documento com foto pode ser solicitado na entrada.</li>
                  <li>O CPF do comprador fica protegido no painel administrativo.</li>
                  <li>Cada ingresso dá direito a uma pessoa.</li>
                </ul>
              </div>

              <div className="ibbi-event-section">
                <div className="ibbi-event-section-header">
                  <ShieldCheck size={20} />
                  <h2>Política de cancelamento</h2>
                </div>
                <p>Cancelamentos e reembolsos devem seguir a política configurada pelo organizador e, quando aplicável, a API do gateway de pagamento.</p>
              </div>

              <div className="ibbi-event-divider" />

              <div className="ibbi-event-organizer">
                <ShieldCheck size={20} />
                <div>
                  <span className="ibbi-event-organizer-label">Organizador</span>
                  <span className="ibbi-event-organizer-name">{event.organizer}</span>
                </div>
              </div>

              <a
                className="ibbi-event-share"
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Olha esse evento!\n${event.title}\n${longDate(event.startDate)}\nGaranta seu ingresso: ${location.href}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Share2 size={18} /> COMPARTILHAR
              </a>
            </article>

            {/* Ticket sidebar */}
            <aside className="ibbi-event-sidebar">
              <h2>Ingressos</h2>
              <TicketSelector event={event} items={items} onChange={setItems} />
              <input
                className="ibbi-event-coupon"
                placeholder="Possui cupom de desconto?"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <OrderSummary {...totals} />
              <button
                className="ibbi-btn ibbi-btn--primary ibbi-event-buy-btn"
                disabled={!quantity}
                onClick={beginCheckout}
              >
                COMPRAR INGRESSOS
              </button>
            </aside>
          </div>
        </div>
      </section>

      {/* Mobile sticky bottom bar */}
      <div className={`ibbi-event-bottom-bar ${quantity ? "ibbi-event-bottom-bar--visible" : ""}`}>
        <strong>
          {quantity} ingressos<br />
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals.total)}
        </strong>
        <button className="ibbi-btn ibbi-btn--primary" onClick={beginCheckout}>
          CONTINUAR
        </button>
      </div>
    </main>
  );
}
