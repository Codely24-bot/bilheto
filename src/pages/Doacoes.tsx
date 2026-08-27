import { Copy, Check, QrCode } from "lucide-react";
import { useState } from "react";

const PIX_KEY = "17509738000181";

export function Doacoes() {
  const [copied, setCopied] = useState(false);

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="ibbi-doacoes">
      <section className="ibbi-event-hero" style={{ minHeight: 400, maxHeight: 400 }}>
        <div className="ibbi-container">
          <div className="ibbi-event-hero-inner">
            <div className="ibbi-event-hero-info">
              <a href="/" className="ibbi-event-back">← Voltar ao site</a>
              <div className="ibbi-doacoes-hero-titles">
                <span className="section-label">Doações</span>
                <h1>Contribua com a obra de Deus</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ibbi-event-body" style={{ paddingTop: 20 }}>
        <div className="ibbi-container">
          <div className="ibbi-doacoes-row">

            <div className="ibbi-doacoes-aside-card">
              <div className="ibbi-doacoes-aside-icon">
                <QrCode size={40} />
              </div>
              <h3>PIX para doação</h3>
              <p className="ibbi-doacoes-aside-desc">Escaneie o QR Code abaixo ou copie a chave PIX e faça a transferência pelo aplicativo do seu banco.</p>

              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <img
                  src="/PIX%20QR%20CODE.png"
                  alt="QR Code PIX"
                  style={{
                    display: "block",
                    margin: "0 auto",
                    width: "100%",
                    maxWidth: 240,
                    borderRadius: 12,
                    border: "2px solid var(--gold, #D6A13A)",
                  }}
                />
              </div>

              <div className="ibbi-doacoes-pix-box">
                <span className="ibbi-doacoes-pix-key">{PIX_KEY}</span>
                <button className="ibbi-doacoes-pix-copy" onClick={copyPix}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              {copied && <span className="ibbi-doacoes-copied">Copiado!</span>}

              <div className="ibbi-doacoes-aside-info">
                <p><strong>Nome:</strong> Igreja Batista do Bairro Industrial</p>
                <p><strong>CNPJ:</strong> 17.509.738/0001-81</p>
              </div>
            </div>

            <div className="ibbi-doacoes-aside-card ibbi-doacoes-aside-card--verse">
              <p className="ibbi-doacoes-verse">
                "Cada um contribua como propôs em seu coração, não com tristeza ou por obrigação; porque Deus ama quem dá com alegria. E Deus é poderoso para encher-vos de toda a graça, para que, tendo sempre em tudo o que é necessário, abundeis em toda boa obra, conforme está escrito: Espalhou, deu aos pobres; a sua justiça permanece para sempre."
              </p>
              <span className="ibbi-doacoes-verse-ref">2 Coríntios 9:7-9 — King James</span>
            </div>

          </div>

          <div className="ibbi-doacoes-projects">
            <span className="section-label">Nossos projetos</span>
            <h2 className="section-title">Onde a sua doação faz a diferença</h2>
            <div className="ibbi-doacoes-projects-grid">
              <div className="ibbi-doacoes-project-card">
                <div className="ibbi-doacoes-project-img" />
              </div>
              <div className="ibbi-doacoes-project-card">
                <div className="ibbi-doacoes-project-img" />
              </div>
              <div className="ibbi-doacoes-project-card">
                <div className="ibbi-doacoes-project-img" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
