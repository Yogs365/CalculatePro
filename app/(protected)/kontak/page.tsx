import ContactList from "@/components/contact/ContactList";

export default function KontakPage() {
  return (
    <div className="mx-auto max-w-md px-3 pb-4 pt-[calc(1.25rem+env(safe-area-inset-top))] animate-fade-in">
      <div className="mb-5 px-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ocean-50">Kontak</h1>
      </div>

      <div className="premium-glass glossy-surface overflow-hidden rounded-[1.75rem]">
        <ContactList />
      </div>
    </div>
  );
}
