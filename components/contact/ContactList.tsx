"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAllContacts } from "@/features/contact/contacts";
import { getOrCreateDirectChat } from "@/features/chat/chats";
import type { ContactRow } from "@/lib/supabase/types";
import ContactListItem from "@/components/contact/ContactListItem";
import { ListSkeleton } from "@/components/ui/Skeleton";
import ErrorRetry from "@/components/ui/ErrorRetry";
import Image from "next/image";

const ContactDetailSheet = dynamic(() => import("@/components/contact/ContactDetailSheet"));

export default function ContactList() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactRow[] | null>(null);
  const [selected, setSelected] = useState<ContactRow | null>(null);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  async function reload() {
    try {
      setContacts(await getAllContacts());
      setError(false);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    reload();

    // Online status lives on profiles.last_seen_at, refreshed by other
    // users' heartbeat() calls - listen for changes so presence dots update
    // without a manual refresh.
    const supabase = createClient();
    const channel = supabase
      .channel("contact-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_settings" }, reload)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openChat(contact: ContactRow) {
    if (contact.has_blocked_me || opening) return;
    setOpening(true);
    try {
      const chatId = await getOrCreateDirectChat(contact.user_id);
      router.push(`/pesan/${chatId}`);
    } finally {
      setOpening(false);
    }
  }

  if (error) {
    return <ErrorRetry message="Gagal memuat daftar kontak" onRetry={reload} />;
  }

  if (contacts === null) {
    return <ListSkeleton />;
  }

  if (contacts.length === 0) {
    return (
      <div className="flex min-h-[45vh] flex-col items-center justify-center px-6 py-10 text-center">
        <Image src="/brand/icon-kontak.png" alt="" width={48} height={48} className="mb-3 h-12 w-12 opacity-70" />
        <h1 className="font-display text-lg text-ocean-50">Belum Ada Kontak</h1>
        <p className="mt-1 max-w-xs text-sm text-ocean-400">
          Minta admin mendaftarkan kontak untukmu.
        </p>
      </div>
    );
  }

  // Purely a client-side, cosmetic filter over the already-fetched list —
  // no new query, no additional data source, matches the existing search UX.
  const filtered = query.trim()
    ? contacts.filter((c) => c.display_name.toLowerCase().includes(query.trim().toLowerCase()))
    : contacts;
  const online = filtered.filter((c) => c.is_online);
  const offline = filtered.filter((c) => !c.is_online);

  return (
    <>
      <div className="border-b border-black/[0.06] px-4 pb-3 pt-4">
        <div className="glossy-chip flex items-center gap-2 rounded-2xl border border-black/[0.08] bg-ocean-900/60 px-3.5 py-2.5">
          <span className="text-ocean-500">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kontak..."
            className="w-full bg-transparent text-sm text-ocean-50 outline-none placeholder:text-ocean-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-ocean-500">Tidak ada kontak yang cocok.</p>
      ) : (
        <>
          {online.length > 0 && (
            <div>
              <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-ocean-500">
                Online
              </p>
              <div className="divide-y divide-black/[0.06]">
                {online.map((c) => (
                  <ContactListItem key={c.user_id} contact={c} onClick={() => setSelected(c)} />
                ))}
              </div>
            </div>
          )}
          {offline.length > 0 && (
            <div>
              <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-ocean-500">
                Lainnya
              </p>
              <div className="divide-y divide-black/[0.06]">
                {offline.map((c) => (
                  <ContactListItem key={c.user_id} contact={c} onClick={() => setSelected(c)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {selected && (
        <ContactDetailSheet
          contact={selected}
          onClose={() => setSelected(null)}
          onChat={() => {
            setSelected(null);
            openChat(selected);
          }}
          onBlockedChange={(blocked) => {
            setContacts((prev) =>
              prev ? prev.map((c) => (c.user_id === selected.user_id ? { ...c, is_blocked_by_me: blocked } : c)) : prev,
            );
          }}
        />
      )}
    </>
  );
}
