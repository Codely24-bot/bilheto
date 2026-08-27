import { ArrowLeft, BadgeCheck, CircleX, Eye, EyeOff, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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
    let cancelled = false;

    const onSession = (session: any) => {
      if (cancelled) return;
      if (session) setStatus("ok");
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") onSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session) { setStatus("ok"); return; }

      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const token = params.get("token_hash") || hashParams.get("access_token") || params.get("token");
      const type = params.get("type") || hashParams.get("type");

      const process = async () => {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (error) {
            const { data } = await supabase.auth.getSession();
            setStatus(data.session ? "ok" : "error");
          } else {
            setStatus("ok");
          }
        } else if (token && (type === "signup" || type === "magiclink" || type === "recovery")) {
          const { error } = await supabase.auth.verifyOtp({ token, type: type as "signup" | "magiclink" | "recovery", email: "" });
          if (cancelled) return;
          setStatus(error ? "error" : "ok");
        } else {
          setTimeout(() => {
            if (cancelled) return;
            supabase.auth.getSession().then(({ data }) => {
              if (cancelled) return;
              setStatus(data.session ? "ok" : "error");
            });
          }, 1200);
        }
      };

      process();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
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

export function ResetPasswordPage() {
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "done">("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) { setStatus("error"); return; }

    let cancelled = false;
    const checkSession = (session: any) => {
      if (cancelled) return;
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const recoveryToken = new URLSearchParams(window.location.search).get("token_hash") || hashParams.get("access_token");
      const recoveryType = new URLSearchParams(window.location.search).get("type") || hashParams.get("type");
      if (session || (recoveryToken && recoveryType === "recovery")) {
        setStatus("ready");
      } else {
        setStatus("error");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        checkSession(session);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => checkSession(session));

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 6) { setError("A senha precisa ter pelo menos 6 caracteres."); return; }
    if (password !== confirm) { setError("As senhas não coincidem."); return; }

    setSubmitting(true);
    try {
      const { error: updateError } = await supabase!.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message.includes("weak") ? "A senha precisa ser mais forte." : updateError.message);
        return;
      }
      setStatus("done");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "done") {
    return (
      <main>
        <section className="ibbi-confirm" style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
          <div className="ibbi-confirm-card">
            <div className="ibbi-confirm-badge ibbi-confirm-badge--ok">
              <BadgeCheck size={56} />
            </div>
            <h1 className="ibbi-confirm-title">Senha redefinida com sucesso!</h1>
            <p className="ibbi-confirm-text">
              Sua senha foi atualizada. Agora você já pode fazer login com a nova senha.
            </p>
            <div className="ibbi-confirm-actions">
              <a href="/login" className="ibbi-btn ibbi-btn--primary ibbi-confirm-btn">FAZER LOGIN</a>
              <a href="/" className="ibbi-confirm-link">Voltar para a página inicial</a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="ibbi-confirm" style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
        <div className="ibbi-confirm-card">
          <div className={`ibbi-confirm-badge ibbi-confirm-badge--${status === "error" ? "error" : "loading"}`}>
            {status === "error" ? <CircleX size={56} /> : <LockKeyhole size={52} />}
          </div>

          {status === "loading" && (
            <>
              <h1 className="ibbi-confirm-title">Verificando seu link...</h1>
              <LoaderCircle size={24} className="ibbi-confirm-spin" style={{ marginTop: 16, color: "var(--gold)" }} />
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="ibbi-confirm-title">Link inválido ou expirado</h1>
              <p className="ibbi-confirm-text">
                O link de redefinição de senha é inválido ou expirou. Solicite um novo link de recuperação.
              </p>
              <div className="ibbi-confirm-actions">
                <a href="/esqueci-senha" className="ibbi-btn ibbi-btn--primary ibbi-confirm-btn">NOVO LINK</a>
                <a href="/login" className="ibbi-confirm-link">Voltar para o login</a>
              </div>
            </>
          )}

          {status === "ready" && (
            <>
              <h1 className="ibbi-confirm-title">Redefinir senha</h1>
              <p className="ibbi-confirm-text">
                Escolha uma nova senha para a sua conta. Use pelo menos 6 caracteres.
              </p>

              <form onSubmit={handleSubmit} style={{ marginTop: 28, textAlign: "left", display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="ibbi-checkout-field">
                  <label className="ibbi-checkout-label"><ShieldCheck size={14} /> Nova senha</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="ibbi-checkout-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingRight: 46 }}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      onClick={() => setShowPassword((v) => !v)}
                      style={{ position: "absolute", right: 12, top: 12, background: "none", border: 0, color: "var(--muted)", cursor: "pointer", padding: 0 }}
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                <div className="ibbi-checkout-field">
                  <label className="ibbi-checkout-label"><LockKeyhole size={14} /> Confirme a nova senha</label>
                  <input
                    className="ibbi-checkout-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repita a nova senha"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>

                {error && <div className="ibbi-checkout-error">{error}</div>}

                <button className="ibbi-btn ibbi-btn--primary ibbi-btn--full" disabled={submitting} style={{ marginTop: 6 }}>
                  {submitting ? "SALVANDO..." : "SALVAR NOVA SENHA"}
                </button>
              </form>

              <a href="/login" className="ibbi-confirm-link" style={{ marginTop: 20, justifyContent: "center" }}>
                <ArrowLeft size={15} /> Voltar para o login
              </a>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
