export type ChatListItemData = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  isTyping?: boolean;
  isActive?: boolean;
};

function Avatar({ name, isOnline }: { name: string; isOnline?: boolean }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="relative shrink-0">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1F6F63] text-sm font-semibold text-[#EAF4F2]">
        {initial}
      </div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0E1116] bg-[#E3B341]" />
      )}
    </div>
  );
}

export function ChatListItem({ chat }: { chat: ChatListItemData }) {
  return (
    <button
      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
        chat.isActive ? "bg-[#171B22]" : "hover:bg-[#12151b]"
      }`}
    >
      <Avatar name={chat.name} isOnline={chat.isOnline} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[13.5px] font-medium text-[#E7E9EA]">
            {chat.name}
          </span>
          <span className="shrink-0 text-[11px] tabular-nums text-[#6B7280]">
            {chat.timestamp}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          {chat.isTyping ? (
            <span className="truncate text-[12.5px] italic text-[#E3B341]">
              mengetik...
            </span>
          ) : (
            <span className="truncate text-[12.5px] text-[#8B94A0]">
              {chat.lastMessage}
            </span>
          )}
          {!!chat.unreadCount && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#E3B341] px-1.5 text-[11px] font-semibold text-[#0E1116]">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export function ChatList({ chats }: { chats: ChatListItemData[] }) {
  return (
    <div className="flex h-full flex-col divide-y divide-[#171B22]">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
}
