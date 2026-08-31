"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { listAllUsers } from "@/features/admin/listUsers";
import AdminFab from "@/components/admin/AdminFab";
import UserListItem from "@/components/admin/UserListItem";
import type { Profile } from "@/lib/supabase/types";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, profile, isAdmin, loading } = useSession();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  async function refresh() {
    setLoadingUsers(true);
    setListError(null);
    try {
      setUsers(await listAllUsers());
    } catch {
      setListError("Gagal memuat daftar user");
    } finally {
      setLoadingUsers(false);
    }
  }

  // Member tidak boleh melihat tombol admin atau mengakses dashboard ini.
  // (protected)/layout.tsx doesn't hard-block /admin server-side, so this
  // client-side re-check is the real gate for this route.
  useEffect(() => {
    if (!loading && profile && !isAdmin) {
      router.replace("/pesan");
    }
  }, [loading, profile, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center text-sm text-ocean-400">
        Memuat...
      </div>
    );
  }

  if (!isAdmin) return null;

  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="px-4 pt-6 animate-fade-in">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ocean-50">
          Kelola Kontak
        </h1>
        <p className="mt-1 text-sm text-ocean-400">Kontak yang bisa masuk ke Calculator Pro.</p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="premium-glass rounded-2xl p-4">
          <p className="text-xs font-medium text-ocean-400">Total kontak</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ocean-50">
            {loadingUsers ? "…" : users.length}
          </p>
        </div>
        <div className="premium-glass rounded-2xl p-4">
          <p className="text-xs font-medium text-ocean-400">Admin</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ocean-50">
            {loadingUsers ? "…" : adminCount}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-ocean-300">
          Semua User {!loadingUsers && `(${users.length})`}
        </h2>
      </div>

      {loadingUsers && <p className="text-sm text-ocean-500">Memuat daftar user...</p>}
      {listError && <p className="text-sm text-red-600">{listError}</p>}

      <div className="space-y-2.5">
        {users.map((u) => (
          <UserListItem
            key={u.id}
            profile={u}
            currentUserId={user!.id}
            onDeleted={(id) => setUsers((prev) => prev.filter((p) => p.id !== id))}
          />
        ))}
      </div>

      {!loadingUsers && users.length === 0 && (
        <p className="mt-8 text-center text-sm text-ocean-500">Belum ada kontak terdaftar.</p>
      )}

      <AdminFab onRegistered={refresh} />
    </div>
  );
}
