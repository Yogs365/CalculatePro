interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  online?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_MAP = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
  xl: "h-28 w-28 text-3xl",
};

const DOT_SIZE_MAP = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-3.5 w-3.5",
  xl: "h-5 w-5",
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function Avatar({ name, avatarUrl, online, size = "md" }: AvatarProps) {
  return (
    <div className="relative shrink-0">
      <div
        className={`${SIZE_MAP[size]} flex items-center justify-center overflow-hidden rounded-full bg-ocean-300/12 font-medium text-ocean-300 ring-2 transition ${
          online ? "ring-online/35" : "ring-black/10"
        }`}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          initials(name)
        )}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 ${DOT_SIZE_MAP[size]} rounded-full border-2 border-ocean-950 ${
            online ? "bg-online" : "bg-ocean-600"
          }`}
        />
      )}
    </div>
  );
}
