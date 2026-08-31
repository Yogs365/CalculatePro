export default function ChatRoomLoading() {
  return (
    <div className="flex h-full flex-col animate-fade-in">
      <div className="flex items-center gap-3 border-b border-black/[0.08] bg-ocean-900/90 px-4 py-3">
        <div className="h-9 w-9 rounded-full bg-black/[0.05] animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-4 w-28 rounded-full bg-black/[0.05] animate-pulse" />
          <div className="h-2.5 w-16 rounded-full bg-black/[0.05] animate-pulse" />
        </div>
      </div>
      <div className="flex-1 space-y-3 px-4 py-5">
        <div className="h-10 w-2/3 rounded-2xl bg-black/[0.05] animate-pulse" />
        <div className="ml-auto h-10 w-1/2 rounded-2xl bg-black/[0.05] animate-pulse" />
        <div className="h-12 w-3/5 rounded-2xl bg-black/[0.05] animate-pulse" />
      </div>
      <div className="h-14 border-t border-black/[0.08] bg-ocean-900/80" />
    </div>
  );
}