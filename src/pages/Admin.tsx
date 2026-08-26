import { CheckSquare, Copy, FileDown, LogOut, Pencil, RotateCcw, Settings, Ticket } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatusBadge } from "../components/ui/StatusBadge";
import { demoEvents, demoTickets } from "../data/demo";
import { brl } from "../lib/format";
import { testClientEmail } from "../lib/localUsers";
import { listLocalOrders } from "../services/localOrders";
import { useAuth, logoutUser } from "../lib/auth";

export function Admin({ page = "dashboard" }: { page?: string }) {
  const { user } = useAuth();
  const normalizedPage = page.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return <main className="admin-shell">
    <aside style={{ background: "#050505", color: "white", padding: 22, borderRight: "1px solid var(--border)" }}>
      <div style={{ width: 210, height: 64, display: "flex", alignItems: "center" }}>
        <img src="/logo-casa-ibbi.svg" alt="Casa IBBI" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <p className="muted" style={{ fontSize: 13 }}>{user?.email}</p>
      {["Dashboard", "Eventos", "Pedidos", "Ingressos", "Participantes", "Check-in", "Cupons", "Relatórios", "Configurações"].map((item) => (
        <a key={item} href={`/admin/${item.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`} style={{ display: "flex", gap: 10, padding: "11px 0", opacity: .9 }}>
          <Ticket size={17} />{item}
        </a>
      ))}
      <button className="btn btn-ghost" onClick={logoutUser} style={{ width: "100%", marginTop: 18 }}><LogOut size={17} />Sair</button>
    </aside>
    <section style={{ padding: 26 }}>
      {normalizedPage.includes("eventos/editar") ? <EventForm /> :
        normalizedPage.includes("eventos") ? <EventsAdmin /> :
        normalizedPage.includes("pedidos") ? <OrdersAdmin /> :
        normalizedPage.includes("ingressos") ? <TicketsAdmin /> :
        normalizedPage.includes("participantes") ? <Participants /> :
        normalizedPage.includes("check-in") || normalizedPage.includes("checkin") ? <CheckinAdmin /> :
        normalizedPage.includes("cupons") ? <CouponsAdmin /> :
        normalizedPage.includes("relatorios") ? <ReportsAdmin /> :
        normalizedPage.includes("configuracoes") ? <SettingsAdmin /> :
        <Dashboard />}
    </section>
  </main>;
}

function getMetrics() {
  const paidOrders = listLocalOrders().filter((order) => order.paymentStatus === "approved");
  const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const sold = paidOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  return { paidOrders, revenue, sold };
}

function Dashboard() {
  const { paidOrders, revenue, sold } = getMetrics();
  const metrics = [["Receita total", brl(revenue)], ["Ingressos vendidos", String(sold)], ["Pedidos pagos", String(paidOrders.length)], ["Ticket médio", brl(paidOrders.length ? revenue / paidOrders.length : 0)], ["Conversão", "0%"], ["Check-ins", "0"]];
  return <>
    <h1>Dashboard</h1>
    <div className="grid-auto">{metrics.map(([label, value]) => <div className="card" key={label} style={{ padding: 18 }}><p className="muted">{label}</p><h2>{value}</h2></div>)}</div>
    <div className="card" style={{ marginTop: 20, padding: 18, height: 310 }}>
      <ResponsiveContainer>
        <BarChart data={[{ dia: "Hoje", vendas: sold }, { dia: "Ontem", vendas: 0 }, { dia: "Semana", vendas: sold }, { dia: "Mês", vendas: sold }]}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="dia" stroke="var(--muted)" />
          <YAxis stroke="var(--muted)" />
          <Tooltip />
          <Bar dataKey="vendas" fill="#ffffff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <OrdersAdmin />
  </>;
}

function EventsAdmin() {
  return <>
    <h1>Evento cadastrado</h1>
    <div className="grid-auto" style={{ marginTop: 18 }}>
      {demoEvents.map((event) => <div className="card" key={event.id} style={{ padding: 18, textAlign: "center" }}>
        <h3>{event.title}</h3>
        <p>{event.city} - {event.state}</p>
        <StatusBadge status={event.status} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16, justifyContent: "center" }}>
          <a className="btn btn-primary" href="/admin/eventos/editar"><Pencil size={18} />Editar evento</a>
          <a className="btn btn-ghost" href={`/evento/${event.slug}`}>Visualizar</a>
          <button className="btn btn-ghost" onClick={() => navigator.clipboard.writeText(`${location.origin}/evento/${event.slug}`)}><Copy size={18} />Copiar link</button>
          <a className="btn btn-ghost" href="/admin/participantes">Participantes</a>
          <a className="btn btn-ghost" href="/admin/relatorios">Relatório</a>
        </div>
      </div>)}
    </div>
  </>;
}

function OrdersAdmin() {
  const orders = listLocalOrders();
  return <>
    <h2>Faturamento e últimas vendas</h2>
    <div className="card" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
        <thead><tr><th>Cliente</th><th>Pedido</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>{orders.map((order) => <tr key={order.id}>
          <td style={{ padding: 14 }}>{order.buyerName}</td>
          <td>{order.id}</td>
          <td>{brl(order.total)}</td>
          <td><StatusBadge status={order.paymentStatus} /></td>
          <td><button className="btn btn-ghost" onClick={() => alert(`Detalhes do pedido ${order.id}\nCliente: ${order.buyerEmail}\nTotal: ${brl(order.total)}`)}>Ver detalhes</button></td>
        </tr>)}</tbody>
      </table>
    </div>
  </>;
}

function TicketsAdmin() {
  return <><h1>Ingressos</h1><div className="grid-auto">{demoTickets.map((ticket) => <div className="card" key={ticket.token} style={{ padding: 18, textAlign: "center" }}><h3>{ticket.code}</h3><p>{ticket.attendeeName}</p><StatusBadge status={ticket.status} /><div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}><a className="btn btn-primary" href={`/ingresso/${ticket.token}`}>Ver ingresso</a><button className="btn btn-ghost" onClick={() => alert("Ingresso reenviado para o e-mail do comprador.")}><RotateCcw size={18} />Reenviar</button></div></div>)}</div></>;
}

function Participants() {
  const exportCsv = () => {
    const csv = `Nome,E-mail,CPF,Ingresso,Check-in\nVictor Dsouza Jr,${testClientEmail},***.123.***-09,CASAL,Pendente`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "participantes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return <><h1>Participantes</h1><button className="btn btn-ghost" onClick={exportCsv}><FileDown size={18} />Exportar CSV</button><div className="card" style={{ padding: 18, marginTop: 16, textAlign: "center" }}><p>Victor Dsouza Jr | {testClientEmail} | ***.123.***-09 | CASAL | Check-in pendente</p></div></>;
}

function CheckinAdmin() {
  return <><h1>Check-in</h1><p className="muted" style={{ textAlign: "center" }}>Abra o leitor de QR Code para validar entradas.</p><div style={{ display: "flex", justifyContent: "center" }}><a className="btn btn-primary" href="/checkin">Abrir leitor</a></div></>;
}

function CouponsAdmin() {
  return <><h1>Cupons</h1><div className="card" style={{ padding: 18, display: "grid", gap: 12 }}><input className="input" placeholder="Código do cupom. Ex: CASAL20" /><select className="input"><option>Percentual</option><option>Valor fixo</option></select><input className="input" type="number" placeholder="Desconto" /><button className="btn btn-primary" onClick={() => alert("Cupom criado no protótipo.")}>Criar cupom</button></div></>;
}

function ReportsAdmin() {
  const { revenue, sold } = getMetrics();
  return <><h1>Relatórios</h1><div className="grid-auto"><div className="card" style={{ padding: 18 }}><h2>{brl(revenue)}</h2><p className="muted">Receita por evento</p></div><div className="card" style={{ padding: 18 }}><h2>{sold}</h2><p className="muted">Ingressos por lote</p></div></div><button className="btn btn-ghost" style={{ marginTop: 18 }} onClick={() => window.print()}><FileDown size={18} />Baixar relatório</button></>;
}

function SettingsAdmin() {
  const { user } = useAuth();
  return <><h1>Configurações</h1><div className="card" style={{ padding: 18, display: "grid", gap: 12 }}><label>Nome da plataforma<input className="input" defaultValue="Casa IBBI" /></label><label>E-mail do administrador<input className="input" defaultValue={user?.email ?? ""} /></label><button className="btn btn-primary" onClick={() => alert("Configurações salvas no protótipo.")}><Settings size={18} />Salvar configurações</button></div></>;
}

function EventForm() {
  const event = demoEvents[0];
  const batch = event.batches[0];
  return <>
    <h1>Editar evento</h1>
    <div className="card" style={{ padding: 22, display: "grid", gap: 18 }}>
      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>Informações básicas</h2>
        <input className="input" placeholder="Nome do evento" defaultValue={event.title} />
        <select className="input" defaultValue={event.category}><option>Religião</option><option>Congressos</option><option>Workshops</option><option>Festas e Shows</option></select>
        <textarea className="input" placeholder="Descrição do evento" rows={5} defaultValue={event.description} />
      </section>

      <section className="grid-auto">
        <label>Data e hora de início<input className="input" type="datetime-local" defaultValue="2026-09-19T19:30" /></label>
        <label>Data e hora de fim<input className="input" type="datetime-local" defaultValue="2026-09-19T22:30" /></label>
        <label>Nome do local<input className="input" placeholder="Ex.: IGREJA BATISTA DO BAIRRO INDUSTRIAL" defaultValue={event.venueName} /></label>
        <label>Cidade<input className="input" placeholder="Ex.: Belo Horizonte" defaultValue={event.city} /></label>
      </section>

      <section style={{ display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>Ingressos</h2>
        <div className="card" style={{ padding: 16, boxShadow: "none", background: "#050505" }}>
          <div className="grid-auto">
            <label>Tipo do ingresso<input className="input" placeholder="Ex.: CASAL" defaultValue={batch.ticketTypeName} /></label>
            <label>Nome do lote<input className="input" placeholder="Ex.: Lote inicial" defaultValue={batch.name} /></label>
            <label>Descrição do lote<input className="input" placeholder="Ex.: Ingresso para um casal" defaultValue={batch.description} /></label>
            <label>Preço<input className="input" type="number" min="0" step="0.01" placeholder="Ex.: 100,00" defaultValue={batch.price} /></label>
            <label>Quantidade disponível<input className="input" type="number" min="0" placeholder="Ex.: 100" defaultValue={batch.quantity} /></label>
            <label>Limite por pedido<input className="input" type="number" min="1" placeholder="Ex.: 2" defaultValue={batch.maxPerOrder} /></label>
            <label>Início das vendas<input className="input" type="datetime-local" defaultValue="2026-08-11T09:00" /></label>
            <label>Encerramento das vendas<input className="input" type="datetime-local" defaultValue="2026-09-19T18:00" /></label>
            <label>Status do lote<select className="input" defaultValue="Disponível"><option>Rascunho</option><option>Agendado</option><option>Disponível</option><option>Esgotado</option><option>Encerrado</option></select></label>
          </div>
        </div>
      </section>

      <button className="btn btn-primary" onClick={() => alert("Alterações salvas no protótipo. Com Supabase ativo, esta ação atualizará o evento no banco.")}><CheckSquare size={18} />Salvar alterações</button>
    </div>
  </>;
}
