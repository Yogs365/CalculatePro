"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAllContacts } from "@/features/contact/contacts";
import { getOrCreateDirectChat } from "@/features/chat/chats";
import type { ContactRow } from "@/lib/supabase/types";
import ResolvedAvatar from "@/components/ui/ResolvedAvatar";
import { AvatarSkeleton } from "@/components/ui/Skeleton";

// Row of currently-online contacts above the chat list, tap to jump straight
// into (or create) a direct chat with them. Source: profiles.last_seen_at
// (via get_all_contacts' is_online, which is fed by heartbeat()), so this
// updates live off the same realtime channel the contact list uses.
export default function OnlineCarousel() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactRow[] | null>(null);
  const [opening, setOpening] = useState<string | null>(null);

  async function reload() {
    try {
      const all = await getAllContacts();
      setContacts(all.filter((c) => c.is_online && !c.has_blocked_me));
    } catch {
      setContacts((prev) => prev ?? []);
    }
  }

  useEffect(() => {
    reload();

    const supabase = createClient();
    const channel = supabase
      .channel("online-carousel")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, reload)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openChat(contact: ContactRow) {
    if (opening) return;
    setOpening(contact.user_id);
    try {
      const chatId = await getOrCreateDirectChat(contact.user_id);
      router.push(`/pesan/${chatId}`);
    } finally {
      setOpening(null);
    }
  }

  if (contacts === null) {
    return (
      <div className="border-b border-black/[0.06] pb-3 pt-4">
        <div className="mb-2.5 flex items-center justify-between px-4">
          <p className="text-sm font-semibold tracking-wide text-ocean-50">Sedang Online</p>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <AvatarSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (contacts.length === 0) return null;

  return (
    <div className="border-b border-black/[0.06] pb-3 pt-4">
      <div className="mb-2.5 flex items-center justify-between px-4">
        <p className="text-sm font-semibold tracking-wide text-ocean-50">Sedang Online</p>
        <Link href="/kontak" className="text-xs font-medium text-ocean-300 transition active:text-ocean-200">
          Lihat semua ›
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {contacts.map((c) => (
          <button
            key={c.user_id}
            onClick={() => openChat(c)}
            disabled={opening === c.user_id}
            className="flex w-16 shrink-0 flex-col items-center gap-1.5 transition active:scale-95 disabled:opacity-60"
          >
            <ResolvedAvatar name={c.display_name} avatarPath={c.avatar_url} online size="lg" />
            <span className="max-w-full truncate text-[11px] text-ocean-300">
              {c.display_name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
