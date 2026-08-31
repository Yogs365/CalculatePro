"use client";

import { useRef, useState } from "react";
import ResolvedAvatar from "@/components/ui/ResolvedAvatar";
import { updateMyProfile, updateMyAvatar } from "@/features/profile/updateProfile";
import type { Profile } from "@/lib/supabase/types";

interface EditProfileSheetProps {
  profile: Profile;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditProfileSheet({ profile, onClose, onSaved }: EditProfileSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarPath, setAvatarPath] = useState(profile.avatar_url);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setError(null);
    try {
      const path = await updateMyAvatar(profile.id, file);
      setAvatarPath(path);
    } catch {
      setError("Gagal mengunggah foto");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await updateMyProfile(profile.id, { displayName, username, bio });
      onSaved();
    } catch {
      setError("Gagal menyimpan profile");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="premium-glass glossy-surface max-h-[85dvh] w-full animate-fade-in-scale overflow-y-auto thin-scrollbar rounded-t-[2rem] p-6 pb-[calc(2rem+env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/15" />
        <h2 className="mb-5 text-center font-display text-lg text-ocean-50">Edit Profile</h2>

        <div className="mb-6 flex flex-col items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative"
            disabled={uploadingAvatar}
          >
            <ResolvedAvatar name={displayName || "?"} avatarPath={avatarPath} size="xl" />
            <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-ocean-300 text-sm">
              {uploadingAvatar ? "…" : "✎"}
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-ocean-400">Nama</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-ocean-800 bg-ocean-900 px-4 py-2.5 text-sm text-ocean-50 outline-none transition focus:border-ocean-300 focus:ring-2 focus:ring-ocean-300/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ocean-400">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
              placeholder="opsional"
              className="w-full rounded-xl border border-ocean-800 bg-ocean-900 px-4 py-2.5 text-sm text-ocean-50 outline-none transition focus:border-ocean-300 focus:ring-2 focus:ring-ocean-300/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ocean-400">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="opsional"
              rows={2}
              className="w-full resize-none rounded-xl border border-ocean-800 bg-ocean-900 px-4 py-2.5 text-sm text-ocean-50 outline-none transition focus:border-ocean-300 focus:ring-2 focus:ring-ocean-300/20"
            />
          </div>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving || !displayName.trim()}
            className="premium-cta glossy-btn w-full rounded-xl py-3 text-sm font-medium text-ocean-950 transition active:scale-[0.99] disabled:opacity-40"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}
