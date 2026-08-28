import { useEffect, useState } from "react";
import { LogOut, Ticket, CalendarDays, MapPin, Clock, ChevronRight } from "lucide-react";
import { useAuth, logoutUser } from "../lib/auth";
import { getUserOrders } from "../services/orders";
import { longDate, statusLabel } from "../lib/format";

const WHATSAPP_NUMBER = "31972562337";

type TicketRow = {
  id: string;
  code: string;
  token: string;
  status: string;
  checked_in: boolean;
  checked_in_at: string | null;
};

type OrderRow = {
  id: string;
  event_id: string;
  buyer_name: string;
  total: number;
  payment_status: string;
  status: string;
  created_at: string;
  events: {
    title: string;
    start_date: string;
    venue_name: string;
    address: string;
    city: string;
    state: string;
  } | null;
  tickets: TicketRow[];
  order_items: {
    ticket_batches: {
      ticket_types: { name: string };
      name: string;
      price: number;
    };
  }[];
};

function ticketEventTitle(order: OrderRow) {
  return order.events?.title ?? "Aprendendo a Ser Parceiros";
}

function ticketEventDate(order: OrderRow) {
  return longDate(order.events?.start_date ?? "2026-09-19T19:00:00-03:00");
}

function ticketEventLocation(order: OrderRow) {
  return [order.events?.venue_name, order.events?.address].filter(Boolean).join(" — ")
    || "IBBI – Igreja Batista do Bairro Industrial — R. Cel. Gabriel de Andrade, 735 – Industrial, Contagem – MG";
}

export function MyTickets() {
  const { user, profile } = useAuth();
  const displayName = profile?.full_name ?? user?.email ?? "";
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserOrders(user.id).then((data) => {
      setOrders(data as OrderRow[]);
      setLoading(false);
    });
  }, [user]);

  const confirmedOrders = orders.filter((o) => o.status === "paid");
  const pendingOrders = orders.filter((o) => o.status === "open");

  return (
    <main>
      <section className="ibbi-event-hero" style={{ minHeight: 260, maxHeight: 260 }}>
        <div className="ibbi-container">
          <div className="ibbi-event-hero-inner">
            <div className="ibbi-event-hero-info">
              <span className="section-label">Casa IBBI</span>
              <h1>Meus ingressos</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ibbi-section" style={{ padding: "60px 0 100px" }}>
        <div className="ibbi-container">
          <div className="ibbi-tickets-profile">
            <div className="ibbi-tickets-profile-avatar">
              <Ticket size={24} />
            </div>
            <div className="ibbi-tickets-profile-info">
              <span className="ibbi-tickets-profile-label">Logado como</span>
              <strong>{displayName || user?.email}</strong>
              {displayName && user?.email && (
                <span className="ibbi-tickets-profile-email">{user.email}</span>
              )}
            </div>
            <button className="ibbi-btn ibbi-btn--outline ibbi-btn--small" onClick={logoutUser}>
              <LogOut size={15} /> Sair
            </button>
          </div>

          {loading && (
            <div style={{ textAlign: "center", padding: 40, color: "#A6ADAF" }}>
              Carregando ingressos...
            </div>
          )}

          {!loading && pendingOrders.length > 0 && (
            <>
              <div className="ibbi-tickets-section-header" style={{ marginTop: 32 }}>
                <h2>Pagamento pendente</h2>
                <span className="ibbi-tickets-count">{pendingOrders.length} pedido{pendingOrders.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="ibbi-tickets-grid">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="ibbi-ticket-card-item" style={{ borderLeft: "3px solid #f59e0b" }}>
                    <div className="ibbi-ticket-card-status">
                      <span className="ibbi-ticket-badge" style={{ background: "#78350f", color: "#fbbf24" }}>
                        PENDENTE
                      </span>
                    </div>
                    <h3 className="ibbi-ticket-card-title">Pedido #{order.id.slice(0, 8)}</h3>
                    <p style={{ color: "#A6ADAF", fontSize: 14, textAlign: "center" }}>
                      Aguardando confirmação de pagamento
                    </p>
                    <div className="ibbi-ticket-card-footer">
                      <a
                        href={`https://wa.me/55${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Olá! Fiz o pedido #${order.id.slice(0, 8)} e quero enviar o comprovante de pagamento.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ibbi-btn ibbi-btn--primary ibbi-btn--small"
                        style={{ textDecoration: "none" }}
                      >
                        ENVIAR COMPROVANTE
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && confirmedOrders.length > 0 && (
            <>
              <div className="ibbi-tickets-section-header" style={{ marginTop: pendingOrders.length > 0 ? 32 : 0 }}>
                <h2>Ingressos</h2>
                <span className="ibbi-tickets-count">{confirmedOrders.reduce((sum, o) => sum + o.tickets.length, 0)} ingresso{confirmedOrders.reduce((sum, o) => sum + o.tickets.length, 0) !== 1 ? "s" : ""}</span>
              </div>
              <div className="ibbi-tickets-grid">
                {confirmedOrders.map((order) =>
                  order.tickets.map((ticket) => (
                    <a href={`/ingresso/${ticket.token}`} className="ibbi-ticket-card-link" key={ticket.id}>
                      <div className="ibbi-ticket-card-item">
                        <div className="ibbi-ticket-card-status">
                          <span className={`ibbi-ticket-badge ibbi-ticket-badge--${ticket.status === "valid" ? "valid" : "invalid"}`}>
                            {ticket.status === "valid" ? "VÁLIDO" : ticket.status === "used" ? "UTILIZADO" : statusLabel(ticket.status).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="ibbi-ticket-card-title">{ticketEventTitle(order)}</h3>
                        <div className="ibbi-ticket-card-details">
                          <div className="ibbi-ticket-card-detail">
                            <CalendarDays size={14} /> {ticketEventDate(order)}
                          </div>
                          <div className="ibbi-ticket-card-detail">
                            <MapPin size={14} /> {ticketEventLocation(order)}
                          </div>
                          <div className="ibbi-ticket-card-detail">
                            <Clock size={14} /> {order.order_items[0]?.ticket_batches?.ticket_types?.name ?? "CASAL"}
                          </div>
                        </div>
                        <div className="ibbi-ticket-card-footer">
                          <span className="ibbi-ticket-card-code">{ticket.code}</span>
                          <span className="ibbi-ticket-card-action">
                            Ver ingresso <ChevronRight size={16} />
                          </span>
                        </div>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </>
          )}

          {!loading && confirmedOrders.length === 0 && pendingOrders.length === 0 && (
            <div className="ibbi-tickets-empty">
              <Ticket size={40} />
              <p>Nenhum ingresso encontrado.</p>
              <a href="/#eventos" className="ibbi-btn ibbi-btn--primary" style={{ marginTop: 16 }}>
                VER EVENTOS
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
