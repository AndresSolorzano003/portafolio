import { Component } from "react";

// Prevents a single broken component (bad data from the admin panel, a
// stray undefined field, etc.) from blanking the entire site. Without this,
// any uncaught render error unmounts the whole React tree.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              padding: "2rem",
              textAlign: "center",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <p style={{ fontSize: "1.1rem" }}>Algo salió mal al mostrar esta sección.</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                borderRadius: "999px",
                padding: "0.6rem 1.4rem",
                background: "#14161c",
                color: "#f4f3f1",
                border: "none",
                cursor: "pointer",
              }}
            >
              Recargar página
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
