import { ArrowLeft, CalendarDays, MapPin, MessageCircle, ShieldCheck, Users } from "lucide-react";
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
              <h2>Descrição</h2>
              <p>{event.description}</p>

              <h2>Informações importantes</h2>
              <p>
                Apresente o QR Code na entrada. Documento com foto pode ser solicitado. O CPF fica protegido no painel administrativo.
              </p>

              <h2>Política de cancelamento</h2>
              <p>
                Cancelamentos e reembolsos devem seguir a política configurada pelo organizador e, quando aplicável, a API do gateway de pagamento.
              </p>

              <h2>Organizador</h2>
              <div className="ibbi-event-organizer">
                <ShieldCheck size={20} /> {event.organizer}
              </div>

              <a
                className="ibbi-event-share"
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Olha esse evento!\n${event.title}\n${longDate(event.startDate)}\nGaranta seu ingresso: ${location.href}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} /> COMPARTILHAR NO WHATSAPP
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
