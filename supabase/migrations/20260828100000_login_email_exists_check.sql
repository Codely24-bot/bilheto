-- Login UX: distinguish "email not registered" from "wrong password".
-- GoTrue returns "Invalid login credentials" for both cases. This security
-- definer function lets the anon client check whether an email is registered
-- so the frontend can show a friendlier signup message.

create or replace function public.email_exists(p_email text)
returns boolean
language sql
stable
security definer
set search_path = auth, public
as $$
  select exists (
    select 1 from auth.users where lower(email) = lower(p_email)
  );
$$;

revoke all on function public.email_exists(text) from public, anon, authenticated;
grant execute on function public.email_exists(text) to anon, authenticated;