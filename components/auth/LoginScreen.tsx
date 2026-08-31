"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginWithCode } from "@/features/auth/login";

const CODE_MIN_LENGTH = 3;
const CODE_MAX_LENGTH = 8;
const KEY_CLASS =
  "flex h-[4.5rem] items-center justify-center rounded-2xl border border-black/[0.08] bg-white text-2xl font-semibold text-ocean-50 transition hover:border-ocean-300/40 hover:bg-ocean-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40";
const OPERATOR_CLASS =
  "flex h-[4.5rem] items-center justify-center rounded-2xl border border-ocean-300/20 bg-ocean-300/10 text-2xl font-semibold text-ocean-300 transition hover:bg-ocean-300/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40";
type Operator = "+" | "−" | "×" | "÷";

export default function LoginScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [pendingOperator, setPendingOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  function appendDigit(digit: string) {
    if (submitting || code.length >= CODE_MAX_LENGTH) return;
    setCode((current) => {
      if (waitingForOperand || current === "0") return digit;
      return current + digit;
    });
    setWaitingForOperand(false);
    setError(null);
  }

  function appendDecimal() {
    if (submitting || code.includes(".")) return;
    setCode((current) => (waitingForOperand || !current ? "0." : `${current}.`));
    setWaitingForOperand(false);
    setError(null);
  }

  function removeLastDigit() {
    if (submitting) return;
    setCode((current) => current.slice(0, -1));
    setWaitingForOperand(false);
    setError(null);
  }

  function handleClearCode() {
    if (submitting) return;
    setCode("");
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(false);
    setError(null);
  }

  function calculate(left: number, right: number, operator: Operator) {
    if (operator === "+") return left + right;
    if (operator === "−") return left - right;
    if (operator === "×") return left * right;
    return right === 0 ? null : left / right;
  }

  function formatResult(value: number) {
    if (!Number.isFinite(value)) return "Error";
    return String(Math.round(value * 1e10) / 1e10);
  }

  function chooseOperator(operator: Operator) {
    if (submitting) return;
    const currentValue = Number(code || 0);
    if (!Number.isFinite(currentValue)) return;

    if (storedValue !== null && pendingOperator && !waitingForOperand) {
      const result = calculate(storedValue, currentValue, pendingOperator);
      if (result === null) {
        setCode("Error");
        setStoredValue(null);
        setPendingOperator(null);
        setWaitingForOperand(true);
        return;
      }
      setCode(formatResult(result));
      setStoredValue(result);
    } else {
      setStoredValue(currentValue);
    }

    setPendingOperator(operator);
    setWaitingForOperand(true);
    setError(null);
  }

  function handleEquals() {
    if (submitting || storedValue === null || !pendingOperator || waitingForOperand) return;
    const result = calculate(storedValue, Number(code), pendingOperator);
    setCode(result === null ? "Error" : formatResult(result));
    setStoredValue(null);
    setPendingOperator(null);
    setWaitingForOperand(true);
    setError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (!/^\d+$/.test(code) || code.length < CODE_MIN_LENGTH) {
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
    <div
      className="relative flex h-dvh flex-col items-center justify-between ocean-bg"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <div className="flex w-full flex-1 flex-col justify-center px-5 py-4">
        <div className="mb-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-36 items-center justify-center rounded-[1.25rem] border border-black/[0.08] bg-ocean-900 px-3">
            <Image
              src="/brand/logo-header-calculator.svg"
              alt="Calculator Pro"
              width={200}
              height={100}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="premium-glass rounded-[2rem] p-3 shadow-premium">
            <div
              aria-label={`${code.length} dari ${CODE_MAX_LENGTH} digit terisi`}
              className="flex min-h-[6rem] items-end justify-center rounded-[1.35rem] bg-ocean-50 px-5 py-4 text-right shadow-inner"
            >
              <span
                aria-live="polite"
                className="min-h-10 w-full truncate font-mono text-4xl tracking-[0.14em] text-ocean-950"
              >
                {error ? "Error" : code || "0"}
              </span>
            </div>

            <p role="alert" className="sr-only">
              {error}
            </p>

            <div className="mt-3 grid grid-cols-4 gap-3" aria-label="Keypad kode akses">
              <button
                type="button"
                onClick={handleClearCode}
                disabled={submitting || code.length === 0}
                className={`${KEY_CLASS} text-sm uppercase tracking-wide text-ocean-400`}
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
                disabled={submitting}
                className="premium-cta glossy-btn flex h-[4.5rem] items-center justify-center rounded-2xl border border-ocean-300/20 text-2xl font-semibold text-ocean-950 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                aria-label="Persentase"
              >
                %
              </button>
              <button
                type="button"
                onClick={() => chooseOperator("÷")}
                disabled={submitting}
                className={OPERATOR_CLASS}
                aria-label="Operator pembagian"
              >
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
              <button
                type="button"
                onClick={() => chooseOperator("×")}
                disabled={submitting}
                className={OPERATOR_CLASS}
                aria-label="Operator perkalian"
              >
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
              <button
                type="button"
                onClick={() => chooseOperator("−")}
                disabled={submitting}
                className={OPERATOR_CLASS}
                aria-label="Operator pengurangan"
              >
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
              <button
                type="button"
                onClick={() => chooseOperator("+")}
                disabled={submitting}
                className={OPERATOR_CLASS}
                aria-label="Operator penjumlahan"
              >
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
              <button
                type="button"
                onClick={appendDecimal}
                disabled={submitting}
                className={OPERATOR_CLASS}
                aria-label="Titik desimal"
              >
                .
              </button>
              <button
                type="button"
                onClick={handleEquals}
                disabled={submitting}
                className={OPERATOR_CLASS}
                aria-label="Hasil kalkulator"
              >
                =
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
