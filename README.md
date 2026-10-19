# Higherlife Family Chapel International — website

Next.js (JavaScript, App Router) site with an admin portal for programmes, events and content.
Public pages read from Postgres; everything is edited at `/admin`.

## Requirements

- Node 20+
- A Postgres database (Vercel Postgres / Neon recommended; any Postgres 14+ works)

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, SESSION_SECRET and ADMIN_EMAIL/ADMIN_PASSWORD
npm run migrate              # creates tables
npm run seed                 # loads the starting programmes, events, content and gallery
npm run admin:create         # creates/updates the admin login from ADMIN_EMAIL + ADMIN_PASSWORD
npm run dev                  # http://localhost:3000  (admin at /admin)
```

`SESSION_SECRET` signs the admin session cookie. Generate one with `openssl rand -hex 32`.

**To change the admin password:** edit `ADMIN_PASSWORD` in `.env.local` (or the Vercel environment
variable in production) and run `npm run admin:create`. Passwords are stored bcrypt-hashed in the
`admins` table; the plain value only lives in the env file. You can also pass values directly:
`npm run admin:create -- you@church.org 'password' 'Your Name'`.

## Deploying to Vercel

1. Push this repository to GitHub.
2. On vercel.com, **Add New → Project** and import the repo. Framework detection picks up Next.js; no build settings need changing.
3. In **Storage**, create a Postgres database and connect it to the project (this injects `DATABASE_URL`).
4. In **Settings → Environment Variables**, add `SESSION_SECRET` (and optionally `SITE_TIMEZONE`, default `Africa/Accra`).
5. Deploy.
6. Run the schema against the production database once (with `DATABASE_URL`, `ADMIN_EMAIL` and
   `ADMIN_PASSWORD` set in your shell or a temporary `.env`):
   ```bash
   DATABASE_URL='<production pooled URL>' ADMIN_EMAIL=you@church.org ADMIN_PASSWORD='***' npm run migrate
   DATABASE_URL='<production pooled URL>' npm run seed
   DATABASE_URL='<production pooled URL>' ADMIN_EMAIL=you@church.org ADMIN_PASSWORD='***' npm run admin:create
   ```
7. Open `https://<your-app>.vercel.app/admin`, sign in, and replace the placeholder text, events and photos.

### Connecting your domain

Vercel dashboard → your project → **Settings → Domains → Add** → enter e.g. `hfc.org`.
At your DNS provider add:

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | `76.76.21.21` |
| `www` | CNAME | `cname.vercel-dns.com` |

Vercel issues the TLS certificate automatically once DNS propagates. Set the apex domain as the primary so `www` redirects to it.

## Content model

| Table | Used for |
| --- | --- |
| `programs` | Ministries and services. A row with a weekday also renders in the Service Times block. |
| `events` | Dated programmes: conferences, retreats, special services. Upcoming vs past is computed from `starts_at`/`ends_at`. |
| `posts` | Content attached to an event or a program (sermons, announcements, devotionals) or standalone. Body accepts Markdown. Sermons can carry a `series`, a `speaker` and a `video_url`. |
| `media` | Gallery photos, grouped into albums. |
| `messages` | Contact form submissions, with new/read/archived states. |
| `settings` | Editable site text (headings, hero and about copy, contact details, social links, giving link, map embed). |
| `admins` | Portal logins, bcrypt hashed. |

## Pages

Public: `/`, `/events`, `/events/[slug]`, `/programs`, `/programs/[slug]`, `/content` (filter by kind or sermon series), `/content/[slug]`, `/gallery` (filter by album), `/contact`.
Admin: `/admin/login`, `/admin` (dashboard), `/admin/events|programs|content|media|messages|settings`.

The **Site text** page in the admin portal controls the hero photo, about photo, the background
photo behind the weekly services band, the weekly service
note, the social links (Facebook, Instagram, YouTube, TikTok — each filled link adds a mark to the
pane fixed to the left edge of the site and a line in the footer) and the giving link. Leaving
**Giving URL** blank hides every Give button; the navigation button then falls back to "Plan a Visit".

Images shipped in `public/images`. To add new uploads, put files in `public/images` and paste the path (`/images/photo.jpg`) in the Photo URL field, or attach a Vercel Blob store and use its URLs.

## Notes

- All pages render dynamically (`force-dynamic`) so edits appear immediately and `next build` needs no database.
- Markdown bodies are authored only by signed-in admins; raw HTML in them is escaped before rendering.
- Icons are [Material Symbols](https://fonts.google.com/icons) SVGs shipped by the
  `@material-design-icons/svg` package (Apache 2.0), inlined into `components/MaterialIcon.js`.
  The `icon` field on a program is one of the bundled names (chosen from the dropdown in the
  admin program editor); unknown names fall back to a star glyph.
- Fonts are self-hosted: Sora (`@fontsource/sora`) for headings, Manrope (`@fontsource-variable/manrope`) for body text.
- The original single-file design is kept at `design/reference.html`; styles live in `app/globals.css`.
