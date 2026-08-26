export function LoadingSkeleton() {
  return <div className="card" style={{ height: 220, overflow: "hidden" }}><div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg,#eee7dc,#fff,#eee7dc)", animation: "pulse 1.4s infinite" }} /></div>;
}
