<<<<<<< HEAD
# Aniverse — Static Template

This folder contains a static HTML/CSS/JS template for a streaming-anime UI. It's a starting point — not a production app.

Files:
- `index.html` — Home (latest, popular)
- `anime.html` — Detail / search placeholder
- `watch.html` — Player placeholder with server/quality controls
- `admin.html` — Static upload form (admin-only, needs backend)
- `styles.css`, `app.js` — frontend assets

Setup & notes:
1. Copy this folder to your web host or GitHub Pages.
2. Replace placeholder data with real API calls. For MyAnimeList API use a secure backend to hold `client_secret`.
3. See `.env.example` for recommended environment keys.

Deploy (examples):
- GitHub Pages: push this folder to a repo and enable Pages
- Netlify / Vercel: drag-and-drop or connect repo

Next recommended steps:
- Add a minimal Node.js backend to proxy MAL API and keep `client_secret` safe.
- Integrate Firebase Auth & Firestore for users, favorites, history, and admin verification.
=======
# Aniverse — Static Template

This folder contains a static HTML/CSS/JS template for a streaming-anime UI. It's a starting point — not a production app.

Files:
- `index.html` — Home (latest, popular)
- `anime.html` — Detail / search placeholder
- `watch.html` — Player placeholder with server/quality controls
- `admin.html` — Static upload form (admin-only, needs backend)
- `styles.css`, `app.js` — frontend assets

Setup & notes:
1. Copy this folder to your web host or GitHub Pages.
2. Replace placeholder data with real API calls. For MyAnimeList API use a secure backend to hold `client_secret`.
3. See `.env.example` for recommended environment keys.

Deploy (examples):
- GitHub Pages: push this folder to a repo and enable Pages
- Netlify / Vercel: drag-and-drop or connect repo

Next recommended steps:
- Add a minimal Node.js backend to proxy MAL API and keep `client_secret` safe.
- Integrate Firebase Auth & Firestore for users, favorites, history, and admin verification.
>>>>>>> 1a81bd7 (Initial Aniverse template + MAL backend)
