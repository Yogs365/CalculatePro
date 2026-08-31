import ResolvedAvatar from "@/components/ui/ResolvedAvatar";
import type { ChatSummary } from "@/lib/supabase/types";

const TYPE_PREVIEW: Record<string, string> = {
  image: "📷 Foto",
  video: "🎥 Video",
  audio: "🎵 Audio",
  file: "📎 File",
  voice_note: "🎤 Pesan suara",
};

function formatTime(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

interface ChatListItemProps {
  chat: ChatSummary;
  onClick: () => void;
}

export default function ChatListItem({ chat, onClick }: ChatListItemProps) {
  const preview =
    chat.last_message_type && chat.last_message_type !== "text"
      ? TYPE_PREVIEW[chat.last_message_type] ?? chat.last_message_content
      : chat.last_message_content;

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:scale-[0.99] active:bg-black/[0.04]"
    >
      <ResolvedAvatar
        name={chat.chat_name ?? "?"}
        avatarPath={chat.avatar_url}
        online={chat.is_group ? undefined : chat.is_online}
        size="md"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-medium text-ocean-50">{chat.chat_name ?? "Chat"}</p>
          <span
            className={`shrink-0 text-xs ${
              chat.unread_count > 0 ? "font-medium text-ocean-300" : "text-ocean-500"
            }`}
          >
            {formatTime(chat.last_message_at)}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={`truncate text-sm ${
              chat.unread_count > 0 ? "text-ocean-200" : "text-ocean-400"
            }`}
          >
            {preview ?? "Belum ada pesan"}
          </p>
          {chat.unread_count > 0 && (
            <span className="premium-cta glossy-btn flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-semibold text-ocean-950">
              {chat.unread_count > 99 ? "99+" : chat.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
