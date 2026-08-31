interface ErrorRetryProps {
  message?: string;
  onRetry: () => void;
}

// Generic "gagal memuat" state with a retry button. Used anywhere a
// Supabase call to load a list can fail (chat list, contact list, admin
// list) so a network hiccup doesn't just silently render "belum ada data".
export default function ErrorRetry({ message = "Gagal memuat data", onRetry }: ErrorRetryProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 py-10 text-center animate-fade-in">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-black/[0.03] text-3xl">⚠️</span>
      <p className="text-sm text-ocean-300">{message}</p>
      <p className="mt-1 text-xs text-ocean-500">Periksa koneksi internet kamu.</p>
      <button
        onClick={onRetry}
        className="premium-cta glossy-btn mt-4 rounded-xl px-5 py-2.5 text-sm font-medium text-ocean-950 transition active:scale-95"
      >
        Coba Lagi
      </button>
    </div>
  );
}
