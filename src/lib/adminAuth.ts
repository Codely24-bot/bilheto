import { supabase } from "./supabase";

export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@casaibbi.com";

export async function loginAdmin(email: string, password: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return false;
  return true;
}

export function logoutAdmin(): void {
  supabase?.auth.signOut();
}
