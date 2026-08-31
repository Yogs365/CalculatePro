interface SettingsRowProps {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

export default function SettingsRow({
  icon,
  iconBg = "bg-ocean-300/15 text-ocean-300",
  title,
  subtitle,
  trailing,
  onClick,
  danger = false,
}: SettingsRowProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`glossy-chip flex w-full items-center gap-3 rounded-2xl border border-black/[0.08] bg-black/[0.03] px-4 py-3.5 text-left transition ${
        onClick ? "active:scale-[0.99] active:bg-black/[0.05]" : ""
      }`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${iconBg}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-medium ${danger ? "text-red-600" : "text-ocean-50"}`}>
          {title}
        </span>
        {subtitle && <span className="block truncate text-xs text-ocean-400">{subtitle}</span>}
      </span>
      {trailing ?? (onClick && <span className="text-ocean-500">›</span>)}
    </Component>
  );
}
