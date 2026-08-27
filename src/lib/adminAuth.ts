import { supabase } from "./supabase";

export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@casaibbi.com";

export async function loginAdmin(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: "Banco de dados nao conectado." };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "E-mail ou senha incorretos." };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { ok: false, error: "Acesso permitido apenas para administradores." };
  }

  return { ok: true };
}

export function logoutAdmin(): void {
  supabase?.auth.signOut();
}
