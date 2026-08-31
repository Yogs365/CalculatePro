"use client";

import { useState } from "react";
import { registerContact } from "@/features/admin/registerContact";
import { uploadPendingAvatar } from "@/features/admin/listUsers";

interface RegisterContactFormProps {
  adminCode: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function RegisterContactForm({ adminCode, onSuccess, onClose }: RegisterContactFormProps) {
  const [name, setName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Nama minimal 2 karakter");
      return;
    }
    if (!/^[0-9]{3,8}$/.test(accessCode)) {
      setError("Kode akses harus 3-8 digit angka");
      return;
    }

    setSubmitting(true);
    try {
      let avatarPath: string | null = null;
      if (avatarFile) {
        avatarPath = await uploadPendingAvatar(avatarFile);
      }

      const result = await registerContact({
        adminCode,
        name: name.trim(),
        accessCode,
        avatarUrl: avatarPath,
      });

      if (!result.success) {
        setError(result.error ?? "Gagal mendaftarkan kontak");
        setSubmitting(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah foto");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="premium-glass glossy-surface max-h-[90vh] w-full max-w-sm animate-fade-in-scale overflow-y-auto thin-scrollbar rounded-t-[2rem] p-6 sm:rounded-[2rem]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg text-ocean-50">Daftarkan Kontak</h2>
          <button
            type="button"
            onClick={onClose}
            className="glossy-chip flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-black/[0.03] text-ocean-300"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 flex justify-center">
          <label htmlFor="avatar-input" className="cursor-pointer">
            <div className="glossy-surface flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-black/10 bg-ocean-900/70 text-ocean-400">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl">📷</span>
              )}
            </div>
          </label>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ocean-400">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kontak"
              className="glossy-chip w-full rounded-xl border border-black/[0.08] bg-ocean-900/70 px-4 py-3 text-sm text-ocean-50 outline-none focus:border-ocean-300"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ocean-400">
              Kode akses (3 digit)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
              placeholder="Contoh: 456"
              className="glossy-chip w-full rounded-xl border border-black/[0.08] bg-ocean-900/70 px-4 py-3 text-sm text-ocean-50 outline-none focus:border-ocean-300"
            />
            <p className="mt-1.5 text-xs text-ocean-500">
              Kode ini yang akan dipakai kontak untuk masuk. Sampaikan langsung ke orangnya.
            </p>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="premium-cta glossy-btn mt-6 w-full rounded-xl py-3 text-sm font-medium text-ocean-950 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Mendaftarkan..." : "Daftarkan"}
        </button>
      </form>
    </div>
  );
}
