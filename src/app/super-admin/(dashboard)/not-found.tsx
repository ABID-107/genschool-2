"use client";

import { FileQuestion, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SuperAdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-[var(--amber-50)] border border-[var(--amber-200)] flex items-center justify-center mb-5">
        <FileQuestion size={32} className="text-[var(--amber-500)]" />
      </div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-[var(--text-muted)] mb-6 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/super-admin"
        className="btn btn-primary"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}