# CalenFlow

Marketing site plus a localStorage-only demo of the CalenFlow scheduling app.
No backend, database, email, or payments — all demo data stays in the browser.

## Run it locally

Double-click **`start-calenflow.cmd`**, or in PowerShell:

```powershell
cd C:\Users\user\Dev\CalenFlow
npm install     # first time only
npm run dev
```

Then open:

| Page | URL |
|---|---|
| Website (landing) | http://localhost:3000 |
| App demo (splash → auth → setup/dashboard) | http://localhost:3000/welcome |

Keep the terminal window open. Closing it stops the site — nothing is listening on
port 3000 afterwards until you start it again. Your data is not affected: it lives in
the browser's localStorage.

### Phone / other devices on the same Wi-Fi

1. Run `ipconfig` and note the Wi-Fi **IPv4 Address**.
2. Add that address to `allowedDevOrigins` in `next.config.ts` (hostname only, no port).
3. Open `http://<that-ip>:3000` on the phone.

## Production build

```powershell
npm run build
npm start
```

## Deploy (works with this PC off)

The repo is on GitHub and deploys to Vercel with no configuration:
https://vercel.com/new → import the repo → Deploy.

## Tech

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4
