import Image from "next/image";
import { AvatarSkeleton, ListSkeleton } from "@/components/ui/Skeleton";

export default function MessagesLoading() {
  return (
    <div className="mx-auto max-w-md px-3 pb-4 pt-[calc(1.25rem+env(safe-area-inset-top))] animate-fade-in">
      <div className="mb-5 flex items-center justify-between px-1">
        <Image
          src="/brand/logo-header-calculator.svg"
          alt="Calculator Pro"
          width={200}
          height={100}
          className="h-12 w-auto object-contain"
          priority
        />
        <div className="h-11 w-11 rounded-full bg-black/[0.05] animate-pulse" />
      </div>
      <div className="premium-glass overflow-hidden rounded-[1.75rem]">
        <div className="border-b border-black/[0.06] pb-3 pt-4">
          <div className="mb-2.5 px-4">
            <div className="h-4 w-28 rounded-full bg-black/[0.05] animate-pulse" />
          </div>
          <div className="flex gap-3 overflow-hidden px-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <AvatarSkeleton key={index} />
            ))}
          </div>
        </div>
        <ListSkeleton rows={5} />
      </div>
    </div>
  );
}