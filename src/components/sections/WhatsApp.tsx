import { MessageCircle } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

export function WhatsAppButton() {
  const whatsapp = siteConfig.contact.whatsapp;
  if (!whatsapp) return null;

  const url = `https://wa.me/55${whatsapp.replace(/\D/g, "")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="ibbi-whatsapp"
      aria-label="Fale conosco no WhatsApp"
      title="Fale conosco"
    >
      <MessageCircle size={26} />
    </a>
  );
}
