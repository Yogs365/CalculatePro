import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ChatSummary } from "@/lib/supabase/types";
import ChatRoom from "@/components/chat/ChatRoom";

interface PageProps {
  params: { chatId: string };
}

export default async function ChatRoomPage({ params }: PageProps) {
  const supabase = createClient();
  // get_my_chats() is RLS-safe and already scoped to the caller, so this
  // also acts as an authorization check: if the chat isn't in the list,
  // the user isn't a participant (or it doesn't exist) -> 404.
  const { data } = await supabase.rpc("get_my_chats");
  const chat = (data as ChatSummary[] | null)?.find((c) => c.chat_id === params.chatId);

  if (!chat) {
    notFound();
  }

  return (
    <ChatRoom
      chatId={params.chatId}
      peerName={chat.chat_name ?? "Chat"}
      peerAvatar={chat.avatar_url}
      peerOnline={chat.is_group ? undefined : chat.is_online}
    />
  );
}
