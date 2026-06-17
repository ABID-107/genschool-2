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
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-5">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-navy-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-navy-500 mb-6 text-center max-w-md">
        An unexpected error occurred in the Super Admin panel.
        Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-all"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}
