# Daily Insight

A premium animated News & Research Aggregator for technology, economics, finance, science, innovation, and IAS-style policy preparation.

## What It Does

- Shows curated sample articles prepared for free sources: arXiv, NewsAPI free tier, and Alpha Vantage free tier.
- Opens each article in an immersive dark glass read view.
- Lets the reader switch between full source text, a paragraph summary, and 3 to 5 key bullet points.
- Keeps API hook metadata with every article so real free-source integrations can be added later.

## Run Locally

```bash
npm install
npm run dev
```

## Build For Download/Hosting

```bash
npm run build
npm run preview
```

The production files will be generated in `dist/`.

## Install On Desktop Like Software

Option A: Install from browser as a PWA.

1. Run `npm install`.
2. Run `npm run dev`.
3. Open the local URL shown by Vite, usually `http://localhost:5173`.
4. In Chrome or Edge, click the install icon in the address bar.
5. The app appears in your Start Menu like a normal desktop app.

Option B: Build a Windows desktop installer with Electron.

```bash
npm install
npm run desktop:dist
```

The installer will be created in the `release/` folder. On Windows it will be an `.exe` installer.

## Android / Play Store Path

This project is now PWA-ready. To publish to the Play Store, you still need:

1. A Google Play Developer account.
2. An Android wrapper using Capacitor or a Trusted Web Activity.
3. A signing key.
4. Store listing screenshots, privacy policy, and app description.
5. A production-hosted HTTPS version of the web app.

The fastest professional route is to host this app as a PWA, then wrap it for Android using Capacitor/TWA.

## Free API Integration Rule

arXiv can be called without a key. NewsAPI and Alpha Vantage keys should be used from a backend/proxy server, not from browser code. See `SECURITY.md` and `.env.example`.
