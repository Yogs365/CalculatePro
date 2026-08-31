"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import { getAvatarSignedUrl } from "@/features/admin/listUsers";

interface ResolvedAvatarProps {
  name: string;
  avatarPath?: string | null;
  online?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

// avatars bucket is private, so avatar_url in the DB is a storage path, not
// a usable <img> src. This resolves it to a signed URL on mount.
export default function ResolvedAvatar({ name, avatarPath, online, size }: ResolvedAvatarProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!avatarPath) {
      setSignedUrl(null);
      return;
    }
    getAvatarSignedUrl(avatarPath).then((url) => {
      if (active) setSignedUrl(url);
    });
    return () => {
      active = false;
    };
  }, [avatarPath]);

  return <Avatar name={name} avatarUrl={signedUrl} online={online} size={size} />;
}
