import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

export function JoinUs() {
  const whatsappUrl = siteConfig.contact.whatsapp
    ? `https://wa.me/55${siteConfig.contact.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <section className="ibbi-join" id="facaparte">
      <div className="ibbi-join-bg">
        <img src="/hero-bg.jpg" alt="" loading="lazy" />
      </div>
      <div className="ibbi-join-overlay" />
      <div className="ibbi-container ibbi-join-content">
        <h2>
          Você faz<br />
          parte desta<br />
          família.
        </h2>
        <p>Existe um lugar para você aqui.</p>
        <div className="ibbi-join-actions">
          <a href="#contato" className="ibbi-btn ibbi-btn--primary">
            QUERO CONHECER A IBBI <ArrowRight size={18} />
          </a>
          {whatsappUrl ? (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="ibbi-btn ibbi-btn--outline">
              <MessageCircle size={18} /> FALAR CONOSCO
            </a>
          ) : (
            <a href="#contato" className="ibbi-btn ibbi-btn--outline">
              <MessageCircle size={18} /> FALAR CONOSCO
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
