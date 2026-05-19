# Forge — Mobile Workout App

A Next.js 14 (App Router) workout app with rep logging, rest timers, and session history. Data persists in `localStorage` — no database.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Use on your phone

Same Wi-Fi as your laptop, then:

```bash
npm run dev -- -H 0.0.0.0
```

Find your laptop's local IP (`ipconfig` on Windows, `ifconfig` / `ipconfig getifaddr en0` on Mac/Linux), then visit `http://<your-ip>:3000` from your phone. On iOS Safari → Share → "Add to Home Screen" for a fullscreen app-like feel.

## Deploy (free)

```bash
npm install -g vercel
vercel
```

Follow the prompts. You get a permanent URL. Or push to GitHub and import the repo at vercel.com.

## Edit defaults

The 4 starter workouts live in `components/Forge.jsx` at the top (`DEFAULT_WORKOUTS`). Either edit the file or use the in-app **Edit** button (changes save to localStorage).

## Reset stored data

If you want to clear everything, open DevTools → Application → Local Storage → delete `forge_workouts_v1` and `forge_sessions_v1`. Or use the in-app **Reset workouts** button (history is preserved).

## Structure

```
forge/
├── app/
│   ├── layout.jsx     # root layout, viewport meta
│   ├── page.jsx       # mounts <Forge />
│   └── globals.css    # Tailwind + base styles
├── components/
│   └── Forge.jsx      # entire app (client component)
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```
