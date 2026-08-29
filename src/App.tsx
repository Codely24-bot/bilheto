import { lazy, Suspense, useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import { Header } from "./components/sections/Header";
import { Footer } from "./components/sections/Footer";
import { WhatsAppButton } from "./components/sections/WhatsApp";
import { BackToTop } from "./components/sections/BackToTop";

const Home = lazy(() => import("./pages/Home").then((module) => ({ default: module.Home })));
const Login = lazy(() => import("./pages/AuthPages").then((module) => ({ default: module.Login })));
const Checkin = lazy(() => import("./pages/Checkin").then((module) => ({ default: module.Checkin })));
const Checkout = lazy(() => import("./pages/Checkout").then((module) => ({ default: module.Checkout })));
const EventPage = lazy(() => import("./pages/EventPage").then((module) => ({ default: module.EventPage })));
const MyTickets = lazy(() => import("./pages/MyTickets").then((module) => ({ default: module.MyTickets })));
const TicketPage = lazy(() => import("./pages/TicketPage").then((module) => ({ default: module.TicketPage })));
const Admin = lazy(() => import("./pages/Admin").then((module) => ({ default: module.Admin })));
const Doacoes = lazy(() => import("./pages/Doacoes").then((module) => ({ default: module.Doacoes })));
const EmailConfirmed = lazy(() => import("./pages/StatusPages").then((module) => ({ default: module.EmailConfirmed })));
const ResetPasswordPage = lazy(() => import("./pages/StatusPages").then((module) => ({ default: module.ResetPasswordPage })));

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

function PageLoader() {
  return (
    <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#071116" }}>
      <p style={{ color: "#A6ADAF", fontSize: 16, fontFamily: "Inter, sans-serif" }}>Carregando...</p>
    </div>
  );
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
    page = isAdmin ? <Redirect to="/admin/dashboard" /> : <Checkout slug={slug} />;
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
      <Suspense fallback={<PageLoader />}>
        {page}
      </Suspense>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
