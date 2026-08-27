import { Component } from "react";
import type { ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", color: "#fff", padding: 24 }}>
          <div style={{ maxWidth: 480, textAlign: "center" }}>
            <h1 style={{ fontSize: 28, marginBottom: 12 }}>Algo deu errado</h1>
            <p style={{ color: "#a3a3a3", marginBottom: 20 }}>{this.state.error.message}</p>
            <button className="btn btn-primary" onClick={() => { this.setState({ error: null }); location.reload(); }}>Tentar novamente</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
