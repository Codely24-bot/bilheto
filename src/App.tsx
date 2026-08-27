import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import { Header } from "./components/sections/Header";
import { Footer } from "./components/sections/Footer";
import { WhatsAppButton } from "./components/sections/WhatsApp";
import { BackToTop } from "./components/sections/BackToTop";
import { Home } from "./pages/Home";
import { Login } from "./pages/AuthPages";
import { Checkin } from "./pages/Checkin";
import { Checkout } from "./pages/Checkout";
import { EventPage } from "./pages/EventPage";
import { MyTickets } from "./pages/MyTickets";
import { TicketPage } from "./pages/TicketPage";
import { Admin } from "./pages/Admin";
import { Doacoes } from "./pages/Doacoes";
import { EmailConfirmed, ResetPasswordPage } from "./pages/StatusPages";

function useRouter() {
  const [path, setPath] = useState(location.pathname + location.search);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      if (href.startsWith("#")) {
        e.preventDefault();
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          history.pushState(null, "", "/" + href);
          setPath("/" + href);
          window.scrollTo(0, 0);
          setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
        }
        return;
      }

      e.preventDefault();
      history.pushState(null, "", href);
      setPath(href);
      window.scrollTo(0, 0);
    };
    const onPop = () => setPath(location.pathname + location.search);
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  return path;
}

function Redirect({ to }: { to: string }) {
  useEffect(() => {
    history.pushState(null, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo(0, 0);
  }, [to]);
  return null;
}

function safeRedirectFrom(fullPath: string) {
  const params = new URLSearchParams(fullPath.split("?")[1] ?? "");
  const redirect = params.get("redirect");
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) return null;
  return redirect;
}

function AppRoutes() {
  const fullPath = useRouter();
  const path = fullPath.split("?")[0];
  const { user, isAdmin, loading } = useAuth();
  const authenticatedHome = isAdmin ? "/admin/dashboard" : "/meus-ingressos";
  const requestedRedirect = safeRedirectFrom(fullPath);
  const userLoginRedirect = requestedRedirect && !requestedRedirect.startsWith("/admin") && requestedRedirect !== "/checkin"
    ? requestedRedirect
    : authenticatedHome;
  const adminLoginRedirect = requestedRedirect && (requestedRedirect.startsWith("/admin") || requestedRedirect === "/checkin")
    ? requestedRedirect
    : authenticatedHome;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#071116" }}>
        <p style={{ color: "#A6ADAF", fontSize: 16, fontFamily: "Inter, sans-serif" }}>Carregando...</p>
      </div>
    );
  }

  const isAdminPage = path.startsWith("/admin");
  const isCheckinPage = path.startsWith("/checkin");

  let page = <Home />;
  if (path.startsWith("/evento/")) {
    const slug = decodeURIComponent(path.split("/")[2] ?? "");
    page = <EventPage slug={slug} />;
  }
  if (path.startsWith("/checkout/")) {
    const slug = decodeURIComponent(path.split("/")[2] ?? "");
    page = !user ? <Redirect to={`/login?redirect=${encodeURIComponent(path)}`} /> : isAdmin ? <Redirect to="/admin/dashboard" /> : <Checkout slug={slug} />;
  }
  if (path.startsWith("/auth/confirm")) page = <EmailConfirmed />;
  if (path.startsWith("/redefinir-senha")) page = <ResetPasswordPage />;
  if (path.startsWith("/doacoes")) page = <Doacoes />;
  if (path.startsWith("/meus-ingressos")) page = user ? (isAdmin ? <Redirect to="/admin/dashboard" /> : <MyTickets />) : <Redirect to="/login" />;
  if (path.startsWith("/ingresso/")) page = <TicketPage token={decodeURIComponent(path.split("/")[2] ?? "")} />;
  if (path.startsWith("/checkin")) page = isAdmin ? <Checkin /> : <Redirect to="/login?redirect=/checkin" />;
  if (path.startsWith("/login")) page = user ? <Redirect to={isAdmin ? adminLoginRedirect : userLoginRedirect} /> : <Login />;
  if (path.startsWith("/cadastro")) page = user ? <Redirect to={isAdmin ? adminLoginRedirect : userLoginRedirect} /> : <Login mode="signup" />;
  if (path.startsWith("/esqueci-senha")) page = <Login mode="forgot" />;
  if (path.startsWith("/admin")) {
    const params = new URLSearchParams(fullPath.split("?")[1] ?? "");
    const adminPage = params.get("aba") ?? params.get("tab") ?? path.replace(/^\/admin\/?/, "");
    page = isAdmin ? <Admin page={adminPage || "dashboard"} /> : <Redirect to="/login" />;
  }

  if (isAdminPage || isCheckinPage) return <>{page}</>;

  return (
    <>
      <Header />
      {page}
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
