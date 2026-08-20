/**
 * Reusable confirm modal — dark/pink theme matching ChatBotApp.
 * Supports busy/Deleting… spinner so the list can update without a flash under the dialog.
 */
import React, { useEffect, useRef } from "react";
import { AlertTriangle, Loader2, MessageCircle, Trash2 } from "lucide-react";
import "./ConfirmDialog.css";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Emphasize destructive confirm (delete). */
  danger?: boolean;
  /** True while the confirm action is in progress (spinner + Deleting…). */
  busy?: boolean;
  busyLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Keep Chat",
  danger = true,
  busy = false,
  busyLabel = "Deleting…",
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || busy) return;
    cancelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="confirm-dialog-overlay"
      role="presentation"
      onClick={() => {
        if (!busy) onCancel();
      }}
    >
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-busy={busy}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog-header">
          <AlertTriangle
            className="confirm-dialog-icon"
            size={22}
            aria-hidden
          />
          <h2 id="confirm-dialog-title">{title}</h2>
        </div>
        <p id="confirm-dialog-message" className="confirm-dialog-message">
          {message}
        </p>
        <div className="confirm-dialog-actions">
          <button
            type="button"
            ref={cancelRef}
            className="confirm-dialog-btn confirm-dialog-btn-cancel"
            onClick={onCancel}
            disabled={busy}
          >
            <MessageCircle size={16} strokeWidth={2} aria-hidden />
            <span>{cancelLabel}</span>
          </button>
          <button
            type="button"
            className={`confirm-dialog-btn confirm-dialog-btn-confirm${
              danger ? " danger" : ""
            }`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? (
              <>
                <Loader2
                  className="confirm-dialog-spinner"
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                />
                <span>{busyLabel}</span>
              </>
            ) : (
              <>
                <Trash2 size={16} strokeWidth={2} aria-hidden />
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
