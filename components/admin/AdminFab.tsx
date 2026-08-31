"use client";

import { useState } from "react";
import AdminCodeGate from "@/components/admin/AdminCodeGate";
import RegisterContactForm from "@/components/admin/RegisterContactForm";

type Step = "closed" | "code" | "form";

export default function AdminFab({ onRegistered }: { onRegistered: () => void }) {
  const [step, setStep] = useState<Step>("closed");
  const [adminCode, setAdminCode] = useState("");

  return (
    <>
      <button
        onClick={() => setStep("code")}
        aria-label="Daftarkan kontak baru"
        className="premium-cta glossy-btn fixed bottom-24 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-ocean-950 transition active:scale-95"
      >
        +
      </button>

      {step === "code" && (
        <AdminCodeGate
          onVerified={(code) => {
            setAdminCode(code);
            setStep("form");
          }}
          onClose={() => setStep("closed")}
        />
      )}

      {step === "form" && (
        <RegisterContactForm
          adminCode={adminCode}
          onClose={() => setStep("closed")}
          onSuccess={() => {
            setStep("closed");
            onRegistered();
          }}
        />
      )}
    </>
  );
}
