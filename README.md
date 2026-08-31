# CircleX

Chat pribadi closed-system (Next.js 14 App Router + TypeScript + Tailwind + Supabase), PWA.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

`.env.local.example` sudah diisi URL project, publishable key, dan VAPID public
key Supabase yang aktif (`lyhwvikkvbfaqmrbrggq`) - semuanya aman untuk browser.
**Jangan pernah** menaruh service role key, `admin_access_code`, atau VAPID
private key di frontend; semua sudah tersimpan sebagai secret di Supabase Edge
Functions.

## Status implementasi (checkpoint ini)

Semua 7 layar di dokumen spesifikasi sudah terintegrasi penuh ke backend Supabase
nyata (RPC / Edge Function / Realtime / Storage) - **tidak ada dummy user, dummy
pesan, atau data hardcode**. Checkpoint sebelumnya hanya mendokumentasikan Admin
Dashboard sebagai "selesai"; checkpoint ini melengkapi sisanya dan menambal gap
produksi (skeleton, error+retry, online carousel, reply, PWA install, offline
banner).

**1. Login** - `login-with-code` Edge Function, state loading/kode salah/error
jaringan, auto-redirect kalau sudah ada sesi (`app/page.tsx` + `middleware.ts`).

**2. Chat Dashboard (`/pesan`)** - `get_my_chats` RPC + Supabase Realtime
(messages/chats/profiles). Baru ditambahkan: **online carousel** di atas daftar
chat (sumber `profiles` + `heartbeat()`), skeleton loading, dan error+retry
kalau request gagal (sebelumnya gagal = dianggap "kosong", sekarang eksplisit).

**3. Chat Room** - `get_messages` / `send_message` RPC, realtime INSERT/UPDATE,
bubble masuk/keluar, timestamp, status centang, scroll-to-bottom, kirim gambar
ke bucket `chat-media`. Baru ditambahkan: **reply message** (tekan-tahan bubble
untuk membalas -> preview balasan di atas composer -> kutipan tampil di bubble),
tombol emoji (quick-react inline), tombol pesan suara (UI placeholder - backend
`voice_note` belum ada Edge Function-nya, jadi menampilkan notice "segera
hadir" sesuai instruksi untuk tidak menyentuh backend).

**4. Kontak** - `get_all_contacts` RPC, status online realtime, FAB admin ->
`AdminCodeGate` -> `register-contact`, upload ke bucket `avatars`.

**5. Profile** - Edit nama/username/bio, upload avatar, ganti kode akses
(`set_my_access_code` / `reset_my_access_code`), toggle push notification.
Baru ditambahkan: **tombol Pasang Aplikasi** (PWA install prompt via
`beforeinstallprompt`, otomatis sembunyi di iOS Safari yang tidak punya API ini).

**6. Contact Detail** - Kirim pesan, mute notifikasi (`set_contact_muted`),
blokir (`set_contact_blocked`) - keduanya RPC nyata, bukan placeholder.

**7. Push Notification** - Service worker (`public/sw.js`), VAPID subscribe,
permission handling, simpan subscription ke `push_subscriptions`.

## Ditambahkan di checkpoint ini (produksi)

- **Loading skeleton** nyata (bukan teks "Memuat...") di chat list, contact
  list, dan chat room - `components/ui/Skeleton.tsx`.
- **Error state + retry** di chat list & contact list -
  `components/ui/ErrorRetry.tsx` - request gagal sekarang menampilkan tombol
  "Coba Lagi", bukan diam-diam dianggap kosong.
- **Offline handling** - `hooks/useOnlineStatus.ts` +
  `components/ui/OfflineBanner.tsx`, banner sticky muncul di semua layar
  terproteksi saat `navigator.onLine` false. Login juga menangani exception
  jaringan secara eksplisit (`features/auth/login.ts`).
- **PWA install support** - `components/profile/InstallPwaButton.tsx`.
- **Ikon PWA** (`public/icons/icon-192.png`, `icon-512.png`,
  `icon-512-maskable.png`) - sebelumnya direferensikan di manifest &
  `sw.js` tapi filenya belum ada; sudah dibuat (ikon ombak sederhana,
  tema ocean).
- **Session recovery** - sudah tercakup oleh `middleware.ts` (refresh sesi
  di setiap navigasi) + `(protected)/layout.tsx` (redirect ke `/login` kalau
  tidak ada sesi).

## Belum ada implementasi backend-nya (di luar scope "jangan ubah backend")

- **Voice note terkirim** - `message_type: "voice_note"` sudah ada di skema
  dan UI recorder belum dibuat; tombol mic di composer saat ini hanya
  menampilkan notice, sesuai instruksi untuk tidak menambah sistem backend
  baru tanpa diminta eksplisit.
- **Block backend** - `set_contact_blocked` sudah RPC nyata (bukan
  placeholder di frontend), tapi efek block terhadap pengiriman pesan
  ditegakkan sepenuhnya oleh RLS di backend - frontend tidak menambah logic
  baru di sana.

## Catatan backend (tidak diubah)

- Edge Function `delete-contact` (dibuat di checkpoint sebelumnya) tetap
  dipakai apa adanya.
- Semua RPC/Edge Function lain (`register-contact`, `login-with-code`,
  `change-access-code` a.k.a. `set_my_access_code`/`reset_my_access_code`,
  `verify_admin_code`, `get_my_chats`, `get_messages`, `send_message`,
  `mark_chat_read`, `get_or_create_direct_chat`, `heartbeat`,
  `get_all_contacts`, `get_contact_settings`, `set_contact_muted`,
  `set_contact_blocked`) dipakai apa adanya, tidak diubah.
- `avatar_url` di `profiles` dan `media_url` di `messages` menyimpan **path
  storage**, bukan URL publik (bucket privat) - frontend selalu resolve
  lewat signed URL.

## Belum bisa dijalankan `npm install` di sandbox ini

Environment kerja tidak punya akses jaringan, jadi `npm install` dan
`npm run build` belum dijalankan di sini untuk verifikasi otomatis. Semua kode
ditulis mengikuti konvensi Next.js 14 App Router standar dan pola yang sudah
ada di project ini - jalankan `npm install && npm run build` di mesin kamu
untuk memastikan tidak ada typo/type error sebelum deploy.

## Rekomendasi langkah selanjutnya

1. `npm install && npm run build` - perbaiki type error kalau ada (sandbox ini
   tidak bisa memverifikasinya).
2. Deploy ke Vercel/hosting pilihan, set env var dari `.env.local.example`.
3. QA manual di perangkat asli: login, kirim pesan+reply+gambar, toggle
   online carousel dengan 2 device, install PWA di Android, coba mode
   pesawat untuk cek offline banner.
4. Kalau voice note memang perlu jalan (bukan cuma UI), itu perlu Edge
   Function + storage policy baru - beri tahu agar tidak menyentuh backend
   tanpa arahan eksplisit.
