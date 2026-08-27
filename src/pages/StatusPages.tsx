import { BadgeCheck, CircleX, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const CONFIRM_COPY = {
  loading: {
    title: "Verificando seu e-mail...",
    text: "Aguarde um instante enquanto confirmamos sua conta.",
  },
  ok: {
    title: "E-mail verificado com sucesso!",
    text: "Sua conta foi confirmada. Agora você já pode fazer login e acessar todos os recursos.",
  },
  error: {
    title: "Não foi possível confirmar",
    text: "O link de confirmação é inválido ou expirou. Tente solicitar um novo link de confirmação.",
  },
} as const;

export function EmailConfirmed() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const params = new URLSearchParams(window.location.search);
  const requestedRedirect = params.get("redirect");
  const safeRedirect = requestedRedirect && requestedRedirect.startsWith("/") && !requestedRedirect.startsWith("//")
    ? requestedRedirect
    : null;
  const redirectQuery = safeRedirect ? `?redirect=${encodeURIComponent(safeRedirect)}` : "";
  const copy = CONFIRM_COPY[status];

  useEffect(() => {
    if (!supabase) { setStatus("error"); return; }

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const code = params.get("code");
    const token = hashParams.get("access_token") || params.get("token");
    const type = params.get("type") || hashParams.get("type");

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        setStatus(error ? "error" : "ok");
      });
    } else if (token && type) {
      supabase.auth.verifyOtp({ token, type: type as "signup" | "magiclink" | "recovery", email: "" }).then(({ error }) => {
        setStatus(error ? "error" : "ok");
      });
    } else {
      setStatus("error");
    }
  }, []);

  return (
    <main>
      <section
        className="ibbi-confirm"
        style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}
      >
        <div className="ibbi-confirm-card">
          <div className={`ibbi-confirm-badge ibbi-confirm-badge--${status}`}>
            {status === "loading" ? (
              <LoaderCircle size={56} className="ibbi-confirm-spin" />
            ) : status === "ok" ? (
              <BadgeCheck size={56} />
            ) : (
              <CircleX size={56} />
            )}
          </div>

          <h1 className="ibbi-confirm-title">{copy.title}</h1>
          <p className="ibbi-confirm-text">{copy.text}</p>

          {status !== "loading" && (
            <div className="ibbi-confirm-actions">
              <a href={`/login${redirectQuery}`} className="ibbi-btn ibbi-btn--primary ibbi-confirm-btn">
                {status === "ok" ? "FAZER LOGIN" : "IR PARA O LOGIN"}
              </a>
              <a href="/" className="ibbi-confirm-link">
                Voltar para a página inicial
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
