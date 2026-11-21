# ViewportPulse — Production Deployment & Go-Live Blueprint

This guide takes your **ViewportPulse** React interface (`ViewportPulse.jsx`) from a local prototype to a live, multi-tenant B2B SaaS running on **Cloudflare Pages**, **Supabase**, **Cloudflare R2**, **Coolify (Singapore VPS)**, and **Lemon Squeezy**.

---

## 1. Production Infrastructure & Lean Cost Stack (~$18–$28/mo)

Because headless Chromium workers require dedicated RAM (`1.5–2 GB` per container), splitting your static frontend/storage from your worker VPS keeps baseline costs ultra-low while supporting 50+ paying agencies:

| Layer | Provider | Purpose | Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Frontend Dashboard** | **Cloudflare Pages** | Hosts the React + Vite app globally on Cloudflare's CDN with free SSL | **$0 / mo** |
| **Auth & Database** | **Supabase** | PostgreSQL database, magic-link/OAuth login, and Row-Level Security (RLS) | **$0 / mo** *(Free tier up to 500MB)* |
| **Screenshot Storage** | **Cloudflare R2** | Stores baseline, latest, and pixel-diff PNGs with **$0 bandwidth egress fees** | **~$0.50 / mo** *($0.015/GB)* |
| **Queue & Playwright Worker** | **Hetzner / Vultr / DO (Singapore)** + **Coolify** | Runs Node.js API, Redis (BullMQ), and sandboxed Chromium workers close to `SIN-01`/`CGK-01` | **$18–$24 / mo** *(4GB RAM / 2 vCPU)* |
| **Payments & Global Tax** | **Lemon Squeezy** (Merchant of Record) | Handles global USD subscriptions, VAT/GST compliance, and payouts to Indonesia (Bank/Wise) | **$0 / mo fixed** *(5% + $0.50/txn)* |

---

## 2. Step-by-Step Deployment Sequence

### Step 1: Domain & DNS Routing on Cloudflare
Register your domain (e.g., `viewportpulse.io`) and add it to **Cloudflare DNS**:

1. `viewportpulse.io` -> High-converting marketing landing page (Cloudflare Pages or Bricks).
2. `app.viewportpulse.io` -> `CNAME` pointing to your Cloudflare Pages React app (`viewportpulse-app.pages.dev`).
3. `api.viewportpulse.io` -> `A` record pointing to your Singapore VPS IPv4 address (SSL handled automatically via Coolify + Let's Encrypt).
4. `*.reports.viewportpulse.io` -> `CNAME` pointing to `app.viewportpulse.io` so agencies can map custom CNAME portals like `reports.litraskreatif.com`.

---

### Step 2: Provision Supabase Database & Row-Level Security (RLS)
Create a new project in **Supabase (Singapore `ap-southeast-1` region)** and run this SQL in the **SQL Editor** to create your multi-tenant schema:

```sql
-- 1. Agencies (Tenants)
create table public.agencies (
  id uuid primary key references auth.users(id) on delete cascade,
  brand_name text not null default 'My Agency',
  portal_cname text,
  accent_color text not null default '#F38020',
  plan_tier text not null default 'trial', -- 'trial' | 'freelancer' | 'agency' | 'scale' | 'ltd'
  zone_limit int not null default 3,
  webhook_slug text unique not null default encode(gen_random_bytes(8), 'hex'),
  hmac_secret_hash text not null,
  lemon_squeezy_customer_id text,
  created_at timestamptz not null default now()
);

-- 2. Monitored Zones (Client Sites)
create table public.zones (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  domain text not null,
  target_url text not null,
  status text not null default 'PASSING', -- 'PASSING' | 'REGRESSION' | 'SLOW_CWV'
  diff_threshold numeric(4,2) not null default 0.50,
  desktop_baseline_key text,
  tablet_baseline_key text,
  mobile_baseline_key text,
  last_lcp_ms int,
  last_cls numeric(4,3),
  last_ttfb_ms int,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

-- 3. Audit Runs & Public Share Tokens
create table public.audit_runs (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references public.zones(id) on delete cascade,
  agency_id uuid not null references public.agencies(id) on delete cascade,
  viewport text not null, -- 'desktop' | 'tablet' | 'mobile'
  status text not null,   -- 'PASS' | 'DIFF'
  pixel_delta numeric(5,2) not null default 0.00,
  changed_pixels int not null default 0,
  latest_r2_key text not null,
  diff_r2_key text,
  lcp_ms int,
  cls numeric(4,3),
  ttfb_ms int,
  trigger_source text not null default 'scheduled',
  created_at timestamptz not null default now()
);

-- 4. Enable Strict Row-Level Security (RLS)
alter table public.agencies enable row level security;
alter table public.zones enable row level security;
alter table public.audit_runs enable row level security;

create policy "Agencies manage own profile"
  on public.agencies for all using (auth.uid() = id);

create policy "Agencies manage own zones"
  on public.zones for all using (auth.uid() = agency_id);

create policy "Agencies read own audit runs"
  on public.audit_runs for all using (auth.uid() = agency_id);
```

---

### Step 3: Configure Cloudflare R2 Object Storage
1. Open **Cloudflare Dashboard -> R2 Object Storage** and create a bucket named `viewportpulse-artifacts`.
2. Go to **Manage R2 API Tokens** and create an **Object Read & Write** token. Save:
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
3. Under **Bucket Settings -> Object Lifecycle Rules**, add a rule to auto-delete objects under `latest/` and `diffs/` after **30 days** while keeping `baselines/` permanently—keeping your storage bill near zero.

---

### Step 4: Deploy API, Redis & Playwright Worker on Singapore VPS (Coolify)
Provision an Ubuntu 24.04 VPS in **Singapore** (4GB RAM / 2 vCPU minimum) and install **Coolify** with one command:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

In your backend repository (`viewportpulse-worker`), create a `Dockerfile` using Microsoft's official Playwright image (which pre-installs all Chromium system libraries and fonts):

```dockerfile
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
CMD ["node", "src/worker.js"]
```

Create a `docker-compose.yml` in Coolify to run the **API Gateway**, **Redis**, and **Playwright Worker** with shared memory (`shm_size: 1gb`) so Chromium never crashes on full-page screenshots:

```yaml
services:
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy noeviction
    volumes:
      - redis_data:/data
    restart: unless-stopped

  api:
    build: .
    command: node src/api.js
    ports:
      - "3001:3001"
    environment:
      - REDIS_HOST=redis
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - R2_ENDPOINT=${R2_ENDPOINT}
      - R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
      - R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
      - LEMON_SQUEEZY_WEBHOOK_SECRET=${LEMON_SQUEEZY_WEBHOOK_SECRET}
    depends_on:
      - redis
    restart: unless-stopped

  worker:
    build: .
    command: node src/worker.js
    shm_size: '1gb'
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.5'
    environment:
      - REDIS_HOST=redis
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - R2_ENDPOINT=${R2_ENDPOINT}
      - R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
      - R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
    depends_on:
      - redis
    restart: unless-stopped

volumes:
  redis_data:
```

---

### Step 5: Package & Deploy the React Frontend (`ViewportPulse.jsx`)
1. Scaffold a Vite React project locally and install dependencies:
   ```bash
   npm create vite@latest viewportpulse-web -- --template react
   cd viewportpulse-web
   npm install lucide-react @supabase/supabase-js
   npm install -D tailwindcss @tailwindcss/vite
   ```
2. Replace `src/App.jsx` with your `ViewportPulse.jsx` file and wire the live API calls (`GET /api/v1/zones`, `POST /api/v1/zones`, `POST /api/v1/zones/:id/baseline`) to `https://api.viewportpulse.io`.
3. Push the repository to GitHub, connect it to **Cloudflare Pages** (`Build command: npm run build`, `Output directory: dist`), and attach your custom domain `app.viewportpulse.io`.

---

### Step 6: Connect Lemon Squeezy Billing (Indonesia Payouts)
1. Create a **Lemon Squeezy** store and configure payouts via **Wise** or **SWIFT Bank Transfer** (IDR/USD).
2. Create 4 products matching your pricing tiers:
   - **Freelancer** (`$49/mo` -> `zone_limit = 10`)
   - **Agency** (`$129/mo` -> `zone_limit = 50`)
   - **Scale** (`$299/mo` -> `zone_limit = 200`)
   - **Founder LTD** (`$349 one-time`, capped at 30 seats -> `zone_limit = 50`)
3. Point Lemon Squeezy's webhook to `https://api.viewportpulse.io/v1/webhooks/lemonsqueezy` listening for `order_created`, `subscription_updated`, and `subscription_expired` to automatically update `agencies.plan_tier` and `agencies.zone_limit` in Supabase.

---

## 3. Pre-Launch Security & Go-Live Checklist

- [ ] **Verify SSRF Guard:** Attempt to add `http://127.0.0.1:6379` and `http://169.254.169.254/latest/meta-data/` via the API and confirm both return `403 SSRF_GUARD`.
- [ ] **Verify WordPress HMAC Webhook:** Drop the generated `viewportpulse-qa-trigger.php` into a staging WordPress site's `wp-content/mu-plugins/` folder, update a plugin, and confirm the audit job hits BullMQ within 2 seconds.
- [ ] **Verify White-Label CNAME & PDF Export:** Test `https://reports.litraskreatif.com` and verify the printed PDF renders cleanly in **Open Sauce Two** without dashboard chrome.
- [ ] **Seed First 10 Paying Agencies:** Record a 45-second Loom demo catching a real mobile layout break after a WordPress/Bricks update and share it in Bricks Builder, Breakdance, and WordPress agency communities with your **30 Founder LTD ($349)** launch link.