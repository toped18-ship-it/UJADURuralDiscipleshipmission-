# UJADU RURAL DISCIPLESHIP MISSION — Web Portal & Admin System

A complete Christian ministry website and secure administration dashboard for **UJADU RURAL DISCIPLESHIP MISSION**, built with React, TypeScript, Tailwind CSS, and integrated with Supabase PostgreSQL, Supabase Auth, and Supabase Storage.

---

## 🌟 Key Features

### 1. Public Website
- **Homepage**: Custom hero section, ministry vision, core biblical values, featured activities, featured audio teachings, latest blog posts, outreach gallery photos, and scripture spotlight.
- **About Page**: Detailed ministry history, mission & vision statements, 4-phase rural discipleship strategy, and servant leadership profile.
- **Outreach Gallery**: Interactive photo grid with category filters (*Evangelism, Rural Outreach, Bible Study, Discipleship, Prayer Meetings, Mission Events*), title/description search, and high-resolution image lightbox.
- **Audio Resource Center**: Complete Christian audio teaching library with HTML5 player controls (play, pause, seek bar, duration display, volume), category filters, scripture references, and direct MP3 file downloads.
- **Blog Publishing**: Articles, field reports, and devotionals with sanitized content rendering, scripture callout blocks, tags, author bio, social share tools, and related articles.
- **Contact & Partnership**: Verified contact information, direct WhatsApp chat, and interactive partnership message form with anti-spam honeypot protection.

### 2. Secure Admin Dashboard (`/admin`)
- **Dashboard Overview (`/admin/dashboard`)**: Real database-derived statistics (# published blogs, # draft blogs, # published gallery photos, # audio teachings, received partner messages).
- **Gallery Management (`/admin/gallery`)**: Upload/add images, edit title/description/category/event date, publish/unpublish toggle, delete.
- **Audio Management (`/admin/audio`)**: Upload/add MP3 audio teachings, set speaker, category, scripture reference, cover artwork, duration, publish/unpublish, delete.
- **Blog Publishing Editor (`/admin/blog`)**: Article authoring with title auto-slug generator, rich content formatting, live preview mode, draft/publish status, edit, delete.
- **Site Settings (`/admin/settings`)**: Manage global ministry name, tagline, hero headline, contact phone/WhatsApp/email, base address, mission & vision statements, and SEO meta defaults.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, React Router DOM.
- **Backend & Database**: Supabase PostgreSQL.
- **Authentication**: Supabase Auth (Email & Password with Administrator role validation).
- **Storage**: Supabase Storage (`gallery-images`, `audio-teachings`, `blog-images`, `branding-assets`).
- **Deployment**: Vercel / GitHub.

---

## 🚀 Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build & Verify Production Bundle**:
   ```bash
   npm run build
   ```

---

## 🗄️ Supabase Setup & SQL Migrations

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `/supabase/migrations/20261023000000_init_schema.sql` and run the script.
   This creates:
   - Tables: `profiles`, `site_settings`, `gallery_images`, `audio_teachings`, `blog_posts`.
   - Indexes and automated `updated_at` triggers.
   - Row Level Security (RLS) policies allowing public read of published content and restricting write access to authorized administrators (`role = 'admin'`).
   - Storage Buckets: `gallery-images`, `audio-teachings`, `blog-images`, `branding-assets`.

---

## 🔐 Initial Administrator Provisioning

To grant administrator access to an account:

1. Create a user via **Supabase Auth -> Users** in your Supabase dashboard.
2. In the **SQL Editor**, promote the user to `admin` in the `profiles` table:
   ```sql
   INSERT INTO public.profiles (id, display_name, email, role)
   VALUES ('<USER_UUID_FROM_AUTH>', 'UJADU Director', 'admin@ujadumission.org', 'admin')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

Note: In local/preview mode without environment variables, the system includes a high-fidelity fallback session layer pre-seeded for initial review and testing.

---

## 📦 Vercel Deployment Steps

1. Push your code to GitHub.
2. Import the repository into **Vercel**.
3. In Vercel Project Settings -> **Environment Variables**, configure:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Click **Deploy**. Vercel will automatically build the Vite production bundle.

---

## 🔒 Security & Best Practices

- **Zero Client Secrets**: Only public publishable keys (`VITE_SUPABASE_PUBLISHABLE_KEY`) are exposed to the client.
- **Server-Enforced Authorization**: Database RLS policies prevent non-administrators from creating, updating, or deleting content even if API calls are forged.
- **Draft Content Privacy**: Draft blog posts and unpublished audio/gallery media are filtered at the database policy level.
