import { Inbox } from "lucide-react";

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="card" style={{ padding: 28, textAlign: "center" }}><Inbox style={{ margin: "0 auto 12px" }} /><h3>{title}</h3><p className="muted">{text}</p></div>;
}
