"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { getMessages, sendMessage, markChatRead, subscribeToChatMessages } from "@/features/chat/messages";
import { uploadChatMedia } from "@/features/chat/media";
import type { Message } from "@/lib/supabase/types";
import MessageBubble from "@/components/chat/MessageBubble";
import ReplyPreviewBar from "@/components/chat/ReplyPreviewBar";
import ResolvedAvatar from "@/components/ui/ResolvedAvatar";

const QUICK_EMOJI = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

interface ChatRoomProps {
  chatId: string;
  peerName: string;
  peerAvatar?: string | null;
  peerOnline?: boolean;
}

function messageSnippet(message: Message): string {
  if (message.message_type === "image") return "📷 Foto";
  if (message.message_type !== "text") return "Media";
  return message.content?.slice(0, 80) || "";
}

export default function ChatRoom({ chatId, peerName, peerAvatar, peerOnline }: ChatRoomProps) {
  const router = useRouter();
  const { user } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendingImage, setSendingImage] = useState(false);
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    getMessages(chatId).then((data) => {
      if (!active) return;
      setMessages(data);
      setLoading(false);
      markChatRead(chatId).catch(() => {});
    });

    const unsubscribe = subscribeToChatMessages(chatId, (incoming) => {
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === incoming.id || m.client_id === incoming.client_id);
        if (idx === -1) return [...prev, incoming];
        const next = [...prev];
        next[idx] = incoming;
        return next;
      });
      // A message arrived while the room is open on screen - mark it read
      // immediately rather than waiting for the next visit.
      markChatRead(chatId).catch(() => {});
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function handlePickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || sendingImage) return;

    const clientId = crypto.randomUUID();
    const optimistic: Message = {
      id: clientId,
      client_id: clientId,
      chat_id: chatId,
      sender_id: user?.id ?? "",
      content: null,
      message_type: "image",
      media_url: null,
      reply_to_id: null,
      status: "pending",
      created_at: new Date().toISOString(),
      edited_at: null,
      deleted_at: null,
    };

    setMessages((prev) => [...prev, optimistic]);
    setSendingImage(true);

    try {
      const path = await uploadChatMedia(chatId, file);
      const saved = await sendMessage({
        clientId,
        chatId,
        content: "",
        messageType: "image",
        mediaUrl: path,
      });
      setMessages((prev) => prev.map((m) => (m.client_id === clientId ? saved : m)));
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.client_id === clientId ? { ...m, status: "failed" } : m)),
      );
    } finally {
      setSendingImage(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;

    const clientId = crypto.randomUUID();
    const replyToId = replyTarget?.id ?? null;
    const optimistic: Message = {
      id: clientId,
      client_id: clientId,
      chat_id: chatId,
      sender_id: user?.id ?? "",
      content,
      message_type: "text",
      media_url: null,
      reply_to_id: replyToId,
      status: "pending",
      created_at: new Date().toISOString(),
      edited_at: null,
      deleted_at: null,
    };

    setMessages((prev) => [...prev, optimistic]);
    setDraft("");
    setReplyTarget(null);
    setSending(true);

    try {
      const saved = await sendMessage({ clientId, chatId, content, replyToId });
      setMessages((prev) => prev.map((m) => (m.client_id === clientId ? saved : m)));
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.client_id === clientId ? { ...m, status: "failed" } : m)),
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="ocean-bg flex h-full min-h-0 flex-col">
      <div className="glossy-surface sticky top-0 z-10 flex shrink-0 items-center gap-3 overflow-hidden rounded-b-[1.5rem] border-b border-white/70 bg-gradient-to-r from-white/95 via-ocean-900/95 to-[#F9E8FF]/90 px-3 py-3 shadow-[0_8px_24px_rgba(91,12,112,0.12)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-40 rounded-full bg-ocean-300/15 blur-2xl" />
        <button
          onClick={() => router.push("/pesan")}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/75 text-lg text-ocean-300 shadow-sm ring-1 ring-black/[0.05] transition hover:bg-white active:scale-90"
          aria-label="Kembali"
        >
          ←
        </button>
        <div className="relative flex min-w-0 flex-1 items-center gap-2.5">
          <ResolvedAvatar name={peerName} avatarPath={peerAvatar ?? null} online={peerOnline} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[15px] font-semibold leading-tight text-ocean-50">{peerName}</p>
            <p
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium leading-tight ${
                peerOnline
                  ? "bg-online/10 text-online"
                  : peerOnline === false
                    ? "bg-black/[0.04] text-ocean-500"
                    : "bg-black/[0.03] text-ocean-500"
              }`}
            >
              {peerOnline !== undefined && (
                <span className={`h-1.5 w-1.5 rounded-full ${peerOnline ? "bg-online" : "bg-ocean-500"}`} />
              )}
              {peerOnline === undefined ? " " : peerOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-4 thin-scrollbar">
        {loading ? (
          <div className="space-y-2 pt-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div
                  className="h-9 animate-pulse rounded-2xl bg-black/[0.03]"
                  style={{ width: `${45 + (i % 3) * 15}%` }}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="pt-10 text-center text-sm text-ocean-500">Belum ada pesan. Mulai obrolan!</p>
        ) : (
          messages.map((m) => {
            const target = m.reply_to_id ? messages.find((x) => x.id === m.reply_to_id) : null;
            const replyPreview = m.reply_to_id
              ? {
                  senderLabel: target ? (target.sender_id === user?.id ? "Kamu" : peerName) : "Pesan",
                  snippet: target ? messageSnippet(target) : "Pesan tidak tersedia",
                }
              : null;
            return (
              <MessageBubble
                key={m.id}
                message={m}
                isMine={m.sender_id === user?.id}
                replyPreview={replyPreview}
                onReply={setReplyTarget}
              />
            );
          })
        )}
        <div ref={bottomRef} className="h-px" />
      </div>

      {replyTarget && (
        <div className="shrink-0">
          <ReplyPreviewBar
            senderLabel={replyTarget.sender_id === user?.id ? "diri sendiri" : peerName}
            snippet={messageSnippet(replyTarget)}
            onCancel={() => setReplyTarget(null)}
          />
        </div>
      )}

      {showEmoji && (
        <div className="flex shrink-0 gap-2 border-t border-black/[0.08] bg-ocean-950/90 px-3 py-2.5 backdrop-blur-lg">
          {QUICK_EMOJI.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setDraft((d) => d + emoji);
                setShowEmoji(false);
              }}
              className="rounded-xl bg-ocean-900 px-2.5 py-1.5 text-lg transition active:scale-90"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {voiceNotice && (
        <p className="shrink-0 border-t border-black/[0.08] bg-ocean-900/60 px-3 py-1.5 text-center text-xs text-ocean-400">
          Pesan suara segera hadir.
        </p>
      )}

      <form
        onSubmit={handleSend}
        className="glossy-surface sticky bottom-0 z-10 flex shrink-0 items-end gap-2 border-t border-black/[0.08] bg-ocean-950/85 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePickImage}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={sendingImage}
          className="glossy-chip shrink-0 rounded-2xl border border-black/[0.08] bg-ocean-900/70 px-3 py-2.5 text-sm text-ocean-300 transition active:scale-95 disabled:opacity-40"
          aria-label="Kirim gambar"
        >
          {sendingImage ? "…" : "📷"}
        </button>
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className={`glossy-chip shrink-0 rounded-2xl border border-black/[0.08] px-3 py-2.5 text-sm text-ocean-300 transition active:scale-95 ${
            showEmoji ? "bg-ocean-800" : "bg-ocean-900/70"
          }`}
          aria-label="Emoji"
        >
          😊
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tulis pesan..."
          className="glossy-chip min-w-0 flex-1 rounded-2xl border border-black/[0.08] bg-ocean-900/70 px-4 py-2.5 text-sm text-ocean-50 outline-none transition focus:border-ocean-300 focus:ring-2 focus:ring-ocean-300/30"
        />
        {draft.trim() ? (
          <button
            type="submit"
            disabled={sending}
            className="premium-cta glossy-btn shrink-0 rounded-2xl px-4 py-2.5 text-sm font-medium text-ocean-950 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Kirim
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setVoiceNotice((v) => !v)}
            className="glossy-chip shrink-0 rounded-2xl border border-black/[0.08] bg-ocean-900/70 px-3 py-2.5 text-sm text-ocean-300 transition active:scale-95"
            aria-label="Rekam pesan suara"
          >
            🎤
          </button>
        )}
      </form>
    </div>
  );
}
