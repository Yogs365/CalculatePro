"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getMyChats } from "@/features/chat/chats";
import type { ChatSummary } from "@/lib/supabase/types";
import ChatListItem from "@/components/chat/ChatListItem";
import { ListSkeleton } from "@/components/ui/Skeleton";
import ErrorRetry from "@/components/ui/ErrorRetry";
import Image from "next/image";

export default function ChatList() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatSummary[] | null>(null);
  const [error, setError] = useState(false);
  const reloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefetchedChatIds = useRef(new Set<string>());

  const reload = useCallback(async () => {
    try {
      const data = await getMyChats();
      setChats(data);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  const scheduleReload = useCallback(() => {
    if (reloadTimer.current !== null) return;

    reloadTimer.current = setTimeout(() => {
      reloadTimer.current = null;
      void reload();
    }, 180);
  }, [reload]);

  const prefetchChat = useCallback(
    (chatId: string) => {
      if (prefetchedChatIds.current.has(chatId)) return;
      prefetchedChatIds.current.add(chatId);
      router.prefetch(`/pesan/${chatId}`);
    },
    [router],
  );

  useEffect(() => {
    void reload();

    // get_my_chats() already aggregates last message + unread count, so the
    // simplest correct way to stay live is to re-run it whenever a message
    // or a chat row changes, rather than patch individual fields client-side.
    const supabase = createClient();
    const channel = supabase
      .channel("chat-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, scheduleReload)
      .on("postgres_changes", { event: "*", schema: "public", table: "chats" }, scheduleReload)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, scheduleReload)
      .subscribe();

    return () => {
      if (reloadTimer.current !== null) {
        clearTimeout(reloadTimer.current);
        reloadTimer.current = null;
      }
      supabase.removeChannel(channel);
    };
  }, [reload, scheduleReload]);

  if (error) {
    return <ErrorRetry message="Gagal memuat daftar pesan" onRetry={reload} />;
  }

  if (chats === null) {
    return <ListSkeleton />;
  }

  if (chats.length === 0) {
    return (
      <div className="flex min-h-[45vh] flex-col items-center justify-center px-6 py-10 text-center animate-fade-in">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ocean-300/10">
          <Image src="/brand/icon-pesan.png" alt="" width={32} height={32} className="h-8 w-8" />
        </span>
        <h1 className="font-display text-lg text-ocean-50">Belum Ada Pesan</h1>
        <p className="mt-1 max-w-xs text-sm text-ocean-400">
          Mulai chat dari tab Kontak.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-ocean-900">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.chat_id}
          chat={chat}
          onClick={() => router.push(`/pesan/${chat.chat_id}`)}
          onPrefetch={() => prefetchChat(chat.chat_id)}
        />
      ))}
    </div>
  );
}
