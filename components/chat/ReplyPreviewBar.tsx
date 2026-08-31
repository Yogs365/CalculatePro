interface ReplyPreviewBarProps {
  senderLabel: string;
  snippet: string;
  onCancel: () => void;
}

export default function ReplyPreviewBar({ senderLabel, snippet, onCancel }: ReplyPreviewBarProps) {
  return (
    <div className="glossy-surface flex items-center gap-2 border-t border-black/[0.08] bg-ocean-900/70 px-3 py-2 backdrop-blur-lg">
      <div className="h-8 w-0.5 shrink-0 rounded-full bg-ocean-300" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-ocean-300">Membalas {senderLabel}</p>
        <p className="truncate text-xs text-ocean-500">{snippet}</p>
      </div>
      <button
        onClick={onCancel}
        aria-label="Batalkan balasan"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.03] text-ocean-400"
      >
        ✕
      </button>
    </div>
  );
}
