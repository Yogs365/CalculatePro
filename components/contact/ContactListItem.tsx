import ResolvedAvatar from "@/components/ui/ResolvedAvatar";
import type { ContactRow } from "@/lib/supabase/types";

interface ContactListItemProps {
  contact: ContactRow;
  onClick: () => void;
}

export default function ContactListItem({ contact, onClick }: ContactListItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:scale-[0.99] active:bg-black/[0.04]"
    >
      <ResolvedAvatar name={contact.display_name} avatarPath={contact.avatar_url} online={contact.is_online} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ocean-50">{contact.display_name}</p>
        <p
          className={`truncate text-sm ${
            contact.is_blocked_by_me
              ? "text-red-600/90"
              : contact.is_online
                ? "text-online/90"
                : "text-ocean-400"
          }`}
        >
          {contact.is_blocked_by_me ? "Diblokir" : contact.is_online ? "Online" : "Offline"}
        </p>
      </div>
      <span className="shrink-0 text-ocean-600">›</span>
    </button>
  );
}
