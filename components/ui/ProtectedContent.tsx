"use client";

import { usePathname } from "next/navigation";

// Mirrors BottomNav's own visibility rule: no nav -> no reserved space for
// it either, otherwise a chat room would show a blank gap where the (now
// hidden) nav used to be.
export default function ProtectedContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inChatRoom = /^\/pesan\/[^/]+$/.test(pathname ?? "");

  return (
    <div
      className={`min-h-0 flex-1 ${
        inChatRoom ? "overflow-hidden" : "overflow-y-auto pb-[calc(7.5rem+env(safe-area-inset-bottom))] thin-scrollbar"
      }`}
    >
      {children}
    </div>
  );
}
