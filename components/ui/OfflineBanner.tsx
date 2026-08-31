"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function OfflineBanner() {
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-amber-500/15 px-4 py-2 text-xs font-medium text-amber-300"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Tidak ada koneksi internet - beberapa fitur mungkin tidak berfungsi
    </div>
  );
}
