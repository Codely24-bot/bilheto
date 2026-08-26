import { demoEvents } from "../data/demo";
import { saveLocalOrder } from "./localOrders";
import type { CartLine, Order } from "../types";

export function calculateOrder(eventId: string, items: CartLine[], coupon?: string) {
  const event = demoEvents.find((item) => item.id === eventId) ?? demoEvents[0];
  const subtotal = items.reduce((sum, line) => {
    const batch = event.batches.find((item) => item.id === line.batchId);
    return sum + (batch?.price ?? 0) * line.quantity;
  }, 0);
  const discount = coupon?.toUpperCase() === "VIP20" ? subtotal * 0.2 : 0;
  const fee = Math.max(0, (subtotal - discount) * 0.1);
  return { subtotal, discount, fee, total: subtotal - discount + fee };
}

export async function createLocalOrder(eventId: string, items: CartLine[], buyer: Omit<Order, "id" | "eventId" | "items" | "subtotal" | "discount" | "fee" | "total" | "paymentStatus" | "status">, coupon?: string): Promise<Order> {
  const totals = calculateOrder(eventId, items, coupon);
  const order: Order = {
    id: `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    eventId,
    items,
    ...buyer,
    ...totals,
    paymentStatus: "pending",
    status: "open"
  };
  saveLocalOrder(order);
  return order;
}

export async function createPaymentPreference(orderId: string) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`;
  const session = localStorage.getItem("sb-access-token");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(session ? { Authorization: `Bearer ${session}` } : {}) },
    body: JSON.stringify({ orderId })
  });
  if (!res.ok) throw new Error("Não foi possível iniciar o pagamento.");
  return res.json() as Promise<{ init_point: string; preference_id: string }>;
}
