"use client";

import { useState } from "react";
import { IconMic, IconPaperclip, IconSend, IconSmile } from "./icons";

export function MessageInput() {
  const [value, setValue] = useState("");
  const hasText = value.trim().length > 0;

  return (
    <div className="flex items-end gap-2 border-t border-[#171B22] bg-[#0E1116] px-3 py-2.5">
      <button
        title="Emoji"
        className="shrink-0 rounded-full p-2 text-[#8B94A0] hover:bg-[#171B22] hover:text-[#E7E9EA]"
      >
        <IconSmile className="h-5 w-5" />
      </button>
      <button
        title="Lampiran"
        className="shrink-0 rounded-full p-2 text-[#8B94A0] hover:bg-[#171B22] hover:text-[#E7E9EA]"
      >
        <IconPaperclip className="h-5 w-5" />
      </button>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tulis pesan..."
        className="min-w-0 flex-1 rounded-full bg-[#171B22] px-4 py-2.5 text-[14px] text-[#E7E9EA] placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#1F6F63]"
      />

      <button
        title={hasText ? "Kirim" : "Rekam suara"}
        className="shrink-0 rounded-full bg-[#1F6F63] p-2.5 text-[#EAF4F2] hover:bg-[#256E62]"
      >
        {hasText ? (
          <IconSend className="h-5 w-5" />
        ) : (
          <IconMic className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
