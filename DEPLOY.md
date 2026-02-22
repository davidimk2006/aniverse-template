# Deploy to GitHub + Vercel

Steps to push this project to GitHub and deploy to Vercel using Supabase for storage.

1) Initialize git and push to GitHub

```bash
cd anime-template
git init
git add .
git commit -m "Initial Aniverse template + MAL backend"
# create repo on GitHub then:
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

2) Prepare environment variables on Vercel

- In Vercel dashboard for your project, set these Environment Variables:
  - `MAL_CLIENT_ID` = (your MAL client id)
  - `MAL_CLIENT_SECRET` = (your MAL client secret)
  - `ADMIN_TOKEN` = (random secret)
  - `SUPABASE_URL` = (optional, if using Supabase)
  - `SUPABASE_KEY` = (Supabase service role key)

3) Supabase setup (recommended for persistence)

- Create a Supabase project and run SQL in the SQL editor (see README) to create `videos` table.

4) Deploy on Vercel

- In Vercel, import the GitHub repo, select the root folder `anime-template` as the project. Vercel will use `vercel.json` to build the backend and serve static files.

5) Test

- Visit your Vercel URL. API endpoints available under `/api/...` (e.g., `/api/health`, `/api/videos`).

Notes
- For local testing, you can run the backend with `node mal-backend/index.js`.
- Remember: do NOT commit `.env` or secrets to GitHub.
