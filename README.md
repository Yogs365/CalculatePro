Chat App PWA Backend Documentation

Overview

Backend untuk aplikasi Chat App PWA (WhatsApp-like) menggunakan Supabase Free Plan sebagai backend utama.

Sistem dirancang dengan pendekatan:

- Local-first architecture
- Realtime synchronization
- Offline-first PWA
- Supabase Auth
- PostgreSQL + RPC Functions
- Supabase Storage untuk media

Tujuan utama adalah memberikan pengalaman chat yang cepat seperti aplikasi native, dengan tetap efisien terhadap batas resource Supabase Free Plan.

---

Architecture

[PWA Client]
      |
      | REST / RPC
      ▼
[Supabase Auth + PostgREST]
      |
      | PostgreSQL
      ▼
[Supabase Database]

      ▲
      |
Realtime WebSocket
      |
[Supabase Realtime]

      |
      ▼
[Supabase Storage]

      |
      ▼
[IndexedDB Local Cache]

---

Core Principles

1. Local First

Client tidak langsung bergantung pada network.

Alur:

User Action
     |
     ▼
IndexedDB Update
     |
     ▼
Optimistic UI Render
     |
     ▼
Background Sync
     |
     ▼
Supabase Update

Keuntungan:

- Chat terasa instan
- Tetap bisa digunakan saat koneksi buruk
- Mengurangi request berulang ke server

---

2. Realtime sebagai Sync Layer

Realtime bukan sumber data utama.

Jika koneksi realtime terputus:

- Client tetap membaca cache lokal
- Data tetap dikirim melalui REST/RPC
- Sinkronisasi berjalan kembali saat online

---

3. RPC untuk Transactional Operation

Operasi kompleks menggunakan PostgreSQL Function agar:

- Menghindari race condition
- Mengurangi jumlah request
- Menjaga konsistensi data

Contoh:

- Kirim pesan
- Update status pesan
- Update last message

Dilakukan dalam satu transaksi.

---

Authentication Flow

Menggunakan:

Supabase Auth OTP

Support:

- Email OTP
- Phone OTP

Flow:

1. User melakukan login/signup
2. Supabase membuat session
3. Trigger "handle_new_user"
4. Profile otomatis dibuat
5. Session disimpan di client

---

Database RPC Functions

Migration:

migration_002_rpc_functions.sql

Harus dijalankan setelah schema database utama.

Available Functions

Chat List

get_chat_list(user_id)

Fungsi:

- Mengambil daftar percakapan
- Menampilkan last message
- Menghitung unread message
- Mengurutkan berdasarkan aktivitas terakhir

---

Message Pagination

get_messages(chat_id, before, limit)

Menggunakan cursor pagination.

Default:

30 messages/load

Tujuan:

- Menghindari query besar
- Mendukung infinite scroll

---

Send Message

send_message()

Melakukan:

1. Insert message
2. Membuat message status
3. Mengatur status pengirim

Status:

sender   = read
receiver = sent

---

Mark Read

mark_chat_read()

Mengubah seluruh pesan chat menjadi:

read

secara batch.

---

Mark Delivered

mark_delivered()

Dipanggil ketika user kembali online.

Mengubah:

sent → delivered

---

Direct Chat

get_or_create_direct_chat()

Fungsi:

- Membuat chat pribadi
- Mencegah duplikasi room

---

Group Chat

create_group_chat()

Membuat:

- Group room
- Creator sebagai admin
- Menambahkan member

---

User Search

search_users()

Digunakan untuk:

- Mencari pengguna
- Membuat percakapan baru

---

Realtime Implementation

Message Subscription

Client hanya subscribe chat yang sedang aktif.

Contoh:

chat:{chat_id}

Event:

INSERT messages

---

Presence

Status online menggunakan:

Supabase Presence

Bukan database field.

Keuntungan:

- Mengurangi database write
- Lebih realtime
- Hemat resource

---

Typing Indicator

Menggunakan:

Broadcast Event

Tidak disimpan ke database.

---

Storage Management

Bucket:

chat-media

Status:

Private

Path:

chat-media/{chat_id}/{message_id}.{ext}

---

Media Optimization

Sebelum upload:

Image

- Resize maksimal 1280px
- Convert WebP
- Compression

Voice

- Codec rendah bitrate
- Optimasi ukuran file

---

Secure Media Access

Gunakan:

Signed URL

dengan expiry:

1 hour

Jangan menyimpan public URL permanen.

---

Offline PWA Strategy

Storage lokal:

IndexedDB

Recommended:

Dexie.js

Database cache:

messages_cache
chats_cache
outbox

---

Optimistic Message Flow

Create Message
      |
      ▼
Save IndexedDB
      |
      ▼
Show Immediately
      |
      ▼
Sync Background
      |
      ▼
Supabase

Jika gagal:

pending → failed

Jika berhasil:

pending → sent

---

Service Worker Rules

Cache:

✅ HTML
✅ CSS
✅ Javascript
✅ App Shell

Jangan cache:

❌ Auth API
❌ Realtime Response

---

Supabase Free Plan Consideration

Resource| Limit| Strategy
Database| 500 MB| Jangan simpan media di DB
Storage| 1 GB| Kompres media sebelum upload
Bandwidth| 5 GB/month| Cache client + signed URL
Realtime| ±200 connection| Subscribe seperlunya
Auto Pause| 7 hari| Gunakan cron/upgrade

---

Installation Flow

1. Setup Database Schema

Jalankan:

chat_app_schema.sql

---

2. Setup RPC Migration

Jalankan:

migration_002_rpc_functions.sql

---

3. Setup Supabase Client

Konfigurasi:

SUPABASE_URL
SUPABASE_ANON_KEY

---

4. Implement Client Layer

Urutan:

1. IndexedDB
2. Authentication
3. Chat List
4. Message Sync
5. Realtime
6. Storage Media

---

Recommended Development Order

Database Schema
        |
        ▼
RPC Functions
        |
        ▼
Authentication
        |
        ▼
IndexedDB Layer
        |
        ▼
Chat UI
        |
        ▼
Realtime Sync
        |
        ▼
Media Upload

---

Security Notes

Wajib:

- Aktifkan Row Level Security (RLS)
- Jangan expose service role key
- Gunakan signed URL
- Validasi user permission pada RPC
- Batasi akses chat berdasarkan participant

---

Project Status

Backend Foundation:

✅ Architecture Design
✅ Supabase Strategy
✅ RPC Planning
✅ Realtime Pattern
✅ Offline Strategy
✅ Storage Strategy

Next Development:

- Implement SQL Migration
- Build Frontend PWA
- Connect Supabase Client
- Testing Offline Sync
