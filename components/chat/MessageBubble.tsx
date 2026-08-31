"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/supabase/types";
import { getChatMediaSignedUrl } from "@/features/chat/media";

const LONG_PRESS_MS = 450;

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// Ticks always sit on the sent bubble (flat accent fill), so they use
// light-on-accent opacity steps rather than the page-level muted tokens.
function StatusTicks({ status }: { status: Message["status"] }) {
  if (status === "pending") return <span className="text-[11px] text-ocean-950/50">🕐</span>;
  if (status === "failed") return <span className="text-[11px] text-red-100">!</span>;
  if (status === "read") return <span className="text-[11px] text-ocean-950">✓✓</span>;
  if (status === "delivered") return <span className="text-[11px] text-ocean-950/60">✓✓</span>;
  return <span className="text-[11px] text-ocean-950/60">✓</span>;
}

const TYPE_LABEL: Record<string, string> = {
  video: "🎥 Video",
  audio: "🎵 Audio",
  file: "📎 File",
  voice_note: "🎤 Pesan suara",
};

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  replyPreview?: { senderLabel: string; snippet: string } | null;
  onReply?: (message: Message) => void;
}

export default function MessageBubble({ message, isMine, replyPreview, onReply }: MessageBubbleProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pressed, setPressed] = useState(false);

  function startPress() {
    if (!onReply || message.status === "pending" || message.status === "failed") return;
    pressTimer.current = setTimeout(() => {
      setPressed(true);
      onReply(message);
      if (navigator.vibrate) navigator.vibrate(15);
    }, LONG_PRESS_MS);
  }

  function cancelPress() {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    setTimeout(() => setPressed(false), 150);
  }

  useEffect(() => {
    let active = true;
    if (message.message_type === "image" && message.media_url) {
      getChatMediaSignedUrl(message.media_url).then((url) => {
        if (active) setImageUrl(url);
      });
    }
    return () => {
      active = false;
    };
  }, [message.message_type, message.media_url]);

  const isImage = message.message_type === "image";
  const otherMediaLabel =
    !isImage && message.message_type !== "text"
      ? message.media_url
        ? TYPE_LABEL[message.message_type]
        : `${TYPE_LABEL[message.message_type]} (mengunggah...)`
      : null;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        onPointerDown={startPress}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        className={`max-w-[75%] select-none rounded-[1.25rem] px-3.5 py-2 text-[15px] shadow-bubble transition ${
          isMine
            ? "premium-cta glossy-btn rounded-br-md text-ocean-950"
            : "glossy-chip rounded-bl-md border border-black/[0.08] bg-ocean-800/90 text-ocean-50"
        } ${isImage ? "p-1.5" : ""} ${pressed ? "scale-[0.98] opacity-80" : ""}`}
      >
        {replyPreview && (
          <div
            className={`mb-1.5 rounded-lg border-l-2 px-2 py-1 text-[13px] ${
              isMine ? "border-ocean-950/40 bg-ocean-950/10 text-ocean-950/70" : "border-ocean-300 bg-black/[0.03] text-ocean-300"
            }`}
          >
            <p className="font-medium">{replyPreview.senderLabel}</p>
            <p className="truncate opacity-80">{replyPreview.snippet}</p>
          </div>
        )}
        {isImage ? (
          imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Gambar" className="max-h-72 w-full rounded-xl object-cover" />
          ) : (
            <div className="flex h-40 w-56 items-center justify-center rounded-xl bg-ocean-900 text-xs text-ocean-500">
              {message.media_url ? "Memuat gambar..." : "Mengunggah..."}
            </div>
          )
        ) : (
          <p className="whitespace-pre-wrap break-words">{otherMediaLabel ?? message.content}</p>
        )}

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
            isImage ? "px-1.5 pb-0.5" : ""
          } ${isMine ? (isImage ? "text-ocean-950/70" : "text-ocean-950/60") : "text-ocean-400"}`}
        >
          <span>{formatTime(message.created_at)}</span>
          {isMine && <StatusTicks status={message.status} />}
        </div>
      </div>
    </div>
  );
}
