import { LogOut, Menu, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth, logoutUser } from "../../lib/auth";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const accountHref = user ? "/meus-ingressos" : "/login";

  return (
    <header className="site-header">
      <div className="header-inner container">
        <nav className="header-nav-left hide-mobile">
          <a href="/">Agenda</a>
          <a href="/meus-ingressos">Ingressos</a>
        </nav>

        <a href="/" className="header-logo" aria-label="Casa IBBI">
          <img src="/logo-casa-ibbi.svg" alt="Casa IBBI" />
        </a>

        <nav className="header-nav-right hide-mobile">
          {user ? (
            <button
              className="btn btn-ghost header-user-btn"
              onClick={logoutUser}
              title={`Olá, ${profile?.full_name ?? user.email}`}
            >
              <UserRound size={18} />
            </button>
          ) : (
            <a className="btn btn-ghost header-user-btn" href={accountHref} title="Entrar">
              <UserRound size={18} />
            </a>
          )}
        </nav>

        <div className="header-mobile-actions mobile-only">
          {user ? (
            <button className="btn btn-ghost" onClick={logoutUser} title="Sair" style={{ width: 40, height: 40, padding: 0, borderRadius: 999 }}>
              <UserRound size={18} />
            </button>
          ) : (
            <a className="btn btn-ghost" href={accountHref} title="Entrar" style={{ width: 40, height: 40, padding: 0, borderRadius: 999 }}>
              <UserRound size={18} />
            </a>
          )}
          <button className="btn btn-ghost" aria-label="Menu" onClick={() => setMenuOpen((o) => !o)} style={{ width: 40, height: 40, padding: 0 }}>
            <Menu size={18} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-menu container" style={{ paddingBottom: 16 }}>
          <a className="btn btn-ghost" href="/">Agenda</a>
          <a className="btn btn-ghost" href="/meus-ingressos">Ingressos</a>
          {user && <button className="btn btn-ghost" onClick={logoutUser}><LogOut size={15} />Sair</button>}
        </nav>
      )}
    </header>
  );
}
