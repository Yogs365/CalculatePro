import Link from "next/link";
import Image from "next/image";
import ChatList from "@/components/chat/ChatList";
import OnlineCarousel from "@/components/chat/OnlineCarousel";

export default function PesanPage() {
  return (
    <div className="mx-auto max-w-md px-3 pb-4 pt-[calc(1.25rem+env(safe-area-inset-top))] animate-fade-in">
      <div className="mb-5 flex items-center justify-between px-1">
        <Image
          src="/brand/logo-header-calculator.svg"
          alt="Calculator Pro"
          width={200}
          height={100}
          className="h-12 w-auto object-contain drop-shadow-[0_4px_8px_rgba(91,12,112,0.12)]"
          priority
        />
        <Link
          href="/profile"
          aria-label="Pengaturan"
          className="glossy-chip flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.08] bg-black/[0.03] text-lg text-ocean-300 transition active:scale-95 active:bg-black/[0.05]"
        >
          ⚙️
        </Link>
      </div>

      <div className="premium-glass glossy-surface overflow-hidden rounded-[1.75rem]">
        <OnlineCarousel />
        <ChatList />
      </div>
    </div>
  );
}
