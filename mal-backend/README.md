# MAL Backend (Aniverse)

Lightweight Express proxy to call MyAnimeList API securely from frontend without exposing `client_secret`.

Setup

1. Install dependencies:

```bash
cd mal-backend
npm install
```

2. Create `.env` from `.env.example` and set `MAL_CLIENT_SECRET`.

3. Start server:

```bash
npm start
```

Endpoints

- `GET /api/anime/search?q=term` — search anime
- `GET /api/anime/:id` — anime detail
- `GET /api/proxy?path=anime/season/2024/summer&limit=50` — generic proxy for allowed paths
- `GET /api/health` — health check

Admin / Video metadata endpoints

- `POST /api/admin/video` — upload video metadata (headers: `x-admin-token: <ADMIN_TOKEN>`). Body: `title`, `episode`, `embed`, `download` (opt), `quality` (opt), `animeId` (optional)
- `GET /api/videos` — list all uploaded videos
- `GET /api/videos?animeId=<id>` — list videos filtered by animeId
- `GET /api/videos/:animeId` — list videos for a given animeId

Notes

- This server uses the client credentials OAuth2 flow to obtain an access token and caches it in memory.
- For production: add rate limiting, request logging, and persistent cache (Redis) and protect the proxy with API keys or auth.

Persistence and deployment notes

- This backend stores uploaded video metadata in a local JSON file: `data/videos.json`. That approach works for local development or a long-running server, but it is NOT suitable for serverless deployments (Vercel Serverless Functions do not persist file writes).
- For deploying to Vercel, use an external persistent store (recommended):
	- Redis / Upstash, Vercel KV, or a managed database (PlanetScale, Supabase, MongoDB Atlas).
	- Or store metadata in a GitHub repo programmatically using the GitHub API (requires token).

Supabase migration example

1. Create a Supabase project and get `SUPABASE_URL` and `SUPABASE_KEY` (service role key for server-side operations).
2. Run SQL in Supabase SQL editor to create the `videos` table:

```sql
CREATE TABLE public.videos (
	id text PRIMARY KEY,
	animeId text,
	episode integer,
	title text,
	embed text,
	download text,
	quality text,
	uploadedAt timestamptz
);
```

3. Set `SUPABASE_URL` and `SUPABASE_KEY` in your Vercel environment variables (do NOT expose the service role key to the browser).

4. Deploy the backend to Vercel (see deployment section below).

Security

- Keep `ADMIN_TOKEN` secret (set in production env). For stronger security, use proper auth (Firebase Auth, OAuth, or JWT).
