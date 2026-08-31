import Image from "next/image";
import { ListSkeleton } from "@/components/ui/Skeleton";

export default function ProtectedLoading() {
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
        <ListSkeleton rows={6} />
      </div>
    </div>
  );
}