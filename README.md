# Private Chat PWA

Skeleton awal — Next.js + TypeScript + Tailwind + Supabase, sesuai `BLUEPRINT_FINAL_Private_Chat_PWA_Supabase.md`.

Backend (schema, RLS, RPC, Edge Function) sudah di-setup di project Supabase **Calculatepro**. Lihat `FULLSCHEMA.md` dan `MIGRATIONS.md` untuk detail.

## Setup lokal

```bash
npm install
cp .env.example .env.local
# isi .env.local dengan value dari Supabase Dashboard
npm run dev
```

## Deploy ke Vercel

1. Push repo ini ke GitHub
2. Import project di Vercel (vercel.com -> Add New -> Project)
3. Isi Environment Variables di Vercel sesuai `.env.example`
4. Deploy — otomatis re-deploy setiap push ke `main`

## Struktur

```
app/            # Next.js App Router
lib/supabase/   # Supabase client
public/         # manifest.json, sw.js (service worker)
```

## Yang masih perlu ditambahkan (bertahap sesuai Implementation Order blueprint)

- Phase 2: IndexedDB (Dexie.js), optimistic send, chat UI
- Phase 3: Realtime subscribe, Presence, Typing indicator
- Phase 4: Media upload ke Supabase Storage, integrasi push notification penuh
- Phase 5: Polish UX & testing

Checklist setup manual (secrets, VAPID, dsb) ada di `CHECKLIST_Manual_Setup.md`.
