"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.refresh();
      } else {
        setError(data.message || "Incorrect password. Access denied.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      {/* Background radial glow */}
      <div className="absolute w-[400px] h-[400px] bg-bcn-orange/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-[#141414] border border-bcn-orange/25 rounded-3xl p-8 sm:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-bcn-orange/10 border border-bcn-orange/30 flex items-center justify-center text-bcn-orange mx-auto shadow-[0_0_25px_rgba(255,132,0,0.2)]">
            <Lock className="w-8 h-8 text-bcn-amber" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-bcn-orange block">
            STAFF CHECK-IN PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            BCN Hangout 2026
          </h1>
          <p className="text-xs text-[#A39C90]">
            Enter the staff access password to manage attendee check-ins.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#DFD8CE] uppercase tracking-wider mb-2">
              Staff Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              autoFocus
              required
              className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-[#6C665D] focus:outline-none focus:border-bcn-orange transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3.5 px-4 rounded-xl bg-bcn-gradient text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 shadow-[0_4px_25px_rgba(255,132,0,0.35)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Access Staff Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-[#6C665D]">
          <ShieldCheck className="w-3.5 h-3.5 text-bcn-orange" />
          <span>Authorized personnel only &bull; Direct access</span>
        </div>
      </div>
    </div>
  );
}
