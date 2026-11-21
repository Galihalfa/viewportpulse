# ViewportPulse ⚡
### Cloudflare-Style Visual QA & Edge Telemetry Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://viewportpulse.vercel.app)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

---

## 🌐 Live Production Deployment
- **Live Demo:** [https://viewportpulse.vercel.app](https://viewportpulse.vercel.app)
- **Deployment Blueprint & Architecture Guide:** [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

---

## 📌 Overview
**ViewportPulse** is a mission-critical automated visual regression and edge Core Web Vitals (CWV) telemetry platform designed for web agencies, high-traffic WordPress/Bricks ecosystems, and headless frontends.

It catches subtle CSS shifts, mobile navigation regressions, breaking plugin upgrades, and slow LCP/TTFB spikes across global edge PoPs before they impact paying end users.

---

## 🚀 Key Features

### 1. Multi-Device Visual Regression Inspector
- Synchronized multi-viewport capture across **Desktop (1440×900)**, **Tablet (768×1024)**, and **Mobile (390×844)**.
- Interactive split slider comparison with configurable threshold (0.50% SLA ceiling).
- Side-by-side comparison mode with pixel-delta highlight overlay.

### 2. 24-Hour Edge Telemetry & Real-Time Monitoring
- PoP latency and CWV tracking across **Singapore (SIN-01, SIN-02)**, **Jakarta (CGK-01)**, and **Frankfurt (FRA-01)**.
- Interactive SVG area chart tracking audit volume, regression spikes, LCP (s), and TTFB (ms).
- Live audit trigger emulator running Playwright worker steps in real time.

### 3. BullMQ Worker Pool & Security Matrix
- Resource monitoring across sandboxed Chromium container nodes.
- **SSRF & DNS Rebinding Firewall Evaluator:** Live simulation protecting internal networks (`127.0.0.1`, AWS metadata `169.254.169.254`, etc.).
- HMAC-SHA256 signature verification with strict 5-minute replay window.

### 4. White-Label Client Portal & Webhook Studio
- Agency custom branding (accent colors, brand names, and CNAME subdomains).
- Auto-generated production WordPress MU-plugin code firing signed webhooks on `upgrader_process_complete`.
- One-click print-ready client PDF export.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React
- **Hosting:** Vercel Global Edge Network
- **Backend Architecture (Blueprint):** Supabase (PostgreSQL + RLS), Cloudflare R2, BullMQ + Redis, Playwright Chromium Workers, Lemon Squeezy

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/Galihalfa/viewportpulse.git
cd viewportpulse

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📄 License
MIT © [Galihalfa](https://github.com/Galihalfa)
