import { brl } from "../../lib/format";

export function OrderSummary({ subtotal, discount, fee, total }: { subtotal: number; discount: number; fee: number; total: number }) {
  return <div style={{ display: "grid", gap: 10 }}>
    <Line label="Subtotal" value={subtotal} />
    <Line label="Taxa" value={fee} />
    <Line label="Desconto" value={-discount} />
    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 950 }}><span>TOTAL</span><span>{brl(total)}</span></div>
  </div>;
}
function Line({ label, value }: { label: string; value: number }) {
  return <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}><span>{label}</span><strong>{brl(value)}</strong></div>;
}
