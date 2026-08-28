import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";

type Profile = { id: string; email: string; full_name: string; role: string };

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    if (!supabase) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserFromSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserFromSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function setUserFromSession(session: Session | null) {
    if (!session) {
      setState({ session: null, user: null, profile: null, loading: false, isAdmin: false });
      return;
    }

    const user = session.user;
    let profile: Profile | null = null;

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("id", user.id)
        .single();
      profile = data;
    }

    setState({
      session,
      user,
      profile,
      loading: false,
      isAdmin: profile?.role === "admin",
    });
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export async function registerUser(name: string, email: string, password: string): Promise<{ ok: boolean; error?: string; userId?: string }> {
  if (!supabase) return { ok: false, error: "Banco de dados não conectado." };
  if (!name.trim()) return { ok: false, error: "Informe seu nome." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase())) return { ok: false, error: "Informe um e-mail válido." };
  if (password.length < 6) return { ok: false, error: "A senha precisa ter pelo menos 6 caracteres." };

  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { name: name.trim() },
    },
  });

  if (error) return { ok: false, error: traduzirErro(error.message) };
  return { ok: true, userId: data.session?.user.id ?? data.user?.id };
}

export async function loginUser(email: string, password: string): Promise<{ ok: boolean; error?: string; isAdmin?: boolean }> {
  if (!supabase) return { ok: false, error: "Banco de dados não conectado." };
  if (!email.trim() || !password) return { ok: false, error: "Preencha e-mail e senha." };

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) return { ok: false, error: traduzirErro(error.message) };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  return { ok: true, isAdmin: profile?.role === "admin" };
}

export async function logoutUser(): Promise<void> {
  await supabase?.auth.signOut();
}

export async function resetPassword(email: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: "Banco de dados não conectado." };
  if (!email.trim()) return { ok: false, error: "Informe seu e-mail." };

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  });

  if (error) return { ok: false, error: traduzirErro(error.message) };
  return { ok: true };
}

function traduzirErro(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (msg.includes("User already registered")) return "Este e-mail já está cadastrado. Faça login.";
  if (msg.includes("Unable to validate email address")) return "E-mail inválido.";
  if (msg.includes("Password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (msg.includes("Email rate limit exceeded")) return "Muitas tentativas. Aguarde alguns minutos.";
  if (msg.includes("Signup requires")) return "Cadastros estão temporariamente indisponíveis.";
  return msg;
}
