"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function SuperAdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-error-bg)] border border-[var(--color-error)]/20 flex items-center justify-center mb-5">
        <AlertTriangle size={32} className="text-[var(--color-error)]" />
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-[var(--text-muted)] mb-6 text-center max-w-md">
        An unexpected error occurred in the Super Admin panel.
        Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="btn btn-primary"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}