"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginWithCode } from "@/features/auth/login";

const CODE_MIN_LENGTH = 3;
const CODE_MAX_LENGTH = 8;
const KEY_CLASS =
  "flex h-14 items-center justify-center rounded-2xl border border-black/[0.08] bg-white text-xl font-semibold text-ocean-50 transition hover:border-ocean-300/40 hover:bg-ocean-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40";
const OPERATOR_CLASS =
  "flex h-14 items-center justify-center rounded-2xl border border-ocean-300/20 bg-ocean-300/10 text-xl font-semibold text-ocean-300";

export default function LoginScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function appendDigit(digit: string) {
    if (submitting || code.length >= CODE_MAX_LENGTH) return;
    setCode((current) => current + digit);
    setError(null);
  }

  function removeLastDigit() {
    if (submitting) return;
    setCode((current) => current.slice(0, -1));
    setError(null);
  }

  function handleClearCode() {
    if (submitting) return;
    setCode("");
    setError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (code.length < CODE_MIN_LENGTH) {
      setError(`Kode akses minimal ${CODE_MIN_LENGTH} digit`);
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await loginWithCode(code);

    if (!result.success) {
      setError(result.error ?? "Kode akses tidak dikenali");
      setCode("");
      setSubmitting(false);
      return;
    }

    router.replace("/pesan");
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center ocean-bg px-6">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-16 w-40 items-center justify-center rounded-[1.5rem] border border-black/[0.08] bg-ocean-900 px-3">
            <Image
              src="/brand/logo-header.png"
              alt="CircleX"
              width={200}
              height={100}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          <p className="mt-2 text-sm text-ocean-400">Masukkan kode akses kamu</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="premium-glass rounded-[2rem] p-3 shadow-premium">
            <div
              aria-label={`${code.length} dari ${CODE_MAX_LENGTH} digit terisi`}
              className="flex min-h-[5.5rem] flex-col justify-between rounded-[1.35rem] bg-ocean-50 px-5 py-3 text-right shadow-inner"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ocean-900/70">
                CircleX Access
              </span>
              <span
                aria-live="polite"
                className="min-h-8 truncate font-mono text-2xl tracking-[0.28em] text-ocean-950"
              >
                {code ? "•".repeat(code.length) : "0"}
              </span>
            </div>

            {error && (
              <p role="alert" className="px-2 pb-1 pt-3 text-center text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-3 grid grid-cols-4 gap-2.5" aria-label="Keypad kode akses">
              <button
                type="button"
                onClick={handleClearCode}
                disabled={submitting || code.length === 0}
                className={`${KEY_CLASS} text-xs uppercase tracking-wide text-ocean-400`}
                aria-label="Hapus seluruh kode"
              >
                AC
              </button>
              <button
                type="button"
                onClick={removeLastDigit}
                disabled={submitting || code.length === 0}
                className={`${KEY_CLASS} text-ocean-400`}
                aria-label="Hapus satu digit terakhir"
              >
                ←
              </button>
              <button
                type="submit"
                disabled={code.length < CODE_MIN_LENGTH || submitting}
                className="premium-cta glossy-btn flex h-14 items-center justify-center rounded-2xl border border-ocean-300/20 text-xl font-semibold text-ocean-950 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                aria-label="Lanjutkan"
              >
                %
              </button>
              <button type="button" disabled className={OPERATOR_CLASS} aria-label="Operator pembagian">
                ÷
              </button>

              {["7", "8", "9"].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => appendDigit(digit)}
                  disabled={submitting || code.length >= CODE_MAX_LENGTH}
                  className={KEY_CLASS}
                  aria-label={`Angka ${digit}`}
                >
                  {digit}
                </button>
              ))}
              <button type="button" disabled className={OPERATOR_CLASS} aria-label="Operator perkalian">
                ×
              </button>

              {["4", "5", "6"].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => appendDigit(digit)}
                  disabled={submitting || code.length >= CODE_MAX_LENGTH}
                  className={KEY_CLASS}
                  aria-label={`Angka ${digit}`}
                >
                  {digit}
                </button>
              ))}
              <button type="button" disabled className={OPERATOR_CLASS} aria-label="Operator pengurangan">
                −
              </button>

              {["1", "2", "3"].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => appendDigit(digit)}
                  disabled={submitting || code.length >= CODE_MAX_LENGTH}
                  className={KEY_CLASS}
                  aria-label={`Angka ${digit}`}
                >
                  {digit}
                </button>
              ))}
              <button type="button" disabled className={OPERATOR_CLASS} aria-label="Operator penjumlahan">
                +
              </button>

              <button
                type="button"
                onClick={() => appendDigit("0")}
                disabled={submitting || code.length >= CODE_MAX_LENGTH}
                className={`${KEY_CLASS} col-span-2`}
                aria-label="Angka 0"
              >
                0
              </button>
              <button type="button" disabled className={OPERATOR_CLASS} aria-label="Titik desimal">
                .
              </button>
              <button type="button" disabled className={OPERATOR_CLASS} aria-label="Hasil kalkulator">
                =
              </button>
            </div>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-ocean-500">
          Belum punya kode akses? Minta admin mendaftarkanmu.
        </p>
      </div>
    </div>
  );
}
