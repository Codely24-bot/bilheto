import { useState, type FormEvent } from "react";
import { Send, Phone, Mail, MessageCircle } from "lucide-react";
import { siteConfig } from "../../data/siteConfig";

export function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", phone: "", email: "", subject: "", message: "" });
  };

  const whatsappUrl = siteConfig.contact.whatsapp
    ? `https://wa.me/55${siteConfig.contact.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <section className="ibbi-section ibbi-services-bg" id="contato">
      <div className="ibbi-container">
        <span className="section-label">Contato</span>
        <h2 className="section-title">
          Fale conosco.
        </h2>

        <div className="ibbi-contact-grid" style={{ marginTop: 36 }}>
          <form onSubmit={handleSubmit}>
            <div className="ibbi-form-group">
              <label>Nome *</label>
              <input className="ibbi-form-input" placeholder="Seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="ibbi-form-group">
              <label>Telefone / WhatsApp</label>
              <input className="ibbi-form-input" placeholder="(31) 99999-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="ibbi-form-group">
              <label>E-mail</label>
              <input className="ibbi-form-input" type="email" placeholder="voce@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="ibbi-form-group">
              <label>Assunto</label>
              <input className="ibbi-form-input" placeholder="Como podemos ajudar?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="ibbi-form-group">
              <label>Mensagem *</label>
              <textarea className="ibbi-form-input ibbi-form-textarea" placeholder="Escreva sua mensagem..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>

            {error && <p style={{ color: "var(--danger)", fontSize: 14, marginBottom: 12 }}>Preencha nome e mensagem.</p>}
            {sent && <p style={{ color: "var(--success)", fontSize: 14, marginBottom: 12 }}>Mensagem enviada com sucesso!</p>}

            <button className="ibbi-btn ibbi-btn--primary ibbi-btn--full" type="submit">
              <Send size={16} /> ENVIAR MENSAGEM
            </button>
          </form>

          <div>
            <div className="ibbi-contact-channels">
              {siteConfig.contact.phone && (
                <a href={`tel:${siteConfig.contact.phone.replace(/\D/g, "")}`} className="ibbi-contact-channel">
                  <div className="ibbi-contact-channel-icon"><Phone size={18} /></div>
                  <div>
                    <h4>Telefone</h4>
                    <p>{siteConfig.contact.phone}</p>
                  </div>
                </a>
              )}

              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="ibbi-contact-channel">
                  <div className="ibbi-contact-channel-icon"><MessageCircle size={18} /></div>
                  <div>
                    <h4>WhatsApp</h4>
                    <p>{siteConfig.contact.whatsapp}</p>
                  </div>
                </a>
              )}

              {siteConfig.contact.email && (
                <a href={`mailto:${siteConfig.contact.email}`} className="ibbi-contact-channel">
                  <div className="ibbi-contact-channel-icon"><Mail size={18} /></div>
                  <div>
                    <h4>E-mail</h4>
                    <p>{siteConfig.contact.email}</p>
                  </div>
                </a>
              )}

              {!siteConfig.contact.phone && !siteConfig.contact.whatsapp && !siteConfig.contact.email && (
                <p style={{ color: "var(--gray)", fontSize: 14 }}>
                  Informações de contato serão adicionadas em breve.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
