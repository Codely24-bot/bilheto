import { Html5Qrcode } from "html5-qrcode";
import { Camera, CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { performCheckin } from "../services/orders";

type CheckinResult = {
  valid: boolean;
  attendeeName?: string;
  ticketType?: string;
  batchName?: string;
  code?: string;
  message?: string;
};

const READER_ID = "reader";

function extractTicketToken(value: string) {
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    const ticketToken = url.pathname.split("/ingresso/")[1];
    return ticketToken ? decodeURIComponent(ticketToken.split("/")[0]) : trimmed;
  } catch {
    const ticketToken = trimmed.split("/ingresso/")[1];
    return ticketToken ? decodeURIComponent(ticketToken.split("/")[0]) : trimmed;
  }
}

export function Checkin() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanKey, setScanKey] = useState(0);
  const [result, setResult] = useState("");
  const [scannerError, setScannerError] = useState("");
  const [cameraState, setCameraState] = useState<"starting" | "active" | "stopped" | "error">("starting");
  const [checkResult, setCheckResult] = useState<CheckinResult | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let disposed = false;
    const scanner = new Html5Qrcode(READER_ID);
    scannerRef.current = scanner;

    setResult("");
    setCheckResult(null);
    setScannerError("");
    setCameraState("starting");

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (text) => {
          if (disposed) return;
          setResult(extractTicketToken(text));
          setCameraState("stopped");
          scanner.stop().catch(() => undefined);
        },
        () => undefined
      )
      .then(() => {
        if (!disposed) setCameraState("active");
      })
      .catch((error) => {
        console.error("Erro ao abrir camera de check-in:", error);
        if (!disposed) {
          setCameraState("error");
          setScannerError("Não foi possível abrir a câmera. Verifique a permissão do navegador.");
        }
      });

    return () => {
      disposed = true;
      scannerRef.current = null;
      scanner.stop()
        .catch(() => undefined)
        .finally(() => {
          try {
            scanner.clear();
          } catch {
            // Scanner may already be cleared when camera permission fails.
          }
        });
    };
  }, [scanKey]);

  useEffect(() => {
    if (!result || !supabase) return;
    setChecking(true);
    setCheckResult(null);

    supabase
      .from("tickets")
      .select(`
        id, code, token, status, checked_in,
        attendees (name, email),
        ticket_batches (ticket_types (name), name)
      `)
      .eq("token", result)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setCheckResult({ valid: false, message: "Ingresso não encontrado." });
          setChecking(false);
          return;
        }

        const d = data as any;
        const att = Array.isArray(d.attendees) ? d.attendees[0] : d.attendees;

        if (d.checked_in) {
          setCheckResult({
            valid: false,
            message: "Este ingresso já foi utilizado.",
            attendeeName: att?.name,
            code: d.code,
          });
          setChecking(false);
          return;
        }

        if (d.status !== "valid") {
          setCheckResult({
            valid: false,
            message: `Ingresso ${d.status.toUpperCase()}.`,
            attendeeName: att?.name,
            code: d.code,
          });
          setChecking(false);
          return;
        }

        const tb = Array.isArray(d.ticket_batches) ? d.ticket_batches[0] : d.ticket_batches;
        const tt = tb ? (Array.isArray(tb.ticket_types) ? tb.ticket_types[0] : tb.ticket_types) : null;

        setCheckResult({
          valid: true,
          attendeeName: att?.name,
          ticketType: tt?.name,
          batchName: tb?.name,
          code: d.code,
        });
        setChecking(false);
      });
  }, [result]);

  async function confirmCheckin() {
    if (!result) return;
    setChecking(true);
    try {
      await performCheckin(result);
      setCheckResult((prev) => prev ? { ...prev, message: "CHECK-IN CONFIRMADO!" } : prev);
    } catch {
      setCheckResult({ valid: false, message: "Erro ao confirmar check-in." });
    }
    setChecking(false);
  }

  function scanAgain() {
    setScanKey((value) => value + 1);
  }

  return (
    <main className="ibbi-checkin-page">
      <section className="ibbi-checkin-camera-card">
        <div className="ibbi-checkin-camera-header">
          <div>
            <span>{cameraState === "active" ? "Câmera ativa" : cameraState === "starting" ? "Abrindo câmera" : "Leitor pausado"}</span>
          </div>
          <Camera size={22} />
        </div>

        <div className="ibbi-checkin-reader-wrap">
          <div id={READER_ID} className="ibbi-checkin-reader" />
          {cameraState === "starting" && <p className="ibbi-checkin-reader-status">Abrindo câmera...</p>}
          {scannerError && <p className="ibbi-checkin-reader-error">{scannerError}</p>}
        </div>

        {checking && (
          <div className="ibbi-checkin-status">
            Verificando ingresso...
          </div>
        )}

        {checkResult && !checking && (
          <div className={`ibbi-checkin-result ${checkResult.valid ? "ibbi-checkin-result--valid" : "ibbi-checkin-result--invalid"}`}>
            {checkResult.valid ? <CheckCircle2 size={46} /> : <XCircle size={46} />}
            <h2>{checkResult.valid ? checkResult.message || "INGRESSO VÁLIDO" : checkResult.message}</h2>
            {checkResult.attendeeName && <p>Casal: <strong>{checkResult.attendeeName}</strong></p>}
            {checkResult.ticketType && <p>Ingresso: <strong>{checkResult.ticketType}</strong></p>}
            {checkResult.code && <p>Código: <strong>{checkResult.code}</strong></p>}

            <div className="ibbi-checkin-result-actions">
              {checkResult.valid && !checkResult.message?.includes("CONFIRMADO") && (
                <button className="ibbi-btn ibbi-btn--primary" onClick={confirmCheckin}>
                  CONFIRMAR ENTRADA
                </button>
              )}
              <button className="ibbi-btn ibbi-btn--outline" onClick={scanAgain}>
                <RefreshCcw size={16} /> ESCANEAR OUTRO
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
