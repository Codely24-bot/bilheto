import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import { Header } from "./components/sections/Header";
import { Footer } from "./components/sections/Footer";
import { WhatsAppButton } from "./components/sections/WhatsApp";
import { Home } from "./pages/Home";
import { Login } from "./pages/AuthPages";
import { Checkin } from "./pages/Checkin";
import { Checkout } from "./pages/Checkout";
import { EventPage } from "./pages/EventPage";
import { MyTickets } from "./pages/MyTickets";
import { Pending, Success } from "./pages/StatusPages";
import { TicketPage } from "./pages/TicketPage";
import { Admin } from "./pages/Admin";

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
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      e.preventDefault();
      history.pushState(null, "", href);
      setPath(href);
      window.scrollTo(0, 0);

      const hash = href.split("#")[1];
      if (hash) {
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        });
      }
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

function AppRoutes() {
  const fullPath = useRouter();
  const path = fullPath.split("?")[0];
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#071116" }}>
        <p style={{ color: "#A6ADAF", fontSize: 16, fontFamily: "Inter, sans-serif" }}>Carregando...</p>
      </div>
    );
  }

  const isAdminPage = path.startsWith("/admin");

  let page = <Home />;
  if (path.startsWith("/evento/")) {
    const slug = decodeURIComponent(path.split("/")[2] ?? "");
    page = <EventPage slug={slug} />;
  }
  if (path.startsWith("/checkout/sucesso")) page = <Success />;
  else if (path.startsWith("/checkout/pendente")) page = <Pending />;
  else if (path.startsWith("/checkout/")) page = <Checkout orderId={path.split("/")[2] ?? ""} />;
  if (path.startsWith("/meus-ingressos")) page = user ? <MyTickets /> : <Redirect to="/login" />;
  if (path.startsWith("/ingresso/")) page = <TicketPage token={decodeURIComponent(path.split("/")[2] ?? "")} />;
  if (path.startsWith("/checkin")) page = <Checkin />;
  if (path.startsWith("/login")) page = user ? <Redirect to="/meus-ingressos" /> : <Login />;
  if (path.startsWith("/cadastro")) page = user ? <Redirect to="/meus-ingressos" /> : <Login mode="signup" />;
  if (path.startsWith("/esqueci-senha")) page = <Login mode="forgot" />;
  if (path.startsWith("/admin")) page = isAdmin ? <Admin page={path.replace("/admin/", "")} /> : <Redirect to="/login" />;

  if (isAdminPage) return <>{page}</>;

  return (
    <>
      <Header />
      {page}
      <Footer />
      <WhatsAppButton />
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
