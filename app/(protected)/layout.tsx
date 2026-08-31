import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/ui/BottomNav";
import HeartbeatClient from "@/components/notification/HeartbeatClient";
import OfflineBanner from "@/components/ui/OfflineBanner";
import ProtectedContent from "@/components/ui/ProtectedContent";

// Guards every route under (protected): /pesan, /kontak, /profile, /admin.
// No session -> straight back to /login. This runs on the server, reading
// the cookie-based session that middleware.ts keeps fresh.
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden ocean-bg">
      <div className="relative z-10 flex h-full flex-col">
        <HeartbeatClient />
        <OfflineBanner />
        <ProtectedContent>{children}</ProtectedContent>
        <BottomNav isAdmin={profile?.role === "admin"} />
      </div>
    </div>
  );
}
