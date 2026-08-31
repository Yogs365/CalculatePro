"use client";

import { useEffect, useState } from "react";
import { setMyAccessCode, resetMyAccessCode, hasCustomAccessCode } from "@/features/profile/accessCode";

interface ChangeAccessCodeSheetProps {
  onClose: () => void;
}

export default function ChangeAccessCodeSheet({ onClose }: ChangeAccessCodeSheetProps) {
  const [code, setCode] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    hasCustomAccessCode().then(setIsCustom);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code || busy) return;
    setBusy(true);
    setError(null);
    setSuccess(null);

    const result = await setMyAccessCode(code);
    setBusy(false);

    if (!result.success) {
      setError(result.error ?? "Gagal mengubah kode akses");
      return;
    }
    setIsCustom(true);
    setCode("");
    setSuccess("Kode akses berhasil diubah.");
  }

  async function handleReset() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setSuccess(null);

    const result = await resetMyAccessCode();
    setBusy(false);

    if (!result.success) {
      setError(result.error ?? "Gagal mereset kode akses");
      return;
    }
    setIsCustom(false);
    setSuccess("Kode akses dikembalikan ke kode awal.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="premium-glass glossy-surface w-full animate-fade-in-scale rounded-t-[2rem] p-6 pb-[calc(2rem+env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/15" />
        <h2 className="mb-1 text-center font-display text-lg text-ocean-50">Ubah Kode Akses</h2>
        <p className="mb-5 text-center text-xs text-ocean-400">
          Kode ini digunakan untuk login. Simpan baik-baik.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
            inputMode="numeric"
            placeholder="Kode baru (3-8 digit)"
            className="w-full rounded-xl border border-ocean-800 bg-ocean-900 px-4 py-3 text-center text-lg tracking-widest text-ocean-50 outline-none transition focus:border-ocean-300 focus:ring-2 focus:ring-ocean-300/20"
          />

          {error && <p className="text-center text-sm text-red-600">{error}</p>}
          {success && <p className="text-center text-sm text-online">{success}</p>}

          <button
            type="submit"
            disabled={code.length < 3 || busy}
            className="premium-cta glossy-btn w-full rounded-xl py-3 text-sm font-medium text-ocean-950 transition active:scale-[0.99] disabled:opacity-40"
          >
            {busy ? "Menyimpan..." : "Simpan Kode Baru"}
          </button>

          {isCustom && (
            <button
              type="button"
              onClick={handleReset}
              disabled={busy}
              className="w-full rounded-xl bg-ocean-900 py-3 text-sm text-ocean-300 disabled:opacity-40"
            >
              Kembalikan ke Kode Awal
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
