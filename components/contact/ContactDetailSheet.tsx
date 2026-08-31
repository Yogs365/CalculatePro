"use client";

import { useEffect, useState } from "react";
import ResolvedAvatar from "@/components/ui/ResolvedAvatar";
import { getContactSettings, setContactMuted, setContactBlocked } from "@/features/contact/contacts";
import type { ContactRow } from "@/lib/supabase/types";

interface ContactDetailSheetProps {
  contact: ContactRow;
  onClose: () => void;
  onChat: () => void;
  onBlockedChange: (blocked: boolean) => void;
}

export default function ContactDetailSheet({ contact, onClose, onChat, onBlockedChange }: ContactDetailSheetProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(contact.is_blocked_by_me);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    getContactSettings(contact.user_id).then((settings) => {
      if (active) {
        setIsMuted(settings.is_muted);
        setIsBlocked(settings.is_blocked);
      }
    });
    return () => {
      active = false;
    };
  }, [contact.user_id]);

  async function toggleMute() {
    setBusy(true);
    try {
      await setContactMuted(contact.user_id, !isMuted);
      setIsMuted(!isMuted);
    } finally {
      setBusy(false);
    }
  }

  async function toggleBlock() {
    setBusy(true);
    try {
      await setContactBlocked(contact.user_id, !isBlocked);
      setIsBlocked(!isBlocked);
      onBlockedChange(!isBlocked);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="premium-glass glossy-surface w-full animate-fade-in-scale rounded-t-[2rem] p-6 pb-[calc(2rem+env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/15" />

        <div className="flex flex-col items-center text-center">
          <ResolvedAvatar name={contact.display_name} avatarPath={contact.avatar_url} online={contact.is_online} size="xl" />
          <h2 className="mt-3 font-display text-lg text-ocean-50">{contact.display_name}</h2>
          {contact.username && <p className="text-sm text-ocean-400">@{contact.username}</p>}
          {contact.bio && <p className="mt-1 max-w-xs text-sm text-ocean-300">{contact.bio}</p>}
          <p className={`mt-1 text-xs ${contact.is_online ? "text-online" : "text-ocean-500"}`}>
            {contact.is_online ? "Online" : "Offline"}
          </p>
        </div>

        {contact.has_blocked_me ? (
          <p className="mt-6 text-center text-sm text-ocean-500">
            Kamu tidak dapat mengirim pesan ke kontak ini.
          </p>
        ) : (
          <button onClick={onChat} className="premium-cta glossy-btn mt-6 w-full rounded-2xl py-3 text-sm font-medium text-ocean-950 transition active:scale-[0.99]">
            Kirim Pesan
          </button>
        )}

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={toggleMute}
            disabled={busy}
            className="glossy-chip rounded-2xl border border-black/[0.08] bg-ocean-900/70 py-3 text-sm text-ocean-200 disabled:opacity-50"
          >
            {isMuted ? "Aktifkan Notif" : "Bisukan"}
          </button>
          <button
            onClick={toggleBlock}
            disabled={busy}
            className="rounded-2xl border border-red-500/15 bg-red-500/10 py-3 text-sm text-red-600 disabled:opacity-50"
          >
            {isBlocked ? "Buka Blokir" : "Blokir"}
          </button>
        </div>
      </div>
    </div>
  );
}
