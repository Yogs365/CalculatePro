"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { createClient } from "@/lib/supabase/client";
import ResolvedAvatar from "@/components/ui/ResolvedAvatar";
import SettingsRow from "@/components/ui/SettingsRow";
import PushNotificationToggle from "@/components/notification/PushNotificationToggle";
import InstallPwaButton from "@/components/profile/InstallPwaButton";
import Image from "next/image";

// Only ever needed after a tap ("Informasi Profile" / "Set Kode Akses") —
// loaded on demand instead of shipping in every /profile page load.
const EditProfileSheet = dynamic(() => import("@/components/profile/EditProfileSheet"));
const ChangeAccessCodeSheet = dynamic(() => import("@/components/profile/ChangeAccessCodeSheet"));

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading, refreshProfile } = useSession();
  const [showEdit, setShowEdit] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  if (loading || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-ocean-400">
        Memuat...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-4 pt-[calc(1.5rem+env(safe-area-inset-top))] animate-fade-in">
      <div className="premium-glass mb-8 flex flex-col items-center rounded-[1.75rem] px-6 py-8 text-center">
        <ResolvedAvatar name={profile.display_name} avatarPath={profile.avatar_url} size="xl" />
        <h1 className="mt-4 font-display text-xl font-semibold text-ocean-50">{profile.display_name}</h1>
        {profile.username && <p className="text-sm text-ocean-400">@{profile.username}</p>}
        {profile.bio && (
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ocean-400">{profile.bio}</p>
        )}
        {profile.role === "admin" && (
          <span className="mt-3 rounded-full bg-ocean-300/12 px-3 py-1 text-[11px] font-medium tracking-wide text-ocean-300">
            Admin
          </span>
        )}
      </div>

      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ocean-500">Pengaturan</p>
      <div className="space-y-2.5">
        <SettingsRow
          icon={<Image src="/brand/icon-profil.png" alt="" width={20} height={20} className="h-5 w-5" />}
          title="Informasi Profile"
          subtitle="Nama, username, foto"
          onClick={() => setShowEdit(true)}
        />
        <SettingsRow
          icon="🛡️"
          title="Set Kode Akses"
          subtitle="Ubah kode akses login"
          onClick={() => setShowAccessCode(true)}
        />
        <PushNotificationToggle userId={profile.id} />
        <InstallPwaButton />
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full rounded-2xl border border-red-500/15 bg-red-500/10 px-4 py-3.5 text-sm font-medium text-red-600 transition active:scale-[0.99] active:bg-red-500/20"
      >
        Keluar dari Akun
      </button>

      {showEdit && (
        <EditProfileSheet
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSaved={async () => {
            await refreshProfile();
            setShowEdit(false);
          }}
        />
      )}

      {showAccessCode && <ChangeAccessCodeSheet onClose={() => setShowAccessCode(false)} />}
    </div>
  );
}
