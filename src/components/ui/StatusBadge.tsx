import { CheckCircle2, Clock, XCircle } from "lucide-react";

type Props = { status: string };

const STATUS_LABELS: Record<string, string> = {
  approved: "Aprovado",
  paid: "Pago",
  valid: "Válido",
  pending: "Pendente",
  open: "Aberto",
  rejected: "Rejeitado",
  cancelled: "Cancelado",
  used: "Utilizado",
  invalid: "Inválido",
  expired: "Expirado",
};

export function StatusBadge({ status }: Props) {
  const normalized = status.toLowerCase();
  const kind = normalized.includes("approved") || normalized.includes("paid") || normalized.includes("valid") ? "ok" : normalized.includes("pending") ? "warn" : "bad";
  const Icon = kind === "ok" ? CheckCircle2 : kind === "warn" ? Clock : XCircle;
  const color = kind === "ok" ? "var(--success)" : kind === "warn" ? "var(--warning)" : "var(--danger)";
  const label = STATUS_LABELS[normalized] ?? status;
  return <span className="badge" style={{ color, background: `${color}14`, display: "inline-flex", alignItems: "center", gap: 6 }}><Icon size={14} />{label}</span>;
}
