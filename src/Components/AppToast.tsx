/**
 * Lightweight app toast — title + subtitle, success/error, auto-dismiss.
 * No third-party toast library; styled for the ChatBotApp dark/pink theme.
 */
import React, { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import "./AppToast.css";

export type AppToastVariant = "success" | "error";

export interface AppToastProps {
  open: boolean;
  variant: AppToastVariant;
  title: string;
  subtitle: string;
  durationMs?: number;
  onClose: () => void;
}

const AppToast: React.FC<AppToastProps> = ({
  open,
  variant,
  title,
  subtitle,
  durationMs = 3500,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(id);
  }, [open, durationMs, onClose, title, subtitle]);

  if (!open) return null;

  return (
    <div
      className={`app-toast app-toast-${variant}`}
      role="status"
      aria-live="polite"
    >
      <span className="app-toast-icon" aria-hidden>
        {variant === "success" ? (
          <CheckCircle2 size={20} strokeWidth={2} />
        ) : (
          <XCircle size={20} strokeWidth={2} />
        )}
      </span>
      <div className="app-toast-copy">
        <p className="app-toast-title">{title}</p>
        <p className="app-toast-subtitle">{subtitle}</p>
      </div>
      <button
        type="button"
        className="app-toast-close"
        aria-label="Dismiss notification"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default AppToast;
