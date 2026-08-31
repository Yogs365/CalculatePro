"use client";

import { useState } from "react";
import ResolvedAvatar from "@/components/ui/ResolvedAvatar";
import { deleteContact } from "@/features/admin/deleteContact";
import type { Profile } from "@/lib/supabase/types";

interface UserListItemProps {
  profile: Profile;
  currentUserId: string;
  onDeleted: (userId: string) => void;
}

export default function UserListItem({ profile, currentUserId, onDeleted }: UserListItemProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSelf = profile.id === currentUserId;

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const result = await deleteContact(profile.id);
    if (!result.success) {
      setError(result.error ?? "Gagal menghapus");
      setDeleting(false);
      setConfirming(false);
      return;
    }
    onDeleted(profile.id);
  }

  return (
    <div className="glossy-chip rounded-2xl border border-black/[0.08] bg-black/[0.03] px-4 py-3.5">
      <div className="flex items-center gap-3">
        <ResolvedAvatar name={profile.display_name} avatarPath={profile.avatar_url} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ocean-50">
            {profile.display_name}
            {profile.role === "admin" && (
              <span className="ml-2 rounded-full bg-ocean-300/15 px-2 py-0.5 text-[10px] font-medium text-ocean-300">
                Admin
              </span>
            )}
          </p>
          <p className="truncate text-xs text-ocean-400">
            {profile.username ? `@${profile.username}` : "Belum ada username"}
          </p>
        </div>

        {!isSelf && !confirming && (
          <button
            onClick={() => setConfirming(true)}
            aria-label={`Hapus ${profile.display_name}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-600 transition active:bg-red-500/20"
          >
            🗑
          </button>
        )}
      </div>

      {confirming && (
        <div className="mt-3 rounded-xl bg-red-500/10 p-3">
          <p className="text-xs text-red-300">
            Hapus akun {profile.display_name} secara permanen? Semua sesi login mereka akan berakhir.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-medium text-white disabled:opacity-50"
            >
              {deleting ? "Menghapus..." : "Ya, hapus"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="flex-1 rounded-lg bg-black/[0.05] py-2 text-xs font-medium text-ocean-200"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
