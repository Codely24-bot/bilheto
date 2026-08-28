export const brl = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: "America/Sao_Paulo" })
    .format(new Date(iso))
    .replace(".", "")
    .toUpperCase();

export const longDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" })
    .format(new Date(iso));

const STATUS_EM_PORTUGUES: Record<string, string> = {
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
  refunded: "Reembolsado",
  chargeback: "Estornado",
};

export const statusLabel = (status: string) =>
  STATUS_EM_PORTUGUES[status.toLowerCase()] ?? status;
