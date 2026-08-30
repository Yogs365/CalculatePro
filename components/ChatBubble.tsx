import { IconCheck, IconDoubleCheck, IconReply } from "./icons";

export type MessageStatus = "sent" | "delivered" | "read";

export type MessageData = {
  id: string;
  content: string;
  isOwn: boolean;
  timestamp: string;
  status?: MessageStatus;
  replyTo?: { sender: string; content: string };
  editedAt?: string;
  deletedAt?: string;
  reaction?: string;
};

function StatusTicks({ status }: { status?: MessageStatus }) {
  if (!status) return null;
  if (status === "sent") {
    return <IconCheck className="h-3 w-3 text-[#8B94A0]" />;
  }
  const colorClass = status === "read" ? "text-[#E3B341]" : "text-[#8B94A0]";
  return <IconDoubleCheck className={`h-3 w-3 ${colorClass}`} />;
}

export function ChatBubble({ message }: { message: MessageData }) {
  if (message.deletedAt) {
    return (
      <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[75%] rounded-2xl bg-[#171B22] px-3.5 py-2 text-[13px] italic text-[#6B7280]">
          Pesan telah dihapus
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
      <div className="relative max-w-[75%]">
        {/* Toolbar aksi: reply / copy — muncul saat hover */}
        <div
          className={`pointer-events-none absolute -top-8 flex items-center gap-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 ${
            message.isOwn ? "right-0" : "left-0"
          }`}
        >
          <button
            title="Balas"
            className="rounded-full bg-[#171B22] p-1.5 text-[#8B94A0] hover:text-[#E7E9EA]"
          >
            <IconReply className="h-3.5 w-3.5" />
          </button>
          <button
            title="Salin"
            className="rounded-full bg-[#171B22] px-2 py-1 text-[11px] text-[#8B94A0] hover:text-[#E7E9EA]"
          >
            Salin
          </button>
          {message.isOwn && (
            <>
              <button
                title="Edit"
                className="rounded-full bg-[#171B22] px-2 py-1 text-[11px] text-[#8B94A0] hover:text-[#E7E9EA]"
              >
                Edit
              </button>
              <button
                title="Hapus"
                className="rounded-full bg-[#171B22] px-2 py-1 text-[11px] text-[#8B94A0] hover:text-red-400"
              >
                Hapus
              </button>
            </>
          )}
        </div>

        <div
          className={`rounded-2xl px-3.5 py-2 ${
            message.isOwn
              ? "rounded-br-sm bg-[#1F6F63] text-[#EAF4F2]"
              : "rounded-bl-sm bg-[#232830] text-[#E7E9EA]"
          }`}
        >
          {message.replyTo && (
            <div className="mb-1.5 rounded-md border-l-2 border-[#E3B341] bg-black/15 px-2 py-1">
              <p className="text-[11px] font-medium text-[#E3B341]">
                {message.replyTo.sender}
              </p>
              <p className="truncate text-[12px] opacity-80">
                {message.replyTo.content}
              </p>
            </div>
          )}

          <p className="whitespace-pre-wrap break-words text-[14px] leading-snug">
            {message.content}
          </p>

          <div className="mt-1 flex items-center justify-end gap-1">
            {message.editedAt && (
              <span className="text-[10px] italic opacity-60">diedit</span>
            )}
            <span className="text-[10px] tabular-nums opacity-70">
              {message.timestamp}
            </span>
            {message.isOwn && <StatusTicks status={message.status} />}
          </div>
        </div>

        {message.reaction && (
          <div
            className={`absolute -bottom-2.5 rounded-full border-2 border-[#0E1116] bg-[#171B22] px-1 text-[11px] ${
              message.isOwn ? "right-2" : "left-2"
            }`}
          >
            {message.reaction}
          </div>
        )}
      </div>
    </div>
  );
}
