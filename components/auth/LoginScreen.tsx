"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginWithCode } from "@/features/auth/login";

const CODE_MIN_LENGTH = 3;
const CODE_MAX_LENGTH = 8;
const KEYPAD_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

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
      <div className="w-full max-w-xs animate-fade-in">
        <div className="mb-10 text-center">
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            aria-label={`${code.length} dari ${CODE_MAX_LENGTH} digit terisi`}
            className="glossy-chip flex min-h-16 items-center justify-center rounded-2xl border border-black/[0.08] bg-white px-4"
          >
            <div className="flex min-h-7 flex-wrap justify-center gap-2">
              {Array.from({ length: Math.max(CODE_MIN_LENGTH, code.length) }).map((_, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 rounded-full border transition ${
                    index < code.length
                      ? "border-ocean-300 bg-ocean-300"
                      : "border-ocean-300/35 bg-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="grid grid-cols-3 gap-3" aria-label="Keypad kode akses">
            {KEYPAD_DIGITS.map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => appendDigit(digit)}
                disabled={submitting || code.length >= CODE_MAX_LENGTH}
                className="glossy-chip flex h-14 items-center justify-center rounded-2xl border border-black/[0.08] bg-white text-xl font-semibold text-ocean-50 transition hover:border-ocean-300/40 hover:bg-ocean-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Angka ${digit}`}
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClearCode}
              disabled={submitting || code.length === 0}
              className="glossy-chip flex h-14 items-center justify-center rounded-2xl border border-black/[0.08] bg-white text-xs font-semibold uppercase tracking-wide text-ocean-400 transition hover:border-ocean-300/40 hover:bg-ocean-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={() => appendDigit("0")}
              disabled={submitting || code.length >= CODE_MAX_LENGTH}
              className="glossy-chip flex h-14 items-center justify-center rounded-2xl border border-black/[0.08] bg-white text-xl font-semibold text-ocean-50 transition hover:border-ocean-300/40 hover:bg-ocean-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Angka 0"
            >
              0
            </button>
            <button
              type="button"
              onClick={removeLastDigit}
              disabled={submitting || code.length === 0}
              className="glossy-chip flex h-14 items-center justify-center rounded-2xl border border-black/[0.08] bg-white text-xl text-ocean-400 transition hover:border-ocean-300/40 hover:bg-ocean-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Hapus satu digit terakhir"
            >
              ←
            </button>
          </div>

          <button
            type="submit"
            disabled={code.length < CODE_MIN_LENGTH || submitting}
            className="premium-cta glossy-btn w-full rounded-2xl py-3.5 text-sm font-semibold tracking-wide text-ocean-950 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {submitting ? "Memeriksa..." : "OK"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-ocean-500">
          Belum punya kode akses? Minta admin mendaftarkanmu.
        </p>
      </div>
    </div>
  );
}
