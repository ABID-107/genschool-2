"use client";

import { FileQuestion, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SuperAdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5">
        <FileQuestion size={32} className="text-amber-500" />
      </div>
      <h2 className="text-xl font-bold text-navy-900 mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-navy-500 mb-6 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/super-admin"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-all no-underline"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}
