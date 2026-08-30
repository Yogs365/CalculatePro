import { ChatList, type ChatListItemData } from "@/components/ChatList";
import { ChatBubble, type MessageData } from "@/components/ChatBubble";
import { MessageInput } from "@/components/MessageInput";

const chats: ChatListItemData[] = [
  {
    id: "1",
    name: "Yoga (Admin)",
    lastMessage: "Oke siap, saya cek dulu ya",
    timestamp: "09:41",
    isOnline: true,
    isActive: true,
  },
  {
    id: "2",
    name: "Tim Ops",
    lastMessage: "Jadwal deploy besok jam berapa?",
    timestamp: "09:12",
    unreadCount: 3,
  },
  {
    id: "3",
    name: "Dinda",
    lastMessage: "",
    timestamp: "08:57",
    isTyping: true,
  },
  {
    id: "4",
    name: "Rangga",
    lastMessage: "Sudah aku transfer, cek ya",
    timestamp: "Kemarin",
  },
];

const messages: MessageData[] = [
  {
    id: "m1",
    content: "Pagi, backend-nya udah aku setup semua sesuai blueprint.",
    isOwn: false,
    timestamp: "09:30",
  },
  {
    id: "m2",
    content: "Mantap, RLS-nya udah dites belum?",
    isOwn: true,
    timestamp: "09:31",
    status: "read",
  },
  {
    id: "m3",
    content: "Udah, aman. Tinggal push notification aja yang belum full jalan.",
    isOwn: false,
    timestamp: "09:33",
    replyTo: { sender: "Kamu", content: "Mantap, RLS-nya udah dites belum?" },
    reaction: "👍",
  },
  {
    id: "m4",
    content: "Pesan ini contoh yang sudah diedit.",
    isOwn: true,
    timestamp: "09:35",
    status: "delivered",
    editedAt: "09:36",
  },
  {
    id: "m5",
    content: "Ini pesan yang dihapus, contoh tampilannya.",
    isOwn: false,
    timestamp: "09:36",
    deletedAt: "09:37",
  },
  {
    id: "m6",
    content: "Oke siap, saya cek dulu ya",
    isOwn: true,
    timestamp: "09:41",
    status: "sent",
  },
];

export default function Home() {
  return (
    <main className="flex h-screen bg-[#0E1116] text-[#E7E9EA]">
      {/* Chat List — tersembunyi di layar kecil, prioritas mobile-first untuk chat window */}
      <aside className="hidden w-[300px] shrink-0 flex-col border-r border-[#171B22] md:flex">
        <div className="border-b border-[#171B22] px-4 py-3.5">
          <h1 className="text-[15px] font-semibold">Private Chat</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatList chats={chats} />
        </div>
      </aside>

      {/* Chat Window */}
      <section className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[#171B22] px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F6F63] text-sm font-semibold">
            Y
          </div>
          <div>
            <p className="text-[13.5px] font-medium leading-tight">
              Yoga (Admin)
            </p>
            <p className="text-[11.5px] leading-tight text-[#E3B341]">
              online
            </p>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
        </div>

        <MessageInput />
      </section>
    </main>
  );
}
