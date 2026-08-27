import { demoOrders } from "../data/demo";
import type { Order } from "../types";

const ORDERS_KEY = "casaibbi_orders";

export function listLocalOrders(): Order[] {
  const saved = localStorage.getItem(ORDERS_KEY);
  if (!saved) return demoOrders;
  try {
    return [...demoOrders, ...(JSON.parse(saved) as Order[])];
  } catch {
    return demoOrders;
  }
}

export function saveLocalOrder(order: Order) {
  const saved = localStorage.getItem(ORDERS_KEY);
  const orders = saved ? (JSON.parse(saved) as Order[]) : [];
  localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders]));
}

export function markOrderPaid(orderId: string) {
  const saved = localStorage.getItem(ORDERS_KEY);
  if (!saved) return;
  const orders = (JSON.parse(saved) as Order[]).map((order) =>
    order.id === orderId ? { ...order, paymentStatus: "approved" as const, status: "paid" as const } : order
  );
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
