import { supabase } from "../lib/supabase";

type CreateOrderInput = {
  userId: string;
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  buyerCpf: string;
  buyerPhone: string;
  items: { batchId: string; quantity: number }[];
  total: number;
};

export async function createOrder(input: CreateOrderInput) {
  if (!supabase) throw new Error("Banco de dados não conectado.");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: input.userId,
      event_id: input.eventId,
      buyer_name: input.buyerName,
      buyer_email: input.buyerEmail,
      buyer_cpf: input.buyerCpf,
      buyer_phone: input.buyerPhone,
      subtotal: input.total,
      discount: 0,
      fee: 0,
      total: input.total,
      payment_status: "pending",
      status: "open",
    })
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    ticket_batch_id: item.batchId,
    quantity: item.quantity,
    unit_price: input.total / item.quantity,
    total: input.total,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw new Error(itemsError.message);

  const { error: attendeeError } = await supabase.from("attendees").insert({
    order_id: order.id,
    name: input.buyerName,
    email: input.buyerEmail,
    cpf: input.buyerCpf,
  });
  if (attendeeError) throw new Error(attendeeError.message);

  return order;
}

export async function getUserOrders(userId: string) {
  if (!supabase) return [];

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !orders) {
    console.error("Erro ao carregar pedidos do usuario:", error);
    return [];
  }

  if (orders.length === 0) return [];

  const orderIds = orders.map((order) => order.id);
  const eventIds = Array.from(new Set(orders.map((order) => order.event_id).filter(Boolean)));

  const [{ data: orderItems, error: itemsError }, { data: tickets, error: ticketsError }, { data: events, error: eventsError }] = await Promise.all([
    supabase
      .from("order_items")
      .select("*, ticket_batches (*, ticket_types (*))")
      .in("order_id", orderIds),
    supabase
      .from("tickets")
      .select("*")
      .in("order_id", orderIds),
    supabase
      .from("events")
      .select("id, title, start_date, venue_name, address, city, state")
      .in("id", eventIds),
  ]);

  if (itemsError) console.error("Erro ao carregar itens dos pedidos do usuario:", itemsError);
  if (ticketsError) console.error("Erro ao carregar ingressos do usuario:", ticketsError);
  if (eventsError) console.error("Erro ao carregar eventos dos pedidos do usuario:", eventsError);

  return orders.map((order) => ({
    ...order,
    order_items: (orderItems ?? []).filter((item) => item.order_id === order.id),
    tickets: (tickets ?? []).filter((ticket) => ticket.order_id === order.id),
    events: (events ?? []).find((event) => event.id === order.event_id) ?? null,
  }));
}

export async function getOrder(orderId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*, ticket_batches (*, ticket_types (*))),
      tickets (*)
    `)
    .eq("id", orderId)
    .single();

  if (error) return null;
  return data;
}

export async function listAllOrders() {
  if (!supabase) return [];

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (ordersError || !orders) {
    console.error("Erro ao carregar pedidos do admin:", ordersError);
    return [];
  }

  if (orders.length === 0) return [];

  const orderIds = orders.map((order) => order.id);

  const [{ data: orderItems, error: itemsError }, { data: tickets, error: ticketsError }] = await Promise.all([
    supabase
      .from("order_items")
      .select("*, ticket_batches (*, ticket_types (*))")
      .in("order_id", orderIds),
    supabase
      .from("tickets")
      .select("*")
      .in("order_id", orderIds),
  ]);

  if (itemsError) console.error("Erro ao carregar itens dos pedidos:", itemsError);
  if (ticketsError) console.error("Erro ao carregar ingressos dos pedidos:", ticketsError);

  return orders.map((order) => ({
    ...order,
    order_items: (orderItems ?? []).filter((item) => item.order_id === order.id),
    tickets: (tickets ?? []).filter((ticket) => ticket.order_id === order.id),
  }));
}

export async function approveOrder(orderId: string) {
  if (!supabase) throw new Error("Banco de dados não conectado.");

  const { error } = await supabase.rpc("confirm_order_paid", { p_order_id: orderId });
  if (error) throw new Error(error.message);
}

export async function rejectOrder(orderId: string) {
  if (!supabase) throw new Error("Banco de dados não conectado.");

  const { error } = await supabase
    .from("orders")
    .update({ payment_status: "rejected", status: "cancelled" })
    .eq("id", orderId);

  if (error) throw new Error(error.message);
}

export async function performCheckin(token: string) {
  if (!supabase) throw new Error("Banco de dados não conectado.");

  const { data, error } = await supabase.rpc("perform_checkin", {
    ticket_token: token,
    device: { userAgent: navigator.userAgent },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function sendTicketEmail(orderId: string) {
  if (!supabase) throw new Error("Banco de dados não conectado.");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("buyer_email, buyer_name")
    .eq("id", orderId)
    .single();

  if (orderError || !order) throw new Error("Pedido não encontrado.");

  const { data: tickets } = await supabase
    .from("tickets")
    .select("code, token")
    .eq("order_id", orderId);

  if (!tickets || tickets.length === 0) throw new Error("Nenhum ingresso encontrado.");

  const ticketLinks = tickets
    .map((t) => `  - ${t.code}: ${window.location.origin}/ingresso/${t.token}`)
    .join("\n");

  const subject = encodeURIComponent(`Seu ingresso - Casa IBBI`);
  const body = encodeURIComponent(
    `Olá ${order.buyer_name}!\n\nSeu pagamento foi confirmado!\n\nSeus ingressos:\n${ticketLinks}\n\nApresente o QR Code na entrada do evento.\n\nCasa IBBI`
  );

  window.open(`mailto:${order.buyer_email}?subject=${subject}&body=${body}`, "_blank");
}
