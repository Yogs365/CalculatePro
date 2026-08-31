function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-black/[0.05] ${className}`} />;
}

// One skeleton row shaped like ChatListItem / ContactListItem, so the list
// doesn't jump/reflow once real data replaces it.
export function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-black/[0.05]" />
      <div className="min-w-0 flex-1 space-y-2">
        <Bar className="h-3.5 w-2/5" />
        <Bar className="h-3 w-3/5" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-ocean-900">
      {Array.from({ length: rows }).map((_, i) => (
        <ListRowSkeleton key={i} />
      ))}
    </div>
  );
}

// Round avatar-only skeleton, for the online carousel.
export function AvatarSkeleton() {
  return (
    <div className="flex w-16 shrink-0 flex-col items-center gap-1.5">
      <div className="h-14 w-14 animate-pulse rounded-full bg-black/[0.05]" />
      <Bar className="h-2.5 w-10" />
    </div>
  );
}
