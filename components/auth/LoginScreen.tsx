"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginWithCode } from "@/features/auth/login";

const CODE_LENGTH = 3;

export default function LoginScreen() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const code = digits.join("");

  function setDigit(index: number, value: string) {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    setError(null);

    if (clean && index < CODE_LENGTH - 1) {
      const el = document.getElementById(`code-${index + 1}`);
      el?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const el = document.getElementById(`code-${index - 1}`);
      el?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== CODE_LENGTH || submitting) return;

    setSubmitting(true);
    setError(null);

    const result = await loginWithCode(code);

    if (!result.success) {
      setError(result.error ?? "Kode akses tidak dikenali");
      setDigits(Array(CODE_LENGTH).fill(""));
      document.getElementById("code-0")?.focus();
      setSubmitting(false);
      return;
    }

    router.replace("/pesan");
    router.refresh();
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {digits.map((d, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={1}
                value={d}
                autoFocus={i === 0}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="glossy-chip h-14 w-14 rounded-2xl border border-black/[0.08] bg-white text-center text-2xl font-medium text-ocean-50 outline-none transition focus:border-ocean-300 focus:ring-2 focus:ring-ocean-300/25"
              />
            ))}
          </div>

          {error && (
            <p role="alert" className="text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={code.length !== CODE_LENGTH || submitting}
            className="premium-cta glossy-btn w-full rounded-2xl py-3.5 text-sm font-semibold tracking-wide text-ocean-950 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {submitting ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-ocean-500">
          Belum punya kode akses? Minta admin mendaftarkanmu.
        </p>
      </div>
    </div>
  );
}
