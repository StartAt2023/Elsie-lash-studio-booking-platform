"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const TOAST_DURATION_MS = 4000;

type ToastContextValue = {
  toast: string | null;
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-xl border border-borderSoft/80 bg-white px-4 py-3 shadow-card"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm text-charcoal">{toast}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: null, showToast: (_: string) => {} };
  return ctx;
}
