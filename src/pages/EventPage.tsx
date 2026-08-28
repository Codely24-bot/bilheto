import { CalendarDays, MapPin, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { demoEvents } from "../data/demo";
import { longDate } from "../lib/format";
import { useAuth } from "../lib/auth";

export function EventPage({ slug }: { slug: string }) {
  const { user } = useAuth();
  const event = demoEvents.find((item) => item.slug === slug) ?? demoEvents[0];
  const checkoutHref = `/checkout/${event.slug}`;
  const buyHref = user ? checkoutHref : `/login?redirect=${encodeURIComponent(checkoutHref)}`;

  return (
    <main>
      <section className="ibbi-event-hero">
        <div className="ibbi-container">
          <div className="ibbi-event-hero-inner">
            <div className="ibbi-event-hero-info">
              <span className="section-label">{event.category}</span>
              <h1>{event.title}</h1>
              <div className="ibbi-event-hero-meta">
                <span className="ibbi-event-hero-meta-item">
                  <CalendarDays size={16} /> {longDate(event.startDate)}
                </span>
                <span className="ibbi-event-hero-meta-item">
                  <MapPin size={16} /> {event.address}
                </span>
                <span className="ibbi-event-hero-meta-item">
                  <Users size={16} /> {event.ageRating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ibbi-event-body">
        <div className="ibbi-container">
          <div className="ibbi-event-grid">
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

            <aside className="ibbi-event-sidebar">
              <div className="ibbi-checkout-event-thumb">
                <img src={event.posterUrl ?? event.coverUrl} alt={event.title} />
              </div>
              <h2>{event.title}</h2>
              <div className="ibbi-checkout-event-meta">
                <span>{event.address}</span>
              </div>
              <a
                href={buyHref}
                className="ibbi-btn ibbi-btn--primary ibbi-btn--full"
                style={{ marginTop: 16, textAlign: "center", justifyContent: "center" }}
              >
                COMPRAR INGRESSO
              </a>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
