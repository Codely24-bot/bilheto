import { useEffect, useState } from "react";
import { LogOut, Mail, Ticket, Camera, LayoutDashboard, ClipboardList, QrCode, Home } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatusBadge } from "../components/ui/StatusBadge";
import { brl } from "../lib/format";
import { useAuth, logoutUser } from "../lib/auth";
import { listAllOrders, approveOrder, rejectOrder, sendTicketEmail } from "../services/orders";

type OrderRow = {
  id: string;
  user_id: string;
  event_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_cpf: string;
  buyer_phone: string;
  total: number;
  payment_status: string;
  status: string;
  created_at: string;
  tickets: { id: string; code: string; token: string; status: string }[];
  order_items: {
    quantity: number;
    ticket_batches: {
      ticket_types: { name: string };
      name: string;
    };
  }[];
};

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Pedidos", icon: ClipboardList, href: "/admin/pedidos" },
  { label: "Ingressos", icon: Ticket, href: "/admin/ingressos" },
  { label: "Check-in", icon: QrCode, href: "/admin/check-in" },
];

export function Admin({ page = "dashboard" }: { page?: string }) {
  const { user } = useAuth();
  const normalizedPage = page.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const activePage = normalizedPage.includes("pedido") || normalizedPage.includes("order") ? "pedidos"
    : normalizedPage.includes("ingressos") ? "ingressos"
    : normalizedPage.includes("check-in") || normalizedPage.includes("checkin") ? "checkin"
    : "dashboard";
  const pageTitle = activePage === "dashboard" ? "Dashboard"
    : activePage === "pedidos" ? "Gerenciar Pedidos"
    : activePage === "ingressos" ? "Ingressos"
    : "Check-in";

  return (
    <main className="ibbi-admin">
      <header className="ibbi-admin-mobile-header">
        <a href="/" className="ibbi-admin-mobile-logo">
          <img src="/logo-casa-ibbi.svg" alt="Casa IBBI" />
          <span>Painel admin</span>
        </a>
        <button className="ibbi-admin-mobile-logout" onClick={logoutUser} aria-label="Sair">
          <LogOut size={17} />
        </button>
      </header>

      <nav className="ibbi-admin-mobile-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = (item.href.includes("pedidos") && activePage === "pedidos")
            || (item.href.includes("ingressos") && activePage === "ingressos")
            || (item.href.includes("check-in") && activePage === "checkin")
            || (item.href.includes("dashboard") && activePage === "dashboard");
          return (
            <a key={item.href} href={item.href} className={`ibbi-admin-mobile-nav-link ${isActive ? "ibbi-admin-mobile-nav-link--active" : ""}`}>
              <item.icon size={16} /> {item.label}
            </a>
          );
        })}
      </nav>

      <aside className="ibbi-admin-sidebar">
        <div className="ibbi-admin-sidebar-logo">
          <img src="/logo-casa-ibbi.svg" alt="Casa IBBI" />
        </div>

        <a href="/" className="ibbi-admin-sidebar-home">
          <Home size={15} /> Voltar ao site
        </a>

        <nav className="ibbi-admin-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = (item.href.includes("pedidos") && activePage === "pedidos")
              || (item.href.includes("ingressos") && activePage === "ingressos")
              || (item.href.includes("check-in") && activePage === "checkin")
              || (item.href.includes("dashboard") && activePage === "dashboard");
            return (
              <a key={item.href} href={item.href} className={`ibbi-admin-nav-link ${isActive ? "ibbi-admin-nav-link--active" : ""}`}>
                <item.icon size={17} /> {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ibbi-admin-sidebar-footer">
          <span className="ibbi-admin-sidebar-email">{user?.email}</span>
          <button className="ibbi-btn ibbi-btn--outline ibbi-btn--full" onClick={logoutUser} style={{ padding: "10px 0", fontSize: 13 }}>
            <LogOut size={15} /> Sair
          </button>
        </div>
      </aside>

      <section className="ibbi-admin-content">
        <header className="ibbi-admin-header">
          <h1 className="ibbi-admin-title">{pageTitle}</h1>
        </header>

        <div className="ibbi-admin-body">
          {activePage === "pedidos" ? <OrdersAdmin /> :
            activePage === "ingressos" ? <TicketsAdmin /> :
            activePage === "checkin" ? <CheckinAdmin /> :
            <Dashboard />}
        </div>
      </section>
    </main>
  );
}

function Dashboard() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAllOrders().then((data) => { setOrders(data as OrderRow[]); setLoading(false); });
  }, []);

  const paidOrders = orders.filter((o) => o.payment_status === "approved");
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const sold = paidOrders.reduce((sum, o) => sum + o.tickets.length, 0);
  const pending = orders.filter((o) => o.status === "open").length;
  const checkedIn = paidOrders.reduce((sum, o) => sum + o.tickets.filter((t) => t.status === "used").length, 0);

  const metrics = [
    { label: "Receita total", value: brl(revenue), color: "var(--gold)" },
    { label: "Ingressos vendidos", value: String(sold), color: "var(--success)" },
    { label: "Pedidos pendentes", value: String(pending), color: "var(--warning)" },
    { label: "Check-ins", value: String(checkedIn), color: "var(--white)" },
  ];

  if (loading) return <div className="ibbi-admin-loading">Carregando...</div>;

  return (
    <>
      <div className="ibbi-admin-metrics">
        {metrics.map((m) => (
          <div key={m.label} className="ibbi-admin-metric-card">
            <span className="ibbi-admin-metric-label">{m.label}</span>
            <span className="ibbi-admin-metric-value" style={{ color: m.color }}>{m.value}</span>
          </div>
        ))}
      </div>

      <div className="ibbi-admin-chart-card">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={[{ dia: "Total", vendas: sold }, { dia: "Pendentes", vendas: pending }, { dia: "Check-ins", vendas: checkedIn }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="dia" stroke="var(--muted)" fontSize={12} />
            <YAxis stroke="var(--muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: "#0D171B", border: "1px solid var(--border)", borderRadius: 8, color: "#fff" }} />
            <Bar dataKey="vendas" fill="var(--gold)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <OrdersAdmin />
    </>
  );
}

function OrdersAdmin() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    const data = await listAllOrders();
    setOrders(data as OrderRow[]);
    setLoading(false);
  }

  async function handleApprove(orderId: string) {
    setActionLoading(orderId);
    try { await approveOrder(orderId); await loadOrders(); }
    catch (err: any) { alert("Erro ao aprovar: " + err.message); }
    setActionLoading(null);
  }

  async function handleReject(orderId: string) {
    if (!confirm("Tem certeza que deseja rejeitar este pedido?")) return;
    setActionLoading(orderId);
    try { await rejectOrder(orderId); await loadOrders(); }
    catch (err: any) { alert("Erro ao rejeitar: " + err.message); }
    setActionLoading(null);
  }

  function handleSendEmail(orderId: string) { sendTicketEmail(orderId); }

  if (loading) return <div className="ibbi-admin-loading">Carregando pedidos...</div>;

  return (
    <div className="ibbi-admin-table-wrap">
      {orders.length === 0 ? (
        <div className="ibbi-admin-empty">
          <ClipboardList size={40} />
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <table className="ibbi-admin-table">
          <thead>
            <tr>
              <th>Casal</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td data-label="Casal">{order.buyer_name}</td>
                <td data-label="E-mail">{order.buyer_email}</td>
                <td data-label="Telefone">{order.buyer_phone}</td>
                <td data-label="Valor" style={{ fontWeight: 700 }}>{brl(order.total)}</td>
                <td data-label="Status"><StatusBadge status={order.payment_status} /></td>
                <td data-label="Acoes">
                  <div className="ibbi-admin-actions">
                    {order.status === "open" && (
                      <>
                        <button className="ibbi-btn ibbi-btn--primary ibbi-btn--small" disabled={actionLoading === order.id} onClick={() => handleApprove(order.id)}>
                          {actionLoading === order.id ? "..." : "Aprovar"}
                        </button>
                        <button className="ibbi-btn ibbi-btn--ghost ibbi-btn--small" disabled={actionLoading === order.id} onClick={() => handleReject(order.id)}>
                          Rejeitar
                        </button>
                      </>
                    )}
                    {order.status === "paid" && (
                      <button className="ibbi-btn ibbi-btn--ghost ibbi-btn--small" onClick={() => handleSendEmail(order.id)}>
                        <Mail size={14} /> Enviar email
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function TicketsAdmin() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAllOrders().then((data) => { setOrders(data as OrderRow[]); setLoading(false); });
  }, []);

  const allTickets = orders.flatMap((o) =>
    o.tickets.map((t) => ({ ...t, buyer_name: o.buyer_name, buyer_email: o.buyer_email }))
  );

  if (loading) return <div className="ibbi-admin-loading">Carregando...</div>;

  if (allTickets.length === 0) {
    return (
      <div className="ibbi-admin-empty">
        <Ticket size={40} />
        <p>Nenhum ingresso emitido.</p>
      </div>
    );
  }

  return (
    <div className="ibbi-admin-tickets-grid">
      {allTickets.map((ticket) => (
        <div key={ticket.id} className="ibbi-admin-ticket-card">
          <div className="ibbi-admin-ticket-card-header">
            <StatusBadge status={ticket.status} />
          </div>
          <h3 className="ibbi-admin-ticket-card-code">{ticket.code}</h3>
          <p className="ibbi-admin-ticket-card-name">{ticket.buyer_name}</p>
          <p className="ibbi-admin-ticket-card-email">{ticket.buyer_email}</p>
          <a className="ibbi-btn ibbi-btn--primary ibbi-btn--small ibbi-btn--full" href={`/ingresso/${ticket.token}`}>
            Ver ingresso
          </a>
        </div>
      ))}
    </div>
  );
}

function CheckinAdmin() {
  return (
    <div className="ibbi-admin-checkin">
      <QrCode size={64} style={{ color: "var(--gold)", opacity: 0.4 }} />
      <h2>Abrir leitor de QR Code</h2>
      <p>Escaneie o QR Code do ingresso na porta da igreja para validar a entrada.</p>
      <a className="ibbi-btn ibbi-btn--primary" href="/checkin">
        <Camera size={18} /> ABRIR LEITOR
      </a>
    </div>
  );
}
