import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, TicketCheck, UserRound } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { loginAdmin } from "../lib/adminAuth";
import { loginUser, registerUser, resetPassword } from "../lib/auth";
import { navigate } from "../lib/navigate";

type Mode = "login" | "signup" | "forgot";

const copy: Record<Mode, { title: string; subtitle: string; action: string }> = {
  login: { title: "Bem-vindo de volta", subtitle: "Entre para ver e gerenciar seus ingressos.", action: "ENTRAR" },
  signup: { title: "Crie sua conta", subtitle: "É rápido e grátis. Leva menos de um minuto.", action: "CRIAR CONTA" },
  forgot: { title: "Recuperar senha", subtitle: "Informe seu e-mail para receber o link de recuperação.", action: "ENVIAR LINK" }
};

export function Login({ mode = "login" }: { mode?: Mode }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });

  const texts = copy[mode];
  const params = new URLSearchParams(window.location.search);
  const requestedRedirect = params.get("redirect");
  const safeRedirect = requestedRedirect && requestedRedirect.startsWith("/") && !requestedRedirect.startsWith("//")
    ? requestedRedirect
    : null;
  const redirectQuery = safeRedirect ? `?redirect=${encodeURIComponent(safeRedirect)}` : "";
  const userRedirect = safeRedirect && !safeRedirect.startsWith("/admin") && safeRedirect !== "/checkin"
    ? safeRedirect
    : "/meus-ingressos";
  const adminRedirect = safeRedirect && (safeRedirect.startsWith("/admin") || safeRedirect === "/checkin")
    ? safeRedirect
    : "/admin/dashboard";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      if (mode === "signup") {
        if (form.password !== form.confirmPassword) return setError("As senhas não coincidem.");
        const result = await registerUser(form.name, form.email, form.password);
        if (!result.ok) return setError(result.error ?? "Não foi possível criar a conta.");
        navigate(userRedirect);
        return;
      }

      if (mode === "forgot") {
        const result = await resetPassword(form.email);
        if (!result.ok) return setError(result.error ?? "Erro ao enviar link.");
        setNotice("Se este e-mail estiver cadastrado, você receberá um link de recuperação.");
        return;
      }

      const result = await loginUser(form.email, form.password);
      if (!result.ok) return setError(result.error ?? "Não foi possível entrar.");
      if (result.isAdmin) {
        navigate(adminRedirect);
        return;
      }
      navigate(userRedirect);
    } finally {
      setSubmitting(false);
    }
  };

  const submitAdmin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await loginAdmin(adminForm.email, adminForm.password);
      if (!result.ok) return setError(result.error ?? "Erro ao entrar.");
      window.location.href = "/admin";
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <section className="ibbi-event-hero" style={{ minHeight: 260, maxHeight: 260 }}>
        <div className="ibbi-container">
          <div className="ibbi-event-hero-inner">
            <div className="ibbi-event-hero-info">
              <span className="section-label">Casa IBBI</span>
              <h1>{texts.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ibbi-section" style={{ padding: "60px 0 100px" }}>
        <div className="ibbi-container">
          <div className="ibbi-auth-grid">
            <div className="ibbi-auth-brand">
              <div className="ibbi-auth-brand-content">
                <div className="ibbi-auth-brand-logo">
                  <img src="/logo-casa-ibbi.svg" alt="Casa IBBI" />
                </div>
                <h2 style={{ fontSize: 22 }}>Área de membros IBBI</h2>
              </div>
            </div>

            <div className="ibbi-auth-form">
              {mode !== "login" && (
                <a href={`/login${redirectQuery}`} className="ibbi-event-back" style={{ marginBottom: 20 }}>
                  <ArrowLeft size={15} /> Voltar para o login
                </a>
              )}

              <p className="ibbi-auth-subtitle">{texts.subtitle}</p>

              <form onSubmit={submit} className="ibbi-auth-form-fields">
                {mode === "signup" && (
                  <div className="ibbi-checkout-field">
                    <label className="ibbi-checkout-label"><UserRound size={14} /> Nome completo</label>
                    <input
                      className="ibbi-checkout-input"
                      placeholder="Seu nome"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                )}

                <div className="ibbi-checkout-field">
                  <label className="ibbi-checkout-label"><Mail size={14} /> E-mail</label>
                  <input
                    className="ibbi-checkout-input"
                    type="email"
                    placeholder="voce@email.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                {mode !== "forgot" && (
                  <div className="ibbi-checkout-field">
                    <div className="ibbi-checkout-label" style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}><LockKeyhole size={14} /> Senha</span>
                      {mode === "login" && <a href={`/esqueci-senha${redirectQuery}`} style={{ color: "var(--gold)", fontWeight: 600, fontSize: 13 }}>Esqueci minha senha</a>}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        className="ibbi-checkout-input"
                        placeholder="Mínimo 6 caracteres"
                        type={showPassword ? "text" : "password"}
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                )}

                {mode === "signup" && (
                  <div className="ibbi-checkout-field">
                    <label className="ibbi-checkout-label"><LockKeyhole size={14} /> Confirmar senha</label>
                    <input
                      className="ibbi-checkout-input"
                      placeholder="Repita a senha"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                  </div>
                )}

                {error && <div className="ibbi-checkout-error">{error}</div>}
                {notice && <div className="ibbi-checkout-success-info">{notice}</div>}

                <button className="ibbi-btn ibbi-btn--primary ibbi-btn--full" disabled={submitting} style={{ marginTop: 8 }}>
                  {submitting ? "AGUARDE..." : texts.action}
                </button>
              </form>

              {mode === "login" && (
                <p className="ibbi-auth-switch">
                  Não tem conta? <a href={`/cadastro${redirectQuery}`}>Cadastre-se grátis</a>
                </p>
              )}
              {mode === "signup" && (
                <p className="ibbi-auth-switch">
                  Já tem conta? <a href={`/login${redirectQuery}`}>Fazer login</a>
                </p>
              )}

              <div className="ibbi-auth-divider" />

              {!adminOpen ? (
                <button
                  type="button"
                  onClick={() => setAdminOpen(true)}
                  className="ibbi-auth-admin-toggle"
                >
                  <ShieldCheck size={14} /> Acesso administrador
                </button>
              ) : (
                <form onSubmit={submitAdmin} className="ibbi-auth-admin-form">
                  <p className="ibbi-auth-admin-title"><ShieldCheck size={15} /> Área do organizador</p>
                  <div className="ibbi-checkout-field">
                    <label className="ibbi-checkout-label"><Mail size={14} /> E-mail admin</label>
                    <input
                      className="ibbi-checkout-input"
                      type="email"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    />
                  </div>
                  <div className="ibbi-checkout-field">
                    <label className="ibbi-checkout-label"><LockKeyhole size={14} /> Senha</label>
                    <input
                      className="ibbi-checkout-input"
                      type="password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    />
                  </div>
                  {error && adminOpen && <div className="ibbi-checkout-error">{error}</div>}
                  <button className="ibbi-btn ibbi-btn--outline ibbi-btn--full" disabled={submitting}>
                    {submitting ? "AGUARDE..." : "ENTRAR NO PAINEL"}
                  </button>
                </form>
              )}

              <p className="ibbi-auth-hint">
                <TicketCheck size={14} /> Comprou por e-mail sem cadastro? Use o mesmo e-mail aqui.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
