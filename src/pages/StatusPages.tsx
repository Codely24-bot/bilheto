import { Clock, MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function EmailConfirmed() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Confirmando seu e-mail...");

  useEffect(() => {
    if (!supabase) { setStatus("error"); setMessage("Supabase não configurado."); return; }

    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const code = params.get("code");
    const token = hashParams.get("access_token") || params.get("token");
    const type = params.get("type") || hashParams.get("type");

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) { setStatus("error"); setMessage(error.message); }
        else { setStatus("ok"); setMessage("E-mail confirmado com sucesso!"); }
      });
    } else if (token && type) {
      supabase.auth.verifyOtp({ token, type: type as "signup" | "magiclink" | "recovery", email: "" }).then(({ error }) => {
        if (error) { setStatus("error"); setMessage(error.message); }
        else { setStatus("ok"); setMessage("E-mail confirmado com sucesso!"); }
      });
    } else {
      setStatus("error");
      setMessage("Link de confirmação inválido ou expirado.");
    }
  }, []);

  return (
    <main>
      <section className="ibbi-event-hero" style={{ minHeight: 260, maxHeight: 260 }}>
        <div className="ibbi-container">
          <div className="ibbi-event-hero-inner">
            <div className="ibbi-event-hero-info">
              <span className="section-label">Confirmação de e-mail</span>
              <h1>{status === "ok" ? "E-mail confirmado!" : status === "error" ? "Erro na confirmação" : "Confirmando..."}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ibbi-section" style={{ padding: "60px 0 100px" }}>
        <div className="ibbi-container" style={{ maxWidth: 600 }}>
          <div className="ibbi-checkout-success-card">
            <div className={`ibbi-checkout-success-icon ${status === "error" ? "ibbi-checkout-success-icon--pending" : ""}`}>
              {status === "loading" ? <Clock size={64} /> : <MailCheck size={64} />}
            </div>
            <h2>{message}</h2>

            <div className="ibbi-checkout-success-divider" />

            <a href="/login" className="ibbi-btn ibbi-btn--primary ibbi-btn--full">
              FAZER LOGIN
            </a>

            <a href="/" className="ibbi-checkout-success-link">
              Voltar para a página inicial
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
