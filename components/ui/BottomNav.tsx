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
    <nav className="fixed inset-x-0 bottom-0 z-20 pb-[env(safe-area-inset-bottom)]">
      <ul className="premium-nav-island mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="flex-1 py-1">
              <Link
                href={item.href}
                className={`mx-auto flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-medium transition ${
                  active ? "text-ocean-300" : "text-ocean-600 active:text-ocean-400"
                }`}
              >
                <span
                  className={`flex h-[76px] w-[76px] items-center justify-center rounded-full leading-none transition ${
                    active ? "bg-ocean-300/12" : ""
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] object-contain drop-shadow-[0_3px_6px_rgba(91,12,112,0.25)]"
                    style={{ opacity: active ? 1 : 0.55 }}
                  />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
