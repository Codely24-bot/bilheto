import { demoEvents } from "../data/demo";
import type { CartLine } from "../types";

export function calculateOrder(eventId: string, items: CartLine[], coupon?: string) {
  const event = demoEvents.find((item) => item.id === eventId) ?? demoEvents[0];
  const subtotal = items.reduce((sum, line) => {
    const batch = event.batches.find((item) => item.id === line.batchId);
    return sum + (batch?.price ?? 0) * line.quantity;
  }, 0);
  const discount = coupon?.toUpperCase() === "VIP20" ? subtotal * 0.2 : 0;
  const fee = 0;
  return { subtotal, discount, fee, total: subtotal - discount + fee };
}
