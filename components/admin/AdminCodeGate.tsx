"use client";

import { useState } from "react";

interface AdminCodeGateProps {
  onVerified: (adminCode: string) => void;
  onClose: () => void;
}

// The shared admin gate code (default "123", admin-changeable via
// set_admin_code) isn't actually checked here - register-contact verifies it
// server-side via verify_admin_code. This step just collects it before
// opening the registration form, matching the intended FAB flow.
export default function AdminCodeGate({ onVerified, onClose }: AdminCodeGateProps) {
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().length >= 3) onVerified(code.trim());
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="premium-glass glossy-surface w-full max-w-sm animate-fade-in-scale rounded-t-[2rem] p-6 sm:rounded-[2rem]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg text-ocean-50">Kode Admin</h2>
          <button
            type="button"
            onClick={onClose}
            className="glossy-chip flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-black/[0.03] text-ocean-300"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 text-sm text-ocean-400">
          Masukkan kode akses admin untuk membuka form daftar kontak.
        </p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
          placeholder="•••"
          className="glossy-chip w-full rounded-xl border border-black/[0.08] bg-ocean-900/70 px-4 py-3 text-center text-lg tracking-[0.5em] text-ocean-50 outline-none focus:border-ocean-300"
        />
        <button
          type="submit"
          disabled={code.trim().length < 3}
          className="premium-cta glossy-btn mt-5 w-full rounded-xl py-3 text-sm font-medium text-ocean-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Lanjutkan
        </button>
      </form>
    </div>
  );
}
