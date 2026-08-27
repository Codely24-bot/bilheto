import { brl } from "../../lib/format";

export function OrderSummary({ subtotal, discount, fee, total }: { subtotal: number; discount: number; fee: number; total: number }) {
  return (
    <div className="ibbi-order-summary">
      <div className="ibbi-order-line">
        <span>Subtotal</span>
        <strong>{brl(subtotal)}</strong>
      </div>
      {discount > 0 && (
        <div className="ibbi-order-line" style={{ color: "var(--success)" }}>
          <span>Desconto</span>
          <strong>-{brl(discount)}</strong>
        </div>
      )}
      <div className="ibbi-order-line">
        <span>Taxa de serviço</span>
        <strong>{brl(fee)}</strong>
      </div>
      <div className="ibbi-order-total">
        <span>TOTAL</span>
        <span>{brl(total)}</span>
      </div>
    </div>
  );
}
