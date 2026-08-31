"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export default function BottomNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  // Hide the bottom nav while inside a single chat room (/pesan/<chatId>).
  // ChatRoom owns its own bottom-docked input bar there, and a fixed nav on
  // top of it would cover the input - same reason WhatsApp etc. hide their
  // tab bar inside a conversation. /pesan itself (the list) still shows it.
  const inChatRoom = /^\/pesan\/[^/]+$/.test(pathname ?? "");
  if (inChatRoom) return null;

  const items: NavItem[] = [
    { href: "/pesan", label: "Pesan", icon: "/brand/icon-pesan.png" },
    { href: "/kontak", label: "Kontak", icon: "/brand/icon-kontak.png" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: "/brand/icon-menu.png" }] : []),
    { href: "/profile", label: "Profile", icon: "/brand/icon-profil.png" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
      <ul className="premium-nav-island mx-auto flex max-w-md items-stretch justify-around gap-1 rounded-[1.75rem] px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`relative mx-auto flex flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-white/80 text-ocean-300 shadow-[0_4px_14px_rgba(91,12,112,0.12)] ring-1 ring-white"
                    : "text-ocean-600 active:bg-white/40 active:text-ocean-400"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-[1.15rem] leading-none transition ${
                    active ? "bg-ocean-300/12" : "bg-white/25"
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain drop-shadow-[0_2px_4px_rgba(91,12,112,0.25)]"
                    style={{ opacity: active ? 1 : 0.55 }}
                  />
                </span>
                {item.label}
                {active && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-ocean-300" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
