import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, TicketCheck, UserRound } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { loginAdmin } from "../lib/adminAuth";
import { loginUser, registerUser, resetPassword } from "../lib/auth";


type Mode = "login" | "signup" | "forgot";

const copy: Record<Mode, { title: string; subtitle: string; action: string }> = {
  login: { title: "Bem-vindo de volta", subtitle: "Entre para ver e gerenciar seus ingressos.", action: "ENTRAR" },
  signup: { title: "Crie sua conta", subtitle: "É rápido e grátis. Leva menos de um minuto.", action: "CRIAR CONTA" },
  forgot: { title: "Recuperar senha", subtitle: "Informe seu e-mail para receber o link de recuperação.", action: "ENVIAR LINK" }
};

export function Login({ mode = "login" }: { mode?: Mode }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });

  const texts = copy[mode];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      if (mode === "signup") {
        const result = await registerUser(form.name, form.email, form.password);
        if (!result.ok) return setError(result.error ?? "Não foi possível criar a conta.");
        if (result.error === "__CONFIRM_EMAIL__") {
          setNotice("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
          return;
        }
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
    } finally {
      setSubmitting(false);
    }
  };

  const submitAdmin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const ok = await loginAdmin(adminForm.email, adminForm.password);
      if (!ok) setError("E-mail ou senha de administrador incorretos.");
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="section">
    <div className="container">
      <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden", minHeight: 560 }}>

          <div style={{ position: "relative", minHeight: 260, background: "linear-gradient(135deg, #0D171B, #071116)" }}>
          <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(24px,4vw,44px)", gap: 12 }}>
            <span className="badge" style={{ background: "#ffffff", color: "#000000", alignSelf: "flex-start" }}>Casa IBBI</span>
            <h2 style={{ margin: 0, fontSize: "clamp(26px,3vw,40px)", textAlign: "left" }}>Seu ingresso,<br />em poucos cliques.</h2>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 16 }}>Compre, receba e apresente seus ingressos direto do celular.</p>
          </div>
        </div>

        <div style={{ padding: "clamp(24px,4vw,48px)", display: "grid", gap: 18, alignContent: "center" }}>
          {mode !== "login" && <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700, fontSize: 14 }}><ArrowLeft size={15} />Voltar para o login</a>}

          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(28px,4vw,42px)", textAlign: "left" }}>{texts.title}</h1>
            <p className="muted" style={{ margin: "8px 0 0", fontSize: 16 }}>{texts.subtitle}</p>
          </div>

          <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
            {mode === "signup" && (
              <label><span style={{ display: "flex", gap: 8, alignItems: "center" }}><UserRound size={16} />Nome completo</span>
                <input className="input" placeholder="Seu nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
            )}

            <label><span style={{ display: "flex", gap: 8, alignItems: "center" }}><Mail size={16} />E-mail</span>
              <input className="input" placeholder="voce@email.com" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>

            {mode !== "forgot" && (
              <label><span style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", gap: 8, alignItems: "center" }}><LockKeyhole size={16} />Senha</span>
                {mode === "login" && <a href="/esqueci-senha" style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Esqueci minha senha</a>}
              </span>
                <span style={{ position: "relative", display: "block" }}>
                  <input className="input" placeholder="Mínimo 6 caracteres" type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} style={{ paddingRight: 46 }} />
                  <button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((visible) => !visible)} style={{ position: "absolute", right: 12, top: 12, background: "none", border: 0, color: "var(--muted)", cursor: "pointer", padding: 0 }}>
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </span>
              </label>
            )}

            {error && <p style={{ margin: 0, color: "var(--danger)", fontWeight: 800 }}>{error}</p>}
            {notice && <p style={{ margin: 0, color: "var(--success)", fontWeight: 800 }}>{notice}</p>}

            <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} disabled={submitting}>
              {submitting ? "AGUARDE..." : texts.action}
            </button>
          </form>

          {mode === "login" && (
            <p className="muted" style={{ margin: 0, textAlign: "center", fontSize: 15 }}>
              Não tem conta? <a href="/cadastro" style={{ color: "var(--foreground)", fontWeight: 800, textDecoration: "underline" }}>Cadastre-se grátis</a>
            </p>
          )}
          {mode === "signup" && (
            <p className="muted" style={{ margin: 0, textAlign: "center", fontSize: 15 }}>
              Já tem conta? <a href="/login" style={{ color: "var(--foreground)", fontWeight: 800, textDecoration: "underline" }}>Fazer login</a>
            </p>
          )}

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            {!adminOpen
              ? <button type="button" onClick={() => setAdminOpen(true)} style={{ background: "none", border: 0, color: "var(--muted)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700 }}><ShieldCheck size={14} />Acesso administrador</button>
              : <form onSubmit={submitAdmin} style={{ display: "grid", gap: 10 }}>
                  <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: 14 }}><ShieldCheck size={15} />Área do organizador</p>
                  <label><span style={{ display: "flex", gap: 8, alignItems: "center" }}><Mail size={14} />E-mail admin</span>
                    <input className="input" type="email" value={adminForm.email} onChange={(event) => setAdminForm({ ...adminForm, email: event.target.value })} />
                  </label>
                  <label><span style={{ display: "flex", gap: 8, alignItems: "center" }}><LockKeyhole size={14} />Senha</span>
                    <input className="input" type="password" value={adminForm.password} onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })} />
                  </label>
                  {error && adminOpen && <p style={{ margin: 0, color: "var(--danger)", fontWeight: 800 }}>{error}</p>}
                  <button className="btn btn-secondary" style={{ width: "100%" }} disabled={submitting}>
                    {submitting ? "AGUARDE..." : "ENTRAR NO PAINEL"}
                  </button>
                </form>}
          </div>

          <p className="muted" style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13 }}><TicketCheck size={14} />Comprou por e-mail sem cadastro? Use o mesmo e-mail aqui.</p>
        </div>
      </div>
    </div>
  </main>;
}
