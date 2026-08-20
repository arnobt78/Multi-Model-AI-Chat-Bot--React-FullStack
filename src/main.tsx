import React from "react";
import ReactDOM from "react-dom/client";
// Init Sentry before App so early errors are captured (tunnel: /api/monitoring)
import { Sentry } from "./sentry";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
          Something went wrong. Please refresh the page.
        </div>
      }
      showDialog={false}
    >
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
