import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Cpu,
  Eye,
  EyeOff,
  FileCheck2,
  Globe,
  KeyRound,
  Layers,
  Lock,
  Menu,
  Monitor,
  Moon,
  Play,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sun,
  Tablet,
  Terminal,
  Webhook,
  X,
  Zap,
} from 'lucide-react';

/**
 * VIEWPORT SPECIFICATIONS
 * Synchronized multi-device targets captured by Playwright workers.
 */
const VIEWPORT_SPECS = {
  desktop: { key: 'desktop', label: 'Desktop', dims: '1440×900', width: 1440, height: 900, icon: Monitor },
  tablet: { key: 'tablet', label: 'Tablet', dims: '768×1024', width: 768, height: 1024, icon: Tablet },
  mobile: { key: 'mobile', label: 'Mobile', dims: '390×844', width: 390, height: 844, icon: Smartphone },
};

/**
 * INITIAL MONITORED ZONES
 * Represents active client WordPress / Bricks / React sites monitored across Edge PoPs.
 */
const INITIAL_ZONES = [
  {
    id: 'zone-1',
    domain: 'tempatbelajar.id',
    url: 'https://tempatbelajar.id',
    status: 'REGRESSION', // 'PASSING' | 'REGRESSION' | 'SLOW_CWV'
    viewports: {
      desktop: 'PASS',
      tablet: 'PASS',
      mobile: 'DIFF',
    },
    pixelDelta: 2.84,
    changedPixels: 9350,
    lcp: 1.8,
    cls: 0.14,
    ttfb: 142,
    edgePop: 'CGK-01',
    lastChecked: '4m ago',
    suspectedSelector: '.brx-nav-cta, .tb-course-grid',
    diffSummary:
      'Mobile nav CTA button wrapped downward (+38px Y-axis) overlapping hero H1; course card grid exceeds 390px viewport (+55px horizontal overflow).',
  },
  {
    id: 'zone-2',
    domain: 'pekotype.com',
    url: 'https://pekotype.com',
    status: 'PASSING',
    viewports: {
      desktop: 'PASS',
      tablet: 'PASS',
      mobile: 'PASS',
    },
    pixelDelta: 0.0,
    changedPixels: 0,
    lcp: 0.9,
    cls: 0.0,
    ttfb: 68,
    edgePop: 'SIN-01',
    lastChecked: '18m ago',
    suspectedSelector: 'None',
    diffSummary: 'All viewports match approved Cloudflare R2 baseline within 0.00% pixel variance.',
  },
  {
    id: 'zone-3',
    domain: 'lingua-learn.com',
    url: 'https://lingua-learn.com',
    status: 'PASSING',
    viewports: {
      desktop: 'PASS',
      tablet: 'PASS',
      mobile: 'PASS',
    },
    pixelDelta: 0.04,
    changedPixels: 128,
    lcp: 1.3,
    cls: 0.01,
    ttfb: 94,
    edgePop: 'SIN-02',
    lastChecked: '32m ago',
    suspectedSelector: 'None (Anti-aliasing subpixel variance)',
    diffSummary: 'Sub-threshold font hinting delta (0.04% < 0.50% SLA ceiling).',
  },
  {
    id: 'zone-4',
    domain: 'princeps.no',
    url: 'https://princeps.no',
    status: 'PASSING',
    viewports: {
      desktop: 'PASS',
      tablet: 'PASS',
      mobile: 'PASS',
    },
    pixelDelta: 0.0,
    changedPixels: 0,
    lcp: 1.0,
    cls: 0.01,
    ttfb: 81,
    edgePop: 'FRA-01',
    lastChecked: '45m ago',
    suspectedSelector: 'None',
    diffSummary: 'Zero layout shift detected across Desktop, Tablet, and Mobile viewports.',
  },
  {
    id: 'zone-5',
    domain: 'deaurayavillas.com',
    url: 'https://deaurayavillas.com',
    status: 'SLOW_CWV',
    viewports: {
      desktop: 'PASS',
      tablet: 'PASS',
      mobile: 'PASS',
    },
    pixelDelta: 0.12,
    changedPixels: 394,
    lcp: 2.6,
    cls: 0.03,
    ttfb: 318,
    edgePop: 'CGK-01',
    lastChecked: '1h ago',
    suspectedSelector: 'img.hero-villa-banner (uncompressed 3.4MB PNG)',
    diffSummary:
      'Visual layout intact (0.12% delta), but hero LCP degraded to 2.60s exceeding 2.50s SLA threshold.',
  },
  {
    id: 'zone-6',
    domain: 'litraskreatif.com',
    url: 'https://litraskreatif.com',
    status: 'PASSING',
    viewports: {
      desktop: 'PASS',
      tablet: 'PASS',
      mobile: 'PASS',
    },
    pixelDelta: 0.0,
    changedPixels: 0,
    lcp: 1.1,
    cls: 0.0,
    ttfb: 72,
    edgePop: 'SIN-01',
    lastChecked: '2h ago',
    suspectedSelector: 'None',
    diffSummary: 'All production templates verified against approved Cloudflare R2 baseline.',
  },
];

/**
 * 24-HOUR EDGE TELEMETRY SERIES
 */
const TELEMETRY_24H = [
  { hour: '00:00', runs: 18, diffs: 0, lcpMs: 1380, ttfbMs: 92 },
  { hour: '02:00', runs: 22, diffs: 0, lcpMs: 1340, ttfbMs: 88 },
  { hour: '04:00', runs: 19, diffs: 0, lcpMs: 1310, ttfbMs: 85 },
  { hour: '06:00', runs: 27, diffs: 1, lcpMs: 1490, ttfbMs: 112 },
  { hour: '08:00', runs: 41, diffs: 0, lcpMs: 1420, ttfbMs: 104 },
  { hour: '10:00', runs: 54, diffs: 0, lcpMs: 1390, ttfbMs: 96 },
  { hour: '12:00', runs: 48, diffs: 1, lcpMs: 1560, ttfbMs: 128 },
  { hour: '14:00', runs: 62, diffs: 0, lcpMs: 1440, ttfbMs: 101 },
  { hour: '16:00', runs: 58, diffs: 0, lcpMs: 1410, ttfbMs: 98 },
  { hour: '18:00', runs: 67, diffs: 1, lcpMs: 1510, ttfbMs: 119 },
  { hour: '20:00', runs: 49, diffs: 0, lcpMs: 1370, ttfbMs: 91 },
  { hour: '22:00', runs: 44, diffs: 1, lcpMs: 1420, ttfbMs: 95 },
];

/**
 * BULLMQ + PLAYWRIGHT WORKER POOL NODES
 */
const WORKER_NODES = [
  {
    id: 'worker-sgp-01',
    region: 'Singapore (SIN-01)',
    status: 'HEALTHY',
    cpuPct: 42,
    ramUsedMb: 1240,
    ramTotalMb: 2048,
    activeContexts: 2,
    maxContexts: 3,
    r2LatencyMs: 18,
    queueDepth: 0,
    uptime: '14d 09h 42m',
  },
  {
    id: 'worker-sgp-02',
    region: 'Singapore (SIN-02)',
    status: 'HEALTHY',
    cpuPct: 28,
    ramUsedMb: 980,
    ramTotalMb: 2048,
    activeContexts: 1,
    maxContexts: 3,
    r2LatencyMs: 21,
    queueDepth: 0,
    uptime: '14d 09h 39m',
  },
  {
    id: 'worker-cgk-01',
    region: 'Jakarta (CGK-01)',
    status: 'HEALTHY',
    cpuPct: 37,
    ramUsedMb: 1120,
    ramTotalMb: 2048,
    activeContexts: 2,
    maxContexts: 3,
    r2LatencyMs: 24,
    queueDepth: 0,
    uptime: '9d 18h 15m',
  },
];

/**
 * SECURITY RULESET MATRIX
 */
const SECURITY_RULES = [
  {
    id: 'SEC-01',
    name: 'SSRF & DNS Rebinding',
    layer: 'DNS + Playwright Route Interceptor',
    spec: 'Blocks 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, ::1, fc00::/7',
    status: 'ENFORCED',
  },
  {
    id: 'SEC-02',
    name: 'Container Sandboxing',
    layer: 'Container & Browser Sandbox',
    spec: 'Fresh browser.newContext() per audit; zero shared cookies, cache, or internal bridge access',
    status: 'ENFORCED',
  },
  {
    id: 'SEC-03',
    name: 'HMAC-SHA256 Replay Protection',
    layer: 'Webhook Ingestion Gateway',
    spec: 'crypto.timingSafeEqual() signature check + strict 5-minute X-VP-Timestamp drift ceiling',
    status: 'ENFORCED',
  },
  {
    id: 'SEC-04',
    name: 'PostgreSQL RLS',
    layer: 'Supabase Multi-Tenant Database',
    spec: 'All zones, audit_runs & R2 keys scoped at DB engine level via auth.uid() = agency_id',
    status: 'ENFORCED',
  },
  {
    id: 'SEC-05',
    name: 'Redis Sliding-Window Quotas',
    layer: 'BullMQ API Quota Guard',
    spec: 'Per-tenant token bucket + 15s plugin-burst deduplication window preventing queue flooding',
    status: 'ENFORCED',
  },
];

/**
 * INITIAL WORDPRESS WEBHOOK DELIVERY EVENTS
 */
const INITIAL_WEBHOOK_LOGS = [
  {
    id: 'evt_9941',
    site: 'tempatbelajar.id',
    event: 'upgrader_process_complete',
    detail: 'Plugin updated: bricks-builder 1.11.1 → 1.11.2',
    httpStatus: 202,
    outcome: 'REGRESSION_DETECTED',
    timestamp: '4m ago',
    payload: {
      event: 'upgrader_process_complete',
      type: 'plugin',
      slug: 'bricks/bricks.php',
      from_version: '1.11.1',
      to_version: '1.11.2',
      site_url: 'https://tempatbelajar.id',
      viewports: ['1440x900', '768x1024', '390x844'],
    },
  },
  {
    id: 'evt_9940',
    site: 'pekotype.com',
    event: 'upgrader_process_complete',
    detail: 'Plugin updated: woocommerce 9.4.0 → 9.4.1',
    httpStatus: 202,
    outcome: 'ALL_VIEWPORTS_PASS',
    timestamp: '18m ago',
    payload: {
      event: 'upgrader_process_complete',
      type: 'plugin',
      slug: 'woocommerce/woocommerce.php',
      from_version: '9.4.0',
      to_version: '9.4.1',
      site_url: 'https://pekotype.com',
      viewports: ['1440x900', '768x1024', '390x844'],
    },
  },
  {
    id: 'evt_9939',
    site: 'deaurayavillas.com',
    event: 'scheduled_cron_sweep',
    detail: 'Daily automated Edge PoP CWV & Visual Sweep',
    httpStatus: 202,
    outcome: 'SLOW_CWV_ALERT',
    timestamp: '1h ago',
    payload: {
      event: 'scheduled_cron_sweep',
      pop: 'CGK-01',
      site_url: 'https://deaurayavillas.com',
      lcp_ms: 2600,
      pixel_delta: 0.12,
    },
  },
];

/**
 * PRODUCTION WORDPRESS MU-PLUGIN GENERATOR
 */
function buildWpMuPluginCode(secret) {
  return `<?php
/**
 * Plugin Name: ViewportPulse Automated Visual QA Trigger
 * Description: Fires an HMAC-SHA256 signed audit webhook whenever plugins, themes, or core update.
 * Version:     1.2.0
 * Author:      Litras Digital
 */

defined('ABSPATH') || exit;

define('VP_WEBHOOK_ENDPOINT', 'https://api.viewportpulse.io/v1/webhooks/wp/litras_9928a1');
define('VP_SIGNING_SECRET', '${secret}');

add_action('upgrader_process_complete', function ($upgrader, $hook_extra) {
    if (empty($hook_extra['type']) || !in_array($hook_extra['type'], ['plugin', 'theme', 'core'], true)) {
        return;
    }

    $timestamp = (string) time();
    $body = wp_json_encode([
        'event'      => 'upgrader_process_complete',
        'site_url'   => home_url('/'),
        'type'       => $hook_extra['type'],
        'action'     => $hook_extra['action'] ?? 'update',
        'items'      => $hook_extra['plugins'] ?? $hook_extra['themes'] ?? ['core'],
        'viewports'  => ['1440x900', '768x1024', '390x844'],
    ]);

    // Replay-resistant HMAC-SHA256 signature over timestamp + raw JSON payload
    $signature = hash_hmac('sha256', $timestamp . '.' . $body, VP_SIGNING_SECRET);

    wp_remote_post(VP_WEBHOOK_ENDPOINT, [
        'timeout'   => 3,
        'blocking'  => false,
        'headers'   => [
            'Content-Type'   => 'application/json',
            'X-VP-Timestamp' => $timestamp,
            'X-VP-Signature' => 'sha256=' . $signature,
        ],
        'body'      => $body,
    ]);
}, 10, 2);`;
}

/**
 * MINI SVG SPARKLINE FOR KPI CARDS
 */
function MiniSparkline({ points, strokeColor }) {
  const width = 76;
  const height = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - 4 - ((val - min) / range) * (height - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="shrink-0 overflow-visible" aria-hidden="true">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
}

/**
 * INTERACTIVE 24H EDGE TELEMETRY SVG AREA CHART
 */
function TelemetryAreaChart({ data, mode, darkMode }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const width = 760;
  const height = 195;
  const padLeft = 36;
  const padRight = 16;
  const padTop = 18;
  const padBottom = 26;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const values = data.map((d) => (mode === 'runs' ? d.runs : d.lcpMs));
  const maxVal = mode === 'runs' ? 80 : 2000;

  const points = data.map((d, i) => {
    const val = mode === 'runs' ? d.runs : d.lcpMs;
    const x = padLeft + (i / (data.length - 1)) * plotW;
    const y = padTop + plotH - (val / maxVal) * plotH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${padTop + plotH} L ${points[0].x.toFixed(1)} ${padTop + plotH} Z`;

  const strokeMain = mode === 'runs' ? '#F38020' : '#0EA5E9';
  const gridStroke = darkMode ? '#30363D' : '#E2E8F0';
  const labelFill = darkMode ? '#8B949E' : '#64748B';

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="cfTelemetryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeMain} stopOpacity="0.28" />
            <stop offset="100%" stopColor={strokeMain} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Horizontal Reference Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padTop + plotH - ratio * plotH;
          const labelVal = Math.round(ratio * maxVal);
          return (
            <g key={idx}>
              <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke={gridStroke} strokeDasharray="3 3" strokeWidth="1" />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="9.5" fill={labelFill} className="tabular-nums">
                {mode === 'runs' ? labelVal : `${(labelVal / 1000).toFixed(1)}s`}
              </text>
            </g>
          );
        })}

        {/* Area Fill & Stroke Line */}
        <path d={areaPath} fill="url(#cfTelemetryGrad)" />
        <path d={linePath} fill="none" stroke={strokeMain} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Points & Regression Markers */}
        {points.map((p, idx) => {
          const isHovered = hoverIdx === idx;
          const hasDiff = mode === 'runs' && p.diffs > 0;
          return (
            <g key={p.hour}>
              {/* X-Axis Hour Label */}
              <text x={p.x} y={height - 6} textAnchor="middle" fontSize="9.5" fill={labelFill} className="tabular-nums">
                {p.hour}
              </text>

              {/* Diff Alert Marker */}
              {hasDiff && (
                <circle cx={p.x} cy={p.y} r={isHovered ? 6 : 4.5} fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
              )}

              {/* Hover Point */}
              {isHovered && !hasDiff && (
                <circle cx={p.x} cy={p.y} r="4.5" fill={strokeMain} stroke="#FFFFFF" strokeWidth="1.5" />
              )}

              {/* Invisible Hit Target Column */}
              <rect
                x={p.x - plotW / data.length / 2}
                y={padTop}
                width={plotW / data.length}
                height={plotH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoverIdx !== null && points[hoverIdx] && (
        <div
          className={`mt-2 px-3 py-1.5 rounded-md border text-xs flex flex-wrap items-center justify-between gap-4 tabular-nums ${
            darkMode
              ? 'bg-[#0D1117] border-[#30363D] text-[#E6EDF3]'
              : 'bg-[#F7F8FA] border-[#E2E8F0] text-[#0F172A]'
          }`}
        >
          <span className="font-semibold">{points[hoverIdx].hour} UTC Edge Window</span>
          <span>
            Audits: <strong>{points[hoverIdx].runs}</strong> • Regressions:{' '}
            <strong className={points[hoverIdx].diffs > 0 ? 'text-red-500' : 'text-emerald-500'}>
              {points[hoverIdx].diffs}
            </strong>
          </span>
          <span>
            Median LCP: <strong>{(points[hoverIdx].lcpMs / 1000).toFixed(2)}s</strong> • TTFB:{' '}
            <strong>{points[hoverIdx].ttfbMs}ms</strong>
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * REALISTIC HTML/CSS MOCKUP FOR VISUAL DIFF INSPECTOR
 * Renders Baseline (clean) vs Latest Capture (showing mobile CSS regression on tempatbelajar.id).
 */
function ViewportMockupScene({ zone, viewport, variant, showOverlay }) {
  const isBrokenMobile =
    variant === 'latest' &&
    zone.id === 'zone-1' &&
    viewport === 'mobile' &&
    zone.viewports.mobile === 'DIFF';

  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  return (
    <div
      className={`w-full h-full bg-white text-slate-900 select-none overflow-hidden flex flex-col ${
        isMobile ? 'max-w-[360px] mx-auto border-x border-slate-300 shadow-md' : isTablet ? 'max-w-[560px] mx-auto border-x border-slate-300 shadow-md' : 'w-full'
      }`}
    >
      {/* Simulated Browser Top Bar */}
      <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2 text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <div className="px-2.5 py-0.5 rounded bg-white border border-slate-200 font-mono truncate max-w-[200px]">
          {zone.url}
        </div>
        <span className="font-mono uppercase">{VIEWPORT_SPECS[viewport].dims}</span>
      </div>

      {/* Simulated Site Header / Navbar */}
      <div className="relative px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-orange-500" />
          <span className="font-bold text-xs tracking-tight text-slate-900">{zone.domain}</span>
        </div>

        {!isMobile && (
          <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium">
            <span>Courses</span>
            <span>Mentors</span>
            <span>Pricing</span>
          </div>
        )}

        {/* Nav CTA Button (Breaks & wraps downward in Broken Mobile Latest Capture) */}
        <div
          className={
            isBrokenMobile
              ? 'absolute left-3 top-[46px] z-20 px-3 py-1.5 rounded bg-orange-600 text-white text-[11px] font-bold shadow-md'
              : 'px-2.5 py-1 rounded bg-slate-900 text-white text-[11px] font-semibold'
          }
        >
          Enroll Now
          {isBrokenMobile && showOverlay && (
            <span className="absolute -inset-1 border-2 border-red-500 bg-red-500/20 rounded pointer-events-none" />
          )}
        </div>
      </div>

      {/* Simulated Hero Section */}
      <div className="px-4 py-5 bg-slate-50 border-b border-slate-200 relative">
        <div className="inline-block px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-semibold mb-2">
          PRODUCTION BUILD • EDGE VERIFIED
        </div>
        <h4 className={`font-extrabold text-slate-900 leading-snug ${isMobile ? 'text-sm' : 'text-lg'}`}>
          Master Full-Stack Engineering &amp; Product Design
        </h4>
        <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
          Structured cohort workshops, live code reviews, and verifiable production portfolios.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1.5 rounded bg-orange-500 text-white text-[11px] font-semibold">
            Explore Syllabus
          </span>
          <span className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-[11px] font-medium">
            View Demo
          </span>
        </div>
      </div>

      {/* Simulated Course / Feature Grid (Horizontal overflow in Broken Mobile Latest Capture) */}
      <div className="p-4 flex-1 bg-white relative">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Featured Tracks
        </div>

        <div
          className={
            isBrokenMobile
              ? 'flex gap-3 w-[445px] relative'
              : isMobile
              ? 'grid grid-cols-1 gap-2.5'
              : 'grid grid-cols-3 gap-3'
          }
        >
          {['Frontend Systems', 'Cloud & Edge APIs', 'UI Architecture'].map((title, i) => (
            <div
              key={title}
              className={`p-3 rounded-lg border border-slate-200 bg-slate-50/70 ${
                isBrokenMobile ? 'w-[140px] shrink-0' : ''
              }`}
            >
              <div className="h-2 w-10 rounded bg-orange-500/80 mb-2" />
              <div className="font-bold text-[11px] text-slate-900">{title}</div>
              <div className="text-[10px] text-slate-500 mt-1">Module 0{i + 1} • 12 Lessons</div>
            </div>
          ))}

          {isBrokenMobile && showOverlay && (
            <div className="absolute -inset-1 border-2 border-red-500 bg-red-500/20 rounded-lg pointer-events-none flex items-end justify-end p-1">
              <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-mono text-[9px] font-bold">
                +55px OVERFLOW
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * INTERACTIVE SSRF & DNS REBINDING FIREWALL SIMULATOR
 */
function SsrfFirewallTester({ darkMode, ui }) {
  const [testUrl, setTestUrl] = useState('http://169.254.169.254/latest/meta-data/');
  const [evalResult, setEvalResult] = useState({
    url: 'http://169.254.169.254/latest/meta-data/',
    blocked: true,
    code: '403 SSRF_GUARD',
    resolvedIp: '169.254.169.254',
    matchedRule: 'CIDR 169.254.0.0/16 (Link-Local Cloud Metadata)',
    latencyMs: 1.2,
  });

  const presets = [
    { label: 'AWS/Cloud Metadata', url: 'http://169.254.169.254/latest/meta-data/' },
    { label: 'Localhost Redis', url: 'http://127.0.0.1:6379' },
    { label: 'Private LAN Router', url: 'http://192.168.1.1/admin' },
    { label: 'Local File URI', url: 'file:///etc/passwd' },
    { label: 'Valid Public Site', url: 'https://tempatbelajar.id' },
  ];

  const evaluateTarget = (raw) => {
    const trimmed = raw.trim();
    const lower = trimmed.toLowerCase();

    if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
      setEvalResult({
        url: trimmed,
        blocked: true,
        code: '403 PROTOCOL_DENIED',
        resolvedIp: 'N/A (Non-HTTP Scheme)',
        matchedRule: 'Strict URI Allowlist (Only http:// and https:// permitted)',
        latencyMs: 0.4,
      });
      return;
    }

    try {
      const parsed = new URL(trimmed);
      const host = parsed.hostname.toLowerCase();

      if (host === 'localhost' || host === '::1' || host.startsWith('127.')) {
        setEvalResult({
          url: trimmed,
          blocked: true,
          code: '403 SSRF_GUARD',
          resolvedIp: host === '::1' ? '::1' : '127.0.0.1',
          matchedRule: 'CIDR 127.0.0.0/8 & ::1 (Loopback Interface)',
          latencyMs: 0.9,
        });
        return;
      }

      if (host.startsWith('169.254.')) {
        setEvalResult({
          url: trimmed,
          blocked: true,
          code: '403 SSRF_GUARD',
          resolvedIp: host,
          matchedRule: 'CIDR 169.254.0.0/16 (Link-Local Cloud Metadata)',
          latencyMs: 1.1,
        });
        return;
      }

      if (
        host.startsWith('10.') ||
        host.startsWith('192.168.') ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
        host.startsWith('fc00:') ||
        host.startsWith('fd00:')
      ) {
        setEvalResult({
          url: trimmed,
          blocked: true,
          code: '403 SSRF_GUARD',
          resolvedIp: host,
          matchedRule: 'RFC1918 / RFC4193 Private Intranet CIDR Blocklist',
          latencyMs: 1.3,
        });
        return;
      }

      setEvalResult({
        url: trimmed,
        blocked: false,
        code: '200 PUBLIC_IP_VERIFIED',
        resolvedIp: '104.21.48.192 (Anycast Edge IP)',
        matchedRule: 'Public Routable IPv4/IPv6 Verified • Allowed in Playwright Context',
        latencyMs: 4.6,
      });
    } catch {
      setEvalResult({
        url: trimmed,
        blocked: true,
        code: '400 MALFORMED_URL',
        resolvedIp: 'Unresolved',
        matchedRule: 'WHATWG URL Parser Validation Failed',
        latencyMs: 0.3,
      });
    }
  };

  return (
    <div className={`p-5 rounded-lg border ${ui.surface} ${ui.border} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#F38020]" />
            <span>Interactive SSRF &amp; DNS Rebinding Firewall Simulator</span>
          </h2>
          <p className={`text-xs mt-0.5 ${ui.textMuted}`}>
            Test how Playwright&apos;s <code className="font-mono">context.route()</code> interceptor validates DNS lookups and blocks internal CIDRs before navigation.
          </p>
        </div>
        <span className="vp-badge px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-600 dark:text-emerald-400 self-start">
          ZERO-TRUST EGRESS ACTIVE
        </span>
      </div>

      {/* Preset Test Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`text-[11px] font-medium mr-1 ${ui.textSubtle}`}>Quick Vectors:</span>
        {presets.map((p) => (
          <button
            key={p.url}
            type="button"
            onClick={() => {
              setTestUrl(p.url);
              evaluateTarget(p.url);
            }}
            className={`px-2.5 py-1 rounded border text-[11px] font-medium transition cursor-pointer ${ui.surfaceSubtle} ${ui.border} ${ui.surfaceHover}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input + Test Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          placeholder="Enter target URL or IP vector..."
          className={`flex-1 px-3 py-2 rounded-md border font-mono text-xs ${ui.input} focus:outline-none focus:border-[#F38020]`}
        />
        <button
          type="button"
          onClick={() => evaluateTarget(testUrl)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-[#F38020] hover:bg-[#E06D10] text-white text-xs font-semibold transition cursor-pointer shrink-0"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Inspect Egress Route</span>
        </button>
      </div>

      {/* Firewall Verdict Banner */}
      <div
        className={`p-3.5 rounded-md border text-xs space-y-1.5 ${
          evalResult.blocked
            ? darkMode
              ? 'bg-red-950/25 border-red-500/40'
              : 'bg-red-50 border-red-200'
            : darkMode
            ? 'bg-emerald-950/25 border-emerald-500/40'
            : 'bg-emerald-50 border-emerald-200'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`vp-badge font-mono text-xs ${
              evalResult.blocked ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {evalResult.blocked ? `⛔ ${evalResult.code}` : `✅ ${evalResult.code}`}
          </span>
          <span className={`font-mono text-[11px] tabular-nums ${ui.textSubtle}`}>
            DNS + CIDR Check: {evalResult.latencyMs}ms
          </span>
        </div>
        <div className="font-mono text-[11px]">
          <span className={ui.textMuted}>Resolved Target:</span> <strong>{evalResult.resolvedIp}</strong>
        </div>
        <div className={`text-[11px] ${ui.textMuted}`}>
          Firewall Policy: <strong>{evalResult.matchedRule}</strong>
        </div>
      </div>
    </div>
  );
}

/**
 * MAIN APPLICATION: VIEWPORTPULSE (CLOUDFLARE ENGINEERING UI)
 */
export default function App() {
  // Theme & Layout Navigation State (Crisp Cloudflare Light mode by default, toggleable Dark mode)
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('telemetry'); // 'telemetry' | 'diff' | 'workers' | 'whitelabel-webhooks'
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Zones & Telemetry Filter State
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [selectedTopZoneId, setSelectedTopZoneId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'REGRESSION' | 'PASSING' | 'SLOW_CWV'
  const [chartMode, setChartMode] = useState('runs'); // 'runs' | 'latency'

  // Visual Diff Inspector State
  const [diffZoneId, setDiffZoneId] = useState('zone-1');
  const [diffViewport, setDiffViewport] = useState('mobile');
  const [diffViewMode, setDiffViewMode] = useState('split'); // 'split' | 'side-by-side'
  const [sliderPos, setSliderPos] = useState(52);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [showDiffOverlay, setShowDiffOverlay] = useState(true);
  const [diffThreshold, setDiffThreshold] = useState(0.5);
  const splitStageRef = useRef(null);

  // White-Label Report Studio & Webhooks Sub-View State
  const [wlWebhookSubView, setWlWebhookSubView] = useState('split'); // 'split' | 'report' | 'webhooks'
  const [wlAgencyName, setWlAgencyName] = useState('Litras Digital');
  const [wlPortalCname, setWlPortalCname] = useState('reports.litraskreatif.com');
  const [wlAccentColor, setWlAccentColor] = useState('#F38020');
  const [wlExecNote, setWlExecNote] = useState(
    'All production templates, interactive forms, and responsive breakpoints have been verified via automated multi-device browser sweeps. Edge caching and Core Web Vitals remain within monthly SLA targets.'
  );
  const [wlHideVpBrand, setWlHideVpBrand] = useState(false);
  const [wlZoneId, setWlZoneId] = useState('zone-6'); // litraskreatif.com default clean report

  // Webhooks & HMAC Secret State
  const [hmacSecret, setHmacSecret] = useState('vp_live_sk_9f84c2b71e40a6d93812f50c');
  const [revealSecret, setRevealSecret] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState(INITIAL_WEBHOOK_LOGS);
  const [expandedLogId, setExpandedLogId] = useState('evt_9941');

  // Add Zone Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newZoneInput, setNewZoneInput] = useState('');
  const [newZoneError, setNewZoneError] = useState('');

  // Bottom Edge Execution Console State
  const [consoleState, setConsoleState] = useState({
    open: false,
    minimized: false,
    zoneDomain: '',
    zoneId: '',
    triggerLabel: '',
    progress: 0,
    done: false,
    verdict: 'PASSING',
    logs: [],
  });
  const executionTimersRef = useRef([]);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, tone = 'info') => {
    setToast({ message, tone });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 3400);
  };

  // Cleanup active timers on unmount
  useEffect(() => {
    return () => {
      executionTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Theme Token Map (Cloudflare Crisp Light Mode vs Deep Edge Dark Mode)
  const ui = darkMode
    ? {
        canvas: 'bg-[#0D1117] text-[#E6EDF3]',
        surface: 'bg-[#161B22]',
        surfaceSubtle: 'bg-[#0D1117]',
        surfaceHover: 'hover:bg-[#1F2630]',
        border: 'border-[#30363D]',
        textMuted: 'text-[#8B949E]',
        textSubtle: 'text-[#6E7681]',
        input: 'bg-[#0D1117] border-[#30363D] text-[#E6EDF3] placeholder-[#6E7681]',
        railActive: 'bg-[#F38020]/15 text-[#F38020] border-l-2 border-[#F38020] font-semibold',
        railInactive: 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1F2630]',
      }
    : {
        canvas: 'bg-[#F7F8FA] text-[#0F172A]',
        surface: 'bg-[#FFFFFF]',
        surfaceSubtle: 'bg-[#F7F8FA]',
        surfaceHover: 'hover:bg-[#F1F5F9]',
        border: 'border-[#E2E8F0]',
        textMuted: 'text-[#475569]',
        textSubtle: 'text-[#64748B]',
        input: 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8]',
        railActive: 'bg-[#FFF7ED] text-[#C2410C] border-l-2 border-[#F38020] font-semibold',
        railInactive: 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]',
      };

  // Derived Portfolio KPIs
  const totalZones = zones.length;
  const totalViewports = totalZones * 3;
  const passingViewports = zones.reduce((acc, z) => {
    return (
      acc +
      (z.viewports.desktop === 'PASS' ? 1 : 0) +
      (z.viewports.tablet === 'PASS' ? 1 : 0) +
      (z.viewports.mobile === 'PASS' ? 1 : 0)
    );
  }, 0);
  const passRatePct = ((passingViewports / totalViewports) * 100).toFixed(1);
  const activeRegressions = zones.filter((z) => z.status === 'REGRESSION').length;
  const sortedLcps = [...zones].map((z) => z.lcp).sort((a, b) => a - b);
  const medianLcp =
    sortedLcps.length % 2 === 0
      ? ((sortedLcps[sortedLcps.length / 2 - 1] + sortedLcps[sortedLcps.length / 2]) / 2).toFixed(2)
      : sortedLcps[Math.floor(sortedLcps.length / 2)].toFixed(2);

  // Filtered Zones for Telemetry Roster Table
  const filteredZones = zones.filter((z) => {
    const matchesTopSelect = selectedTopZoneId === 'ALL' || z.id === selectedTopZoneId;
    const matchesSearch = z.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || z.status === statusFilter;
    return matchesTopSelect && matchesSearch && matchesStatus;
  });

  const activeDiffZone = zones.find((z) => z.id === diffZoneId) || zones[0];
  const activeReportZone = zones.find((z) => z.id === wlZoneId) || zones[zones.length - 1];

  // Drag Handler for Split Slider
  const updateSliderFromClientX = (clientX) => {
    if (!splitStageRef.current) return;
    const rect = splitStageRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(6, Math.min(94, pct)));
  };

  // Simulate Backend BullMQ + Playwright + Pixelmatch + R2 Execution Pipeline
  const triggerBackendExecution = ({ zoneId, domain, triggerLabel, forceStatus = null }: any) => {
    executionTimersRef.current.forEach((t) => clearTimeout(t));
    executionTimersRef.current = [];

    const existingZone = zones.find((z) => z.id === zoneId);
    const outcome = forceStatus || (existingZone ? existingZone.status : 'PASSING');

    setConsoleState({
      open: true,
      minimized: false,
      zoneDomain: domain,
      zoneId,
      triggerLabel,
      progress: 12,
      done: false,
      verdict: outcome,
      logs: [
        {
          time: new Date().toTimeString().split(' ')[0],
          tag: 'BULLMQ',
          msg: `Enqueued job audit:${zoneId} (${triggerLabel}) → Assigned to worker-sgp-01`,
        },
      ],
    });

    const steps = [
      {
        delay: 420,
        progress: 34,
        tag: 'SSRF-GUARD',
        msg: `DNS resolved ${domain} → Public Anycast IP verified (CIDR private ranges clean)`,
      },
      {
        delay: 900,
        progress: 62,
        tag: 'PLAYWRIGHT',
        msg: `Captured full-page PNGs across 1440×900, 768×1024 & 390×844 in isolated context`,
      },
      {
        delay: 1400,
        progress: 86,
        tag: 'PIXELMATCH',
        msg:
          outcome === 'REGRESSION'
            ? `ALERT: 390×844 mobile delta = 2.84% (9,350px > 0.50% threshold) • Diff PNG generated`
            : `Compared buffers vs Cloudflare R2 baseline → 0.00% layout shift across all viewports`,
      },
      {
        delay: 1850,
        progress: 100,
        tag: 'R2+POSTGRES',
        msg: `Uploaded artifacts to Cloudflare R2 (19ms) & committed audit record to PostgreSQL`,
        complete: true,
      },
    ];

    steps.forEach((step) => {
      const timer = setTimeout(() => {
        setConsoleState((prev) => ({
          ...prev,
          progress: step.progress,
          done: Boolean(step.complete),
          logs: [
            ...prev.logs,
            {
              time: new Date().toTimeString().split(' ')[0],
              tag: step.tag,
              msg: step.msg,
            },
          ],
        }));

        if (step.complete) {
          setZones((prev) =>
            prev.map((z) => (z.id === zoneId ? { ...z, lastChecked: 'Just now' } : z))
          );
        }
      }, step.delay);
      executionTimersRef.current.push(timer);
    });
  };

  // Trigger WordPress Plugin Update Simulation
  const handleSimulateWpUpdate = () => {
    const newEvt = {
      id: `evt_${Math.floor(1000 + Math.random() * 9000)}`,
      site: 'tempatbelajar.id',
      event: 'upgrader_process_complete',
      detail: 'Plugin updated: bricks-builder 1.11.1 → 1.11.2 (Live Webhook)',
      httpStatus: 202,
      outcome: 'REGRESSION_DETECTED',
      timestamp: 'Just now',
      payload: {
        event: 'upgrader_process_complete',
        type: 'plugin',
        slug: 'bricks/bricks.php',
        from_version: '1.11.1',
        to_version: '1.11.2',
        site_url: 'https://tempatbelajar.id',
        viewports: ['1440x900', '768x1024', '390x844'],
      },
    };

    setWebhookLogs((prev) => [newEvt, ...prev]);
    setExpandedLogId(newEvt.id);

    // Ensure tempatbelajar.id exhibits the mobile regression so it can be inspected immediately
    setZones((prev) =>
      prev.map((z) =>
        z.id === 'zone-1'
          ? {
              ...z,
              status: 'REGRESSION',
              viewports: { desktop: 'PASS', tablet: 'PASS', mobile: 'DIFF' },
              pixelDelta: 2.84,
              changedPixels: 9350,
              cls: 0.14,
            }
          : z
      )
    );

    triggerBackendExecution({
      zoneId: 'zone-1',
      domain: 'tempatbelajar.id',
      triggerLabel: 'WP Plugin: Bricks 1.11.2',
      forceStatus: 'REGRESSION',
    });
  };

  // Approve & Promote Latest Capture to R2 Baseline (updates zone + logs to Edge Execution Console)
  const handlePromoteToBaseline = () => {
    const promotedDomain = activeDiffZone.domain;
    const promotedZoneId = activeDiffZone.id;
    const now = new Date().toTimeString().split(' ')[0];

    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== promotedZoneId) return z;
        return {
          ...z,
          status: 'PASSING',
          viewports: { desktop: 'PASS', tablet: 'PASS', mobile: 'PASS' },
          pixelDelta: 0.0,
          changedPixels: 0,
          cls: z.id === 'zone-1' ? 0.01 : z.cls,
          lcp: z.id === 'zone-5' ? 1.6 : z.lcp,
          lastChecked: 'Baseline promoted just now',
          suspectedSelector: 'None — Promoted to R2 baseline',
          diffSummary: 'Latest capture promoted to approved Cloudflare R2 baseline across all viewports.',
        };
      })
    );

    setConsoleState({
      open: true,
      minimized: false,
      zoneDomain: promotedDomain,
      zoneId: promotedZoneId,
      triggerLabel: 'Baseline Promotion (R2 + Postgres)',
      progress: 100,
      done: true,
      verdict: 'PASSING',
      logs: [
        {
          time: now,
          tag: 'R2-BASELINE',
          msg: `Copied latest 1440×900, 768×1024 & 390×844 PNG artifacts to baselines/${promotedDomain}/`,
        },
        {
          time: now,
          tag: 'POSTGRES',
          msg: `Updated baseline_hash & reset pixel_delta=0.00% for ${promotedDomain} (status=PASSING)`,
        },
      ],
    });

    showToast(`Approved & promoted ${promotedDomain} as new R2 baseline`, 'success');
  };

  // Restore Demo Regression on tempatbelajar.id
  const handleRestoreDemoRegression = () => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === 'zone-1'
          ? {
              ...z,
              status: 'REGRESSION',
              viewports: { desktop: 'PASS', tablet: 'PASS', mobile: 'DIFF' },
              pixelDelta: 2.84,
              changedPixels: 9350,
              cls: 0.14,
              lastChecked: 'Restored demo regression',
              suspectedSelector: '.brx-nav-cta, .tb-course-grid',
              diffSummary:
                'Mobile nav CTA button wrapped downward (+38px Y-axis) overlapping hero H1; course card grid exceeds 390px viewport (+55px horizontal overflow).',
            }
          : z
      )
    );
    setDiffViewport('mobile');
    setShowDiffOverlay(true);
    showToast('Restored mobile regression on tempatbelajar.id (390×844)', 'info');
  };

  // Add New Monitored Zone (With SSRF Guard Check)
  const handleAddZoneSubmit = (e) => {
    e.preventDefault();
    setNewZoneError('');
    const raw = newZoneInput.trim();
    if (!raw) {
      setNewZoneError('Please enter a valid public domain or HTTPS URL.');
      return;
    }

    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      const parsed = new URL(withProtocol);
      const host = parsed.hostname.toLowerCase();

      if (
        host === 'localhost' ||
        host === '::1' ||
        host.startsWith('127.') ||
        host.startsWith('10.') ||
        host.startsWith('192.168.') ||
        host.startsWith('169.254.') ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
      ) {
        setNewZoneError('SSRF Guard Blocked: Private, loopback, or link-local IP addresses are rejected.');
        return;
      }

      if (!host.includes('.')) {
        setNewZoneError('Please enter a fully qualified public domain name (e.g., client-site.com).');
        return;
      }

      const newId = `zone-${Date.now()}`;
      const newZone = {
        id: newId,
        domain: host,
        url: `${parsed.protocol}//${host}`,
        status: 'PASSING',
        viewports: { desktop: 'PASS', tablet: 'PASS', mobile: 'PASS' },
        pixelDelta: 0.0,
        changedPixels: 0,
        lcp: 1.2,
        cls: 0.01,
        ttfb: 84,
        edgePop: 'SIN-01',
        lastChecked: 'Baseline capturing...',
        suspectedSelector: 'None',
        diffSummary: 'Initial multi-viewport baseline captured and stored in Cloudflare R2.',
      };

      setZones((prev) => [newZone, ...prev]);
      setNewZoneInput('');
      setAddModalOpen(false);
      triggerBackendExecution({
        zoneId: newId,
        domain: host,
        triggerLabel: 'Initial Baseline Enrollment',
        forceStatus: 'PASSING',
      });
    } catch {
      setNewZoneError('Invalid URL format. Example: https://agencyclient.com');
    }
  };

  // Copy Helper
  const copyText = (text, label) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    showToast(`Copied ${label} to clipboard`, 'success');
  };

  // Rotate HMAC Secret
  const handleRotateSecret = () => {
    const chars = 'abcdef0123456789';
    let randomHex = '';
    for (let i = 0; i < 24; i += 1) {
      randomHex += chars[Math.floor(Math.random() * chars.length)];
    }
    setHmacSecret(`vp_live_sk_${randomHex}`);
    showToast('Rotated HMAC-SHA256 signing key. Update your WP mu-plugin.', 'info');
  };

  // Jump straight to Visual Diff Inspector for a specific zone & viewport
  const inspectZoneViewport = (zoneId, vpKey = 'mobile') => {
    setDiffZoneId(zoneId);
    setDiffViewport(vpKey);
    setActiveNav('diff');
  };

  // Left Navigation Rail Structure (4 Main Navigation Tabs)
  const navSections = [
    {
      header: 'OVERVIEW',
      items: [{ id: 'telemetry', label: 'Zones & Telemetry', icon: Globe }],
    },
    {
      header: 'VISUAL QA',
      items: [
        {
          id: 'diff',
          label: 'Visual Diff Inspector',
          icon: Layers,
          badge: activeRegressions > 0 ? activeRegressions : null,
        },
      ],
    },
    {
      header: 'INFRASTRUCTURE',
      items: [{ id: 'workers', label: 'Workers & Security', icon: ShieldCheck }],
    },
    {
      header: 'CLIENT & INTEGRATIONS',
      items: [{ id: 'whitelabel-webhooks', label: 'White-Label & Webhooks', icon: FileCheck2 }],
    },
  ];

  const isExceedingThreshold = activeDiffZone.pixelDelta > diffThreshold;

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-150 ${ui.canvas}`}>
      {/* Open Sauce Two + JetBrains Mono Typography & Print Styles */}
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@fontsource/open-sauce-two@latest/400.css');
        @import url('https://cdn.jsdelivr.net/npm/@fontsource/open-sauce-two@latest/500.css');
        @import url('https://cdn.jsdelivr.net/npm/@fontsource/open-sauce-two@latest/600.css');
        @import url('https://cdn.jsdelivr.net/npm/@fontsource/open-sauce-two@latest/700.css');
        @import url('https://cdn.jsdelivr.net/npm/@fontsource/open-sauce-two@latest/800.css');
        @import url('https://fonts.cdnfonts.com/css/open-sauce-two');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        html,
        body,
        button,
        input,
        select,
        textarea,
        h1,
        h2,
        h3,
        h4,
        table,
        th,
        td,
        .font-sans,
        #cf-whitelabel-printable,
        #cf-whitelabel-printable * {
          font-family: 'Open Sauce Two', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        h1,
        h2,
        .vp-kpi-number {
          letter-spacing: -0.02em;
        }

        th,
        .vp-badge {
          font-weight: 600;
        }

        .font-mono {
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace !important;
        }

        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #cf-whitelabel-printable,
          #cf-whitelabel-printable * {
            visibility: visible;
          }
          #cf-whitelabel-printable {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* =====================================================================
          1. TOP CLOUDFLARE UTILITY HEADER
         ===================================================================== */}
      <header className={`sticky top-0 z-40 h-14 border-b ${ui.surface} ${ui.border}`}>
        <div className="h-full px-3 sm:px-5 flex items-center justify-between gap-2">
          {/* Left: Mobile Drawer Trigger + Brand + Account Switcher + Zone Breadcrumb */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              className={`lg:hidden p-1.5 rounded-md border ${ui.border} ${ui.surfaceHover} cursor-pointer`}
              aria-label="Toggle Navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Geometric Cloudflare-Inspired Orange Cloud/Pulse Mark + Logo */}
            <div
              onClick={() => {
                setSelectedTopZoneId('ALL');
                setActiveNav('telemetry');
              }}
              className="flex items-center gap-2 cursor-pointer shrink-0"
            >
              <div className="w-8 h-8 rounded-md bg-[#F38020] flex items-center justify-center shadow-xs">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M17.5 18H6.8C4.7 18 3 16.3 3 14.2C3 12.3 4.4 10.7 6.3 10.4C7.1 7.8 9.5 6 12.3 6C15.5 6 18.2 8.4 18.5 11.5C20.2 11.9 21.5 13.4 21.5 15.2C21.5 16.8 19.7 18 17.5 18Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M7.5 14.2H10.2L11.4 11.8L13.1 16L14.4 13.5H16.8"
                    stroke="#F38020"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight">ViewportPulse</span>
                <span
                  className={`vp-badge hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${ui.border} ${ui.surfaceSubtle} ${ui.textMuted}`}
                  title="Global UI Typeface: Open Sauce Two"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F38020]" />
                  <span>Open Sauce Two</span>
                </span>
              </div>
            </div>

            <ChevronRight className={`w-4 h-4 hidden sm:block shrink-0 ${ui.textSubtle}`} />

            {/* Account Tier Badge */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-medium">Litras Digital</span>
              <span className="vp-badge px-1.5 py-0.5 rounded text-[10px] bg-[#F38020]/15 text-[#F38020] border border-[#F38020]/30">
                AGENCY • $129/MO
              </span>
            </div>

            <ChevronRight className={`w-4 h-4 hidden md:block shrink-0 ${ui.textSubtle}`} />

            {/* Zone Quick-Jump Dropdown */}
            <div className="relative hidden sm:block">
              <select
                aria-label="Zone Selector"
                value={selectedTopZoneId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedTopZoneId(val);
                  if (val !== 'ALL') {
                    setDiffZoneId(val);
                    setWlZoneId(val);
                  }
                }}
                className={`appearance-none text-xs font-medium pl-2.5 pr-7 py-1.5 rounded-md border ${ui.input} focus:outline-none focus:border-[#F38020] cursor-pointer`}
              >
                <option value="ALL">All Zones ({zones.length})</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.domain}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${ui.textSubtle}`}
              />
            </div>
          </div>

          {/* Right: Simulate WP Webhook + "+ Add Zone" Orange CTA + Theme Toggle + User Badge */}
          <div className="flex items-center gap-2">
            {/* Simulate WP Webhook Header Trigger */}
            <button
              type="button"
              onClick={handleSimulateWpUpdate}
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition cursor-pointer ${ui.surfaceSubtle} ${ui.border} ${ui.surfaceHover}`}
            >
              <Webhook className="w-3.5 h-3.5 text-[#F38020]" />
              <span>Simulate WP Webhook</span>
            </button>

            {/* + Add Zone Primary Cloudflare Orange CTA */}
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F38020] hover:bg-[#E06D10] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Zone</span>
            </button>

            {/* Theme Switcher */}
            <button
              type="button"
              onClick={() => setDarkMode((v) => !v)}
              title={darkMode ? 'Switch to Cloudflare Crisp Light Mode' : 'Switch to Edge Dark Mode'}
              className={`p-1.5 rounded-md border ${ui.border} ${ui.surfaceSubtle} ${ui.surfaceHover} transition cursor-pointer`}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Workspace Avatar */}
            <div
              className={`hidden xl:flex items-center gap-2 pl-2 border-l ${ui.border} text-xs`}
              title="Authenticated Agency Account"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center">
                LD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. MAIN WORKSPACE SHELL (COLLAPSIBLE LEFT RAIL + FLUID CONTENT)
         ===================================================================== */}
      <div className="flex-1 flex relative">
        {/* Mobile Overlay Backdrop */}
        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          />
        )}

        {/* Left Cloudflare Navigation Rail */}
        <aside
          className={`fixed lg:sticky top-14 z-30 h-[calc(100vh-3.5rem)] border-r ${ui.surface} ${ui.border} flex flex-col justify-between transition-all duration-150 ${
            railCollapsed ? 'w-16' : 'w-60'
          } ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="py-3 overflow-y-auto space-y-4">
            {navSections.map((section) => (
              <div key={section.header}>
                {!railCollapsed && (
                  <div className={`px-4 mb-1.5 text-[10px] font-bold tracking-wider uppercase ${ui.textSubtle}`}>
                    {section.header}
                  </div>
                )}
                <div className="space-y-0.5 px-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveNav(item.id);
                          setMobileNavOpen(false);
                        }}
                        title={railCollapsed ? item.label : undefined}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-xs transition cursor-pointer ${
                          isActive ? ui.railActive : ui.railInactive
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F38020]' : ''}`} />
                          {!railCollapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!railCollapsed && item.badge && (
                          <span className="vp-badge px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] tabular-nums">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Rail Footer: Edge PoP Status & Collapse Button */}
          <div className={`p-3 border-t ${ui.border} space-y-2`}>
            {!railCollapsed && (
              <div className={`p-2.5 rounded-md border text-[11px] ${ui.surfaceSubtle} ${ui.border}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Edge Workers Online
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">3/3</span>
                </div>
                <div className={`mt-1 text-[10px] tabular-nums ${ui.textSubtle}`}>
                  R2 Storage: 0ms Egress • SGP/CGK
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setRailCollapsed((v) => !v)}
              className={`hidden lg:flex w-full items-center justify-center gap-1.5 py-1.5 rounded-md border text-xs ${ui.border} ${ui.textMuted} ${ui.surfaceHover} cursor-pointer`}
            >
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${railCollapsed ? '' : 'rotate-180'}`} />
              {!railCollapsed && <span>Collapse Sidebar</span>}
            </button>
          </div>
        </aside>

        {/* Main Workspace Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 pb-28 max-w-[1440px] mx-auto w-full">
          {/* -----------------------------------------------------------------
              VIEW 1: ZONES & EDGE TELEMETRY (DEFAULT CLOUDFLARE OVERVIEW)
             ----------------------------------------------------------------- */}
          {activeNav === 'telemetry' && (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold">
                    Zones &amp; Edge Telemetry
                  </h1>
                  <p className={`text-xs mt-0.5 ${ui.textMuted}`}>
                    Continuous multi-viewport visual regression sweeps and Core Web Vitals telemetry across monitored agency domains.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateWpUpdate}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition cursor-pointer ${ui.surface} ${ui.border} ${ui.surfaceHover}`}
                  >
                    <Webhook className="w-3.5 h-3.5 text-[#F38020]" />
                    <span>Simulate WP Update</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      triggerBackendExecution({
                        zoneId: 'zone-2',
                        domain: 'pekotype.com',
                        triggerLabel: 'Full Portfolio Sweep',
                        forceStatus: 'PASSING',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F38020] hover:bg-[#E06D10] text-white text-xs font-semibold transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run All Audits</span>
                  </button>
                </div>
              </div>

              {/* 4 Cloudflare KPI Metric Cards with Mini SVG Sparklines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* KPI 1: Active Zones */}
                <div className={`p-4 rounded-lg border ${ui.surface} ${ui.border} flex items-center justify-between gap-3`}>
                  <div>
                    <div className={`text-xs font-medium ${ui.textMuted}`}>Active Zones</div>
                    <div className="vp-kpi-number text-2xl font-bold tabular-nums mt-1">
                      {totalZones}
                    </div>
                    <div className={`text-[11px] tabular-nums mt-1 ${ui.textSubtle}`}>
                      50 max • SGP &amp; CGK PoPs
                    </div>
                  </div>
                  <MiniSparkline points={[4, 4, 5, 5, 6, 6, 6]} strokeColor="#F38020" />
                </div>

                {/* KPI 2: Viewport Pass Rate */}
                <div className={`p-4 rounded-lg border ${ui.surface} ${ui.border} flex items-center justify-between gap-3`}>
                  <div>
                    <div className={`text-xs font-medium ${ui.textMuted}`}>Viewport Pass Rate</div>
                    <div className="vp-kpi-number text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                      {passRatePct}%
                    </div>
                    <div className={`text-[11px] tabular-nums mt-1 ${ui.textSubtle}`}>
                      {passingViewports}/{totalViewports} viewports passing
                    </div>
                  </div>
                  <MiniSparkline points={[94.4, 100, 94.4, 94.4, 100, 94.4, Number(passRatePct)]} strokeColor="#10B981" />
                </div>

                {/* KPI 3: Active Regressions */}
                <div
                  onClick={() => inspectZoneViewport('zone-1', 'mobile')}
                  className={`p-4 rounded-lg border flex items-center justify-between gap-3 transition cursor-pointer ${
                    activeRegressions > 0
                      ? darkMode
                        ? 'bg-red-950/20 border-red-500/40 hover:border-red-500'
                        : 'bg-red-50/60 border-red-300 hover:border-red-500'
                      : `${ui.surface} ${ui.border}`
                  }`}
                >
                  <div>
                    <div className={`text-xs font-medium ${ui.textMuted}`}>Active Regressions</div>
                    <div
                      className={`vp-kpi-number text-2xl font-bold tabular-nums mt-1 ${
                        activeRegressions > 0 ? 'text-red-600 dark:text-red-400' : ''
                      }`}
                    >
                      {activeRegressions}
                    </div>
                    <div className="text-[11px] tabular-nums mt-1 text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                      {activeRegressions > 0 ? (
                        <>
                          <span>Inspect Mobile Diff</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">All layouts nominal</span>
                      )}
                    </div>
                  </div>
                  <MiniSparkline points={[0, 1, 0, 0, 2, 1, activeRegressions]} strokeColor="#EF4444" />
                </div>

                {/* KPI 4: Median Edge LCP */}
                <div className={`p-4 rounded-lg border ${ui.surface} ${ui.border} flex items-center justify-between gap-3`}>
                  <div>
                    <div className={`text-xs font-medium ${ui.textMuted}`}>Median Edge LCP</div>
                    <div className="vp-kpi-number text-2xl font-bold tabular-nums mt-1">
                      {medianLcp}s
                    </div>
                    <div className="text-[11px] tabular-nums mt-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      SLA Target &lt; 2.50s
                    </div>
                  </div>
                  <MiniSparkline points={[1.58, 1.52, 1.49, 1.44, 1.46, 1.41, Number(medianLcp)]} strokeColor="#0EA5E9" />
                </div>
              </div>

              {/* 24-Hour Edge Telemetry Area Chart Card */}
              <div className={`p-5 rounded-lg border ${ui.surface} ${ui.border} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#F38020]" />
                      <span>24-Hour Edge QA &amp; Core Web Vitals Telemetry</span>
                    </h2>
                    <p className={`text-xs mt-0.5 ${ui.textMuted}`}>
                      Playwright audit throughput, pixel-diff detections (red dots), and Edge PoP latency over the past 24 hours.
                    </p>
                  </div>

                  {/* Chart Metric Switcher */}
                  <div className={`inline-flex p-0.5 rounded-md border ${ui.surfaceSubtle} ${ui.border} self-start`}>
                    <button
                      type="button"
                      onClick={() => setChartMode('runs')}
                      className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                        chartMode === 'runs'
                          ? 'bg-[#F38020] text-white shadow-2xs'
                          : `${ui.textMuted} hover:text-[#F38020]`
                      }`}
                    >
                      Audit Runs &amp; Diffs
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartMode('latency')}
                      className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                        chartMode === 'latency'
                          ? 'bg-[#0EA5E9] text-white shadow-2xs'
                          : `${ui.textMuted} hover:text-[#0EA5E9]`
                      }`}
                    >
                      LCP / TTFB Latency (ms)
                    </button>
                  </div>
                </div>

                <TelemetryAreaChart data={TELEMETRY_24H} mode={chartMode} darkMode={darkMode} />
              </div>

              {/* Monitored Zones Data Table Card */}
              <div className={`rounded-lg border overflow-hidden ${ui.surface} ${ui.border}`}>
                {/* Table Toolbar: Search & Status Filter Pills */}
                <div className={`p-4 border-b ${ui.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                  <div className="relative flex-1 max-w-xs">
                    <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${ui.textSubtle}`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter zones by domain..."
                      className={`w-full pl-8 pr-3 py-1.5 rounded-md border text-xs ${ui.input} focus:outline-none focus:border-[#F38020]`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'ALL', label: `All (${zones.length})` },
                      { id: 'REGRESSION', label: `Regression (${zones.filter((z) => z.status === 'REGRESSION').length})` },
                      { id: 'PASSING', label: `Passing (${zones.filter((z) => z.status === 'PASSING').length})` },
                      { id: 'SLOW_CWV', label: `Slow CWV (${zones.filter((z) => z.status === 'SLOW_CWV').length})` },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setStatusFilter(pill.id)}
                        className={`px-2.5 py-1 rounded-md border text-xs font-medium transition cursor-pointer ${
                          statusFilter === pill.id
                            ? 'bg-[#F38020] border-[#F38020] text-white'
                            : `${ui.surfaceSubtle} ${ui.border} ${ui.textMuted} ${ui.surfaceHover}`
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Responsive Table Wrapper */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${ui.border} ${ui.surfaceSubtle} text-[11px] uppercase tracking-wider ${ui.textSubtle}`}>
                        <th className="py-2.5 px-4">Zone / Domain</th>
                        <th className="py-2.5 px-3">QA Status</th>
                        <th className="py-2.5 px-3">Viewports (D / T / M)</th>
                        <th className="py-2.5 px-3">Pixel Delta</th>
                        <th className="py-2.5 px-3">Core Web Vitals</th>
                        <th className="py-2.5 px-3">Last Sweep</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-[#30363D]' : 'divide-[#E2E8F0]'} text-xs`}>
                      {filteredZones.map((zone) => (
                        <tr key={zone.id} className={`${ui.surfaceHover} transition-colors`}>
                          {/* Domain + Edge PoP */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-xs flex items-center gap-2">
                              <span>{zone.domain}</span>
                              <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded border ${ui.border} ${ui.textSubtle}`}>
                                {zone.edgePop}
                              </span>
                            </div>
                            <div className={`text-[11px] font-mono mt-0.5 ${ui.textSubtle}`}>{zone.url}</div>
                          </td>

                          {/* QA Status Badge */}
                          <td className="py-3 px-3">
                            {zone.status === 'REGRESSION' && (
                              <span className="vp-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-[11px]">
                                <AlertTriangle className="w-3 h-3" />
                                <span>REGRESSION</span>
                              </span>
                            )}
                            {zone.status === 'PASSING' && (
                              <span className="vp-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px]">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>PASSING</span>
                              </span>
                            )}
                            {zone.status === 'SLOW_CWV' && (
                              <span className="vp-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[11px]">
                                <Clock className="w-3 h-3" />
                                <span>SLOW CWV</span>
                              </span>
                            )}
                          </td>

                          {/* Clickable Viewport Pills */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              {Object.values(VIEWPORT_SPECS).map((vp) => {
                                const vpStatus = zone.viewports[vp.key];
                                const isDiff = vpStatus === 'DIFF';
                                return (
                                  <button
                                    key={vp.key}
                                    type="button"
                                    onClick={() => inspectZoneViewport(zone.id, vp.key)}
                                    title={`Inspect ${zone.domain} at ${vp.dims}`}
                                    className={`vp-badge px-2 py-0.5 rounded border text-[10px] tabular-nums transition cursor-pointer ${
                                      isDiff
                                        ? 'bg-red-500 text-white border-red-600 shadow-2xs'
                                        : darkMode
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-400'
                                        : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400'
                                    }`}
                                  >
                                    {vp.label[0]}: {vpStatus}
                                  </button>
                                );
                              })}
                            </div>
                          </td>

                          {/* Pixel Delta */}
                          <td className="py-3 px-3 tabular-nums">
                            <span
                              className={`font-semibold ${
                                zone.pixelDelta > 0.5
                                  ? 'text-red-600 dark:text-red-400'
                                  : zone.pixelDelta > 0
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {zone.pixelDelta.toFixed(2)}%
                            </span>
                            <div className={`text-[10px] ${ui.textSubtle}`}>
                              {zone.changedPixels.toLocaleString()} px
                            </div>
                          </td>

                          {/* Core Web Vitals */}
                          <td className="py-3 px-3 tabular-nums">
                            <div className="flex items-center gap-2 text-[11px]">
                              <span
                                className={`font-semibold ${
                                  zone.lcp > 2.5 ? 'text-amber-600 dark:text-amber-400' : ''
                                }`}
                              >
                                LCP {zone.lcp.toFixed(1)}s
                              </span>
                              <span className={ui.textSubtle}>•</span>
                              <span
                                className={
                                  zone.cls > 0.1 ? 'text-red-600 dark:text-red-400 font-semibold' : ui.textMuted
                                }
                              >
                                CLS {zone.cls.toFixed(2)}
                              </span>
                            </div>
                            <div className={`text-[10px] ${ui.textSubtle}`}>TTFB {zone.ttfb}ms</div>
                          </td>

                          {/* Last Sweep */}
                          <td className={`py-3 px-3 text-[11px] tabular-nums ${ui.textMuted}`}>
                            {zone.lastChecked}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  inspectZoneViewport(
                                    zone.id,
                                    zone.viewports.mobile === 'DIFF' ? 'mobile' : 'desktop'
                                  )
                                }
                                className={`px-2.5 py-1 rounded border text-[11px] font-medium transition cursor-pointer ${ui.surfaceSubtle} ${ui.border} ${ui.surfaceHover}`}
                              >
                                Inspect Diff
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  triggerBackendExecution({
                                    zoneId: zone.id,
                                    domain: zone.domain,
                                    triggerLabel: 'On-Demand Edge Audit',
                                  })
                                }
                                title="Run Immediate Playwright Sweep"
                                className="p-1.5 rounded bg-[#F38020]/15 hover:bg-[#F38020] text-[#F38020] hover:text-white transition cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              VIEW 2: VISUAL DIFF INSPECTOR
             ----------------------------------------------------------------- */}
          {activeNav === 'diff' && (
            <div className="space-y-5">
              {/* Top Inspector Control Bar */}
              <div className={`p-4 rounded-lg border ${ui.surface} ${ui.border} flex flex-wrap items-center justify-between gap-3`}>
                {/* Left: Zone Dropdown + Viewport Selector Dropdown & Tabs */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <select
                      aria-label="Zone Selector"
                      value={activeDiffZone.id}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        setDiffZoneId(nextId);
                        const found = zones.find((z) => z.id === nextId);
                        if (found?.viewports.mobile === 'DIFF') {
                          setDiffViewport('mobile');
                        }
                      }}
                      className={`appearance-none text-xs font-semibold pl-3 pr-8 py-2 rounded-md border ${ui.input} focus:outline-none focus:border-[#F38020] cursor-pointer`}
                    >
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.domain} ({z.pixelDelta.toFixed(2)}% delta)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${ui.textSubtle}`} />
                  </div>

                  {/* Viewport Selector Dropdown */}
                  <div className="relative">
                    <select
                      aria-label="Viewport Selector"
                      value={diffViewport}
                      onChange={(e) => setDiffViewport(e.target.value)}
                      className={`appearance-none text-xs font-semibold pl-3 pr-8 py-2 rounded-md border tabular-nums ${ui.input} focus:outline-none focus:border-[#F38020] cursor-pointer`}
                    >
                      {Object.values(VIEWPORT_SPECS).map((vp) => (
                        <option key={vp.key} value={vp.key}>
                          {vp.label} ({vp.dims})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${ui.textSubtle}`} />
                  </div>

                  {/* Viewport Quick Switcher Pills */}
                  <div className={`hidden sm:inline-flex p-0.5 rounded-md border ${ui.surfaceSubtle} ${ui.border}`}>
                    {Object.values(VIEWPORT_SPECS).map((vp) => {
                      const Icon = vp.icon;
                      const active = diffViewport === vp.key;
                      const hasDiff = activeDiffZone.viewports[vp.key] === 'DIFF';
                      return (
                        <button
                          key={vp.key}
                          type="button"
                          onClick={() => setDiffViewport(vp.key)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                            active
                              ? 'bg-[#F38020] text-white shadow-2xs'
                              : `${ui.textMuted} hover:text-[#F38020]`
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{vp.label}</span>
                          {hasDiff && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: View Mode, Pixelmatch Overlay Toggle & Baseline Promotion */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Split vs Side-by-Side Toggle */}
                  <div className={`inline-flex p-0.5 rounded-md border ${ui.surfaceSubtle} ${ui.border}`}>
                    <button
                      type="button"
                      onClick={() => setDiffViewMode('split')}
                      className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                        diffViewMode === 'split' ? 'bg-slate-800 text-white' : ui.textMuted
                      }`}
                    >
                      Split Slider
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiffViewMode('side-by-side')}
                      className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                        diffViewMode === 'side-by-side' ? 'bg-slate-800 text-white' : ui.textMuted
                      }`}
                    >
                      Side-by-Side
                    </button>
                  </div>

                  {/* Crimson Bounding Overlay Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowDiffOverlay((v) => !v)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition cursor-pointer ${
                      showDiffOverlay
                        ? 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400'
                        : `${ui.surfaceSubtle} ${ui.border} ${ui.textMuted}`
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Diff Overlay: {showDiffOverlay ? 'ON' : 'OFF'}</span>
                  </button>

                  {/* Approve as New Baseline */}
                  {activeDiffZone.status !== 'PASSING' ? (
                    <button
                      type="button"
                      onClick={handlePromoteToBaseline}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve as New Baseline</span>
                    </button>
                  ) : activeDiffZone.id === 'zone-1' ? (
                    <button
                      type="button"
                      onClick={handleRestoreDemoRegression}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium cursor-pointer ${ui.surfaceSubtle} ${ui.border} ${ui.surfaceHover}`}
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#F38020]" />
                      <span>Restore Demo Diff</span>
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Regression Telemetry Banner & Sensitivity Slider */}
              <div className={`p-4 rounded-lg border ${ui.surface} ${ui.border} grid grid-cols-1 lg:grid-cols-12 gap-4 items-center`}>
                <div className="lg:col-span-8 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`vp-badge px-2 py-0.5 rounded text-[11px] ${
                        isExceedingThreshold
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {isExceedingThreshold ? 'REGRESSION EXCEEDS SLA' : 'WITHIN TOLERANCE'}
                    </span>
                    <span className="text-xs font-bold tabular-nums">
                      Delta: {activeDiffZone.pixelDelta.toFixed(2)}% ({activeDiffZone.changedPixels.toLocaleString()} px)
                    </span>
                    <span className={`text-xs font-mono ${ui.textSubtle}`}>
                      • Selector: {activeDiffZone.suspectedSelector}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${ui.textMuted}`}>{activeDiffZone.diffSummary}</p>
                </div>

                {/* Live Diff Sensitivity Threshold Slider */}
                <div className={`lg:col-span-4 p-3 rounded-md border ${ui.surfaceSubtle} ${ui.border} space-y-1.5`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#F38020]" />
                      <span>Diff Sensitivity Threshold</span>
                    </span>
                    <span className="font-mono font-bold text-[#F38020] tabular-nums">
                      {diffThreshold.toFixed(2)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.5"
                    step="0.1"
                    value={diffThreshold}
                    onChange={(e) => setDiffThreshold(parseFloat(e.target.value))}
                    className="w-full accent-[#F38020] cursor-pointer"
                  />
                  <div className={`flex justify-between text-[10px] tabular-nums ${ui.textSubtle}`}>
                    <span>0.10% (Strict)</span>
                    <span>0.50% (Default)</span>
                    <span>3.50% (Lenient)</span>
                  </div>
                </div>
              </div>

              {/* Interactive Before/After Stage */}
              {diffViewMode === 'split' ? (
                <div
                  ref={splitStageRef}
                  onMouseMove={(e) => {
                    if (isDraggingSlider) updateSliderFromClientX(e.clientX);
                  }}
                  onMouseUp={() => setIsDraggingSlider(false)}
                  onMouseLeave={() => setIsDraggingSlider(false)}
                  onTouchMove={(e) => {
                    if (e.touches[0]) updateSliderFromClientX(e.touches[0].clientX);
                  }}
                  className={`relative rounded-xl border overflow-hidden select-none ${ui.border} ${
                    darkMode ? 'bg-[#090D12]' : 'bg-slate-200/70'
                  } p-4 sm:p-6 min-h-[430px]`}
                >
                  {/* Top Stage Labels */}
                  <div className="flex items-center justify-between mb-3 text-[11px] font-semibold">
                    <span className="px-2.5 py-1 rounded bg-emerald-600 text-white shadow-2xs">
                      APPROVED R2 BASELINE (LEFT)
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-900 text-white shadow-2xs">
                      LATEST CAPTURE (RIGHT)
                    </span>
                  </div>

                  {/* Comparison Canvas Container */}
                  <div className="relative w-full h-[360px] rounded-lg overflow-hidden shadow-inner">
                    {/* Layer 1 (Full Width Underneath): Latest Capture */}
                    <div className="absolute inset-0">
                      <ViewportMockupScene
                        zone={activeDiffZone}
                        viewport={diffViewport}
                        variant="latest"
                        showOverlay={showDiffOverlay}
                      />
                    </div>

                    {/* Layer 2 (Clipped Left Portion): Approved Baseline */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    >
                      <ViewportMockupScene
                        zone={activeDiffZone}
                        viewport={diffViewport}
                        variant="baseline"
                        showOverlay={false}
                      />
                    </div>

                    {/* Vertical Draggable Divider Line & Handle */}
                    <div
                      onMouseDown={() => setIsDraggingSlider(true)}
                      onTouchStart={() => setIsDraggingSlider(true)}
                      style={{ left: `${sliderPos}%` }}
                      className="absolute top-0 bottom-0 w-0.5 bg-[#F38020] cursor-ew-resize z-30 shadow-[0_0_12px_rgba(243,128,32,0.8)]"
                    >
                      <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#F38020] text-white border-2 border-white shadow-lg flex items-center justify-center font-bold text-xs">
                        ↔
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Side-by-Side Comparison View */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${ui.surface} ${ui.border} space-y-2.5`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="vp-badge px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                        APPROVED R2 BASELINE
                      </span>
                      <span className={`font-mono text-[11px] ${ui.textSubtle}`}>
                        {VIEWPORT_SPECS[diffViewport].dims}
                      </span>
                    </div>
                    <div className="h-[360px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                      <ViewportMockupScene
                        zone={activeDiffZone}
                        viewport={diffViewport}
                        variant="baseline"
                        showOverlay={false}
                      />
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border ${ui.surface} ${ui.border} space-y-2.5`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="vp-badge px-2 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400">
                        LATEST CAPTURE ({activeDiffZone.pixelDelta.toFixed(2)}% DELTA)
                      </span>
                      <span className={`font-mono text-[11px] ${ui.textSubtle}`}>
                        {VIEWPORT_SPECS[diffViewport].dims}
                      </span>
                    </div>
                    <div className="h-[360px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                      <ViewportMockupScene
                        zone={activeDiffZone}
                        viewport={diffViewport}
                        variant="latest"
                        showOverlay={showDiffOverlay}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              VIEW 3: WORKERS & ZERO-TRUST SECURITY
             ----------------------------------------------------------------- */}
          {activeNav === 'workers' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-lg sm:text-xl font-bold">
                  Edge Workers &amp; Zero-Trust Security Architecture
                </h1>
                <p className={`text-xs mt-0.5 ${ui.textMuted}`}>
                  Decoupled BullMQ + Playwright worker containers with DNS rebinding protection, ephemeral browser sandboxes, and RLS multi-tenancy.
                </p>
              </div>

              {/* Live BullMQ + Playwright Worker Node Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {WORKER_NODES.map((node) => {
                  const ramPct = Math.round((node.ramUsedMb / node.ramTotalMb) * 100);
                  return (
                    <div key={node.id} className={`p-4 rounded-lg border ${ui.surface} ${ui.border} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-[#F38020]" />
                          <span className="font-mono text-xs font-bold">{node.id}</span>
                        </div>
                        <span className="vp-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {node.status}
                        </span>
                      </div>

                      <div className={`text-[11px] tabular-nums ${ui.textSubtle}`}>
                        PoP: {node.region} • Uptime {node.uptime}
                      </div>

                      {/* CPU & RAM Utilization Bars */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] tabular-nums">
                            <span className={ui.textMuted}>vCPU Load</span>
                            <span className="font-semibold">{node.cpuPct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-[#0EA5E9] rounded-full"
                              style={{ width: `${node.cpuPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] tabular-nums">
                            <span className={ui.textMuted}>RAM ({ramPct}%)</span>
                            <span className="font-semibold">{node.ramUsedMb}MB</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-[#F38020] rounded-full"
                              style={{ width: `${ramPct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className={`pt-2 border-t ${ui.border} grid grid-cols-3 gap-2 text-center text-[11px] tabular-nums`}>
                        <div>
                          <div className={ui.textSubtle}>Chromium</div>
                          <div className="font-bold mt-0.5">
                            {node.activeContexts}/{node.maxContexts} ctx
                          </div>
                        </div>
                        <div>
                          <div className={ui.textSubtle}>R2 RTT</div>
                          <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {node.r2LatencyMs}ms
                          </div>
                        </div>
                        <div>
                          <div className={ui.textSubtle}>Queue</div>
                          <div className="font-bold mt-0.5">{node.queueDepth}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive SSRF & DNS Rebinding Firewall Simulator */}
              <SsrfFirewallTester darkMode={darkMode} ui={ui} />

              {/* 5-Layer Security Ruleset Table */}
              <div className={`rounded-lg border overflow-hidden ${ui.surface} ${ui.border}`}>
                <div className={`px-4 py-3 border-b ${ui.border} ${ui.surfaceSubtle} flex items-center justify-between`}>
                  <span className="text-xs font-bold flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#F38020]" />
                    <span>5-Layer Multi-Tenant Security Ruleset</span>
                  </span>
                  <span className={`text-[11px] font-mono ${ui.textSubtle}`}>SOC2 / Zero-Trust Hardened</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${ui.border} ${ui.surfaceSubtle} text-[11px] uppercase ${ui.textSubtle}`}>
                        <th className="py-2.5 px-4">Rule ID</th>
                        <th className="py-2.5 px-3">Control</th>
                        <th className="py-2.5 px-3">Enforcement Layer</th>
                        <th className="py-2.5 px-3">Technical Specification</th>
                        <th className="py-2.5 px-4 text-right">State</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-[#30363D]' : 'divide-[#E2E8F0]'} text-xs`}>
                      {SECURITY_RULES.map((rule) => (
                        <tr key={rule.id} className={ui.surfaceHover}>
                          <td className="py-3 px-4 font-mono text-[11px] font-bold text-[#F38020]">{rule.id}</td>
                          <td className="py-3 px-3 font-semibold">{rule.name}</td>
                          <td className={`py-3 px-3 ${ui.textMuted}`}>{rule.layer}</td>
                          <td className={`py-3 px-3 text-[11px] ${ui.textMuted}`}>{rule.spec}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="vp-badge px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px]">
                              {rule.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              VIEW 4: WHITE-LABEL REPORTS & WORDPRESS WEBHOOKS
             ----------------------------------------------------------------- */}
          {activeNav === 'whitelabel-webhooks' && (
            <div className="space-y-6">
              {/* Header & Sub-View Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold">
                    White-Label Client Reports &amp; WordPress Webhooks
                  </h1>
                  <p className={`text-xs mt-0.5 ${ui.textMuted}`}>
                    Configure custom agency-branded PDF/portal reports and manage HMAC-SHA256 WordPress <code className="font-mono">mu-plugin</code> triggers.
                  </p>
                </div>

                <div className={`inline-flex p-0.5 rounded-md border ${ui.surfaceSubtle} ${ui.border}`}>
                  {[
                    { id: 'split', label: 'All Modules' },
                    { id: 'report', label: 'White-Label Report Studio' },
                    { id: 'webhooks', label: 'WP Plugin & Webhooks' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setWlWebhookSubView(tab.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                        wlWebhookSubView === tab.id
                          ? 'bg-[#F38020] text-white shadow-2xs'
                          : `${ui.textMuted} hover:text-[#F38020]`
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION A: WHITE-LABEL CLIENT REPORT STUDIO */}
              {(wlWebhookSubView === 'split' || wlWebhookSubView === 'report') && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Configuration Panel */}
                  <div className={`lg:col-span-4 p-5 rounded-lg border ${ui.surface} ${ui.border} space-y-4`}>
                    <div>
                      <h2 className="text-sm font-bold flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-[#F38020]" />
                        <span>White-Label Report Studio</span>
                      </h2>
                      <p className={`text-xs mt-1 ${ui.textMuted}`}>
                        Configure custom CNAME domain, agency branding, and executive notes for recurring client retainers.
                      </p>
                    </div>

                    {/* Target Client Zone */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium">Client Zone</label>
                      <select
                        value={activeReportZone.id}
                        onChange={(e) => setWlZoneId(e.target.value)}
                        className={`w-full px-3 py-2 rounded-md border text-xs ${ui.input} focus:outline-none focus:border-[#F38020] cursor-pointer`}
                      >
                        {zones.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.domain} ({z.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Agency Name */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium">Agency Brand Name</label>
                      <input
                        type="text"
                        value={wlAgencyName}
                        onChange={(e) => setWlAgencyName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-md border text-xs ${ui.input} focus:outline-none focus:border-[#F38020]`}
                      />
                    </div>

                    {/* Custom Portal CNAME */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium">Custom Portal CNAME</label>
                      <input
                        type="text"
                        value={wlPortalCname}
                        onChange={(e) => setWlPortalCname(e.target.value)}
                        className={`w-full px-3 py-2 rounded-md border text-xs ${ui.input} focus:outline-none focus:border-[#F38020]`}
                      />
                    </div>

                    {/* Brand Accent Color Swatches */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium">Brand Accent Color</label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          { hex: '#F38020', label: 'Cloudflare Orange' },
                          { hex: '#0F172A', label: 'Slate Navy' },
                          { hex: '#10B981', label: 'Emerald' },
                          { hex: '#4F46E5', label: 'Indigo' },
                        ].map((swatch) => (
                          <button
                            key={swatch.hex}
                            type="button"
                            onClick={() => setWlAccentColor(swatch.hex)}
                            title={swatch.label}
                            className={`w-7 h-7 rounded-md border-2 transition cursor-pointer ${
                              wlAccentColor.toUpperCase() === swatch.hex
                                ? 'border-[#F38020] scale-110 ring-2 ring-orange-400/40'
                                : 'border-transparent opacity-85 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: swatch.hex }}
                          />
                        ))}
                        <input
                          type="text"
                          value={wlAccentColor}
                          onChange={(e) => setWlAccentColor(e.target.value)}
                          className={`w-20 px-2 py-1 rounded-md border font-mono text-xs uppercase ${ui.input}`}
                        />
                      </div>
                    </div>

                    {/* Executive Summary Note */}
                    <div className="space-y-1">
                      <label className="block text-xs font-medium">Executive Summary Note</label>
                      <textarea
                        rows={3}
                        value={wlExecNote}
                        onChange={(e) => setWlExecNote(e.target.value)}
                        className={`w-full px-3 py-2 rounded-md border text-xs leading-relaxed ${ui.input} focus:outline-none focus:border-[#F38020]`}
                      />
                    </div>

                    {/* Toggle Powered by ViewportPulse Footer */}
                    <div className={`pt-2 border-t ${ui.border} flex items-center justify-between`}>
                      <div>
                        <div className="text-xs font-medium">Show &ldquo;Powered by ViewportPulse&rdquo;</div>
                        <div className={`text-[11px] ${ui.textSubtle}`}>Toggle co-branded or 100% white-label footer</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWlHideVpBrand((v) => !v)}
                        className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                          !wlHideVpBrand ? 'bg-[#F38020]' : 'bg-slate-400 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            !wlHideVpBrand ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          showToast('Opening system PDF print dialog...', 'success');
                          setTimeout(() => window.print(), 200);
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#F38020] hover:bg-[#E06D10] text-white text-xs font-semibold transition cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print / Export PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            `https://${wlPortalCname}/audit/${activeReportZone.domain}`,
                            'White-label CNAME report link'
                          )
                        }
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-xs font-medium transition cursor-pointer ${ui.surfaceSubtle} ${ui.border} ${ui.surfaceHover}`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Portal Link</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Live Executive Preview (Styled cleanly in Open Sauce Two) */}
                  <div className="lg:col-span-8">
                    <div
                      id="cf-whitelabel-printable"
                      style={{ fontFamily: "'Open Sauce Two', -apple-system, BlinkMacSystemFont, sans-serif" }}
                      className="rounded-xl bg-white text-slate-900 border border-slate-200 shadow-xl overflow-hidden"
                    >
                      <div className="h-2 w-full" style={{ backgroundColor: wlAccentColor }} />

                      <div className="p-6 sm:p-8 space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg text-white font-extrabold text-sm flex items-center justify-center shrink-0"
                              style={{ backgroundColor: wlAccentColor }}
                            >
                              {(wlAgencyName || 'LD')
                                .split(' ')
                                .map((w) => w[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-base text-slate-900">{wlAgencyName}</div>
                              <div className="text-xs text-slate-500">{wlPortalCname}</div>
                            </div>
                          </div>

                          <div className="sm:text-right">
                            <span className="vp-badge px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px]">
                              SITE READINESS &amp; CWV REPORT
                            </span>
                            <div className="text-xs text-slate-500 mt-1 tabular-nums">
                              Generated: Nov 21, 2026
                            </div>
                          </div>
                        </div>

                        {/* Audited Zone Banner */}
                        <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                              MONITORED PRODUCTION DOMAIN
                            </div>
                            <div className="text-xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                              {activeReportZone.domain}
                            </div>
                            <p className="text-xs text-slate-600 mt-2 max-w-lg leading-relaxed">
                              {wlExecNote}
                            </p>
                          </div>

                          <div className="bg-white px-4 py-3 rounded-lg border border-slate-200 shrink-0 sm:text-right">
                            <div className="text-[11px] text-slate-500 font-medium">Overall QA Health</div>
                            <div
                              className="vp-kpi-number text-3xl font-extrabold tabular-nums mt-0.5"
                              style={{ color: wlAccentColor }}
                            >
                              {activeReportZone.status === 'PASSING'
                                ? '99.6%'
                                : activeReportZone.status === 'SLOW_CWV'
                                ? '92.4%'
                                : '84.0%'}
                            </div>
                            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                              EDGE POP: {activeReportZone.edgePop}
                            </div>
                          </div>
                        </div>

                        {/* Multi-Viewport Checkmarks */}
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                            Multi-Viewport Visual Regression Verification
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {Object.values(VIEWPORT_SPECS).map((vp) => {
                              const Icon = vp.icon;
                              const isPass = activeReportZone.viewports[vp.key] === 'PASS';
                              return (
                                <div
                                  key={vp.key}
                                  className={`p-3.5 rounded-lg border ${
                                    isPass
                                      ? 'bg-emerald-50/50 border-emerald-200'
                                      : 'bg-red-50/60 border-red-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Icon className="w-4 h-4 text-slate-700" />
                                      <span className="font-bold text-xs text-slate-900">{vp.label}</span>
                                    </div>
                                    <span
                                      className={`text-[11px] font-bold ${
                                        isPass ? 'text-emerald-700' : 'text-red-700'
                                      }`}
                                    >
                                      {isPass ? '✓ PASS' : '✕ DIFF'}
                                    </span>
                                  </div>
                                  <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-slate-500">
                                    <span>{vp.dims}</span>
                                    <span>{isPass ? '0.00% delta' : `${activeReportZone.pixelDelta}%`}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Core Web Vitals & Asset Diagnostics */}
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                            Core Web Vitals &amp; Asset Diagnostics
                          </h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-lg border border-slate-200">
                              <div className="text-[11px] text-slate-500">Largest Contentful Paint</div>
                              <div className="vp-kpi-number text-lg font-bold tabular-nums text-slate-900 mt-1">
                                {activeReportZone.lcp.toFixed(1)}s
                              </div>
                              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                                Budget: &lt; 2.5s
                              </div>
                            </div>
                            <div className="p-3.5 rounded-lg border border-slate-200">
                              <div className="text-[11px] text-slate-500">Cumulative Layout Shift</div>
                              <div className="vp-kpi-number text-lg font-bold tabular-nums text-slate-900 mt-1">
                                {activeReportZone.cls.toFixed(2)}
                              </div>
                              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                                Budget: &lt; 0.10
                              </div>
                            </div>
                            <div className="p-3.5 rounded-lg border border-slate-200">
                              <div className="text-[11px] text-slate-500">Edge TTFB Latency</div>
                              <div className="vp-kpi-number text-lg font-bold tabular-nums text-slate-900 mt-1">
                                {activeReportZone.ttfb}ms
                              </div>
                              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                                CDN Cache HIT
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                          <span>
                            Managed &amp; Audited by <strong className="text-slate-800">{wlAgencyName}</strong>
                          </span>
                          {!wlHideVpBrand ? (
                            <span className="text-[#F38020] font-semibold">
                              Powered by ViewportPulse
                            </span>
                          ) : (
                            <span className="tabular-nums">
                              Verification ID: {activeReportZone.id.toUpperCase()}-2026-11
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION B: WORDPRESS MU-PLUGIN & HMAC-SHA256 WEBHOOKS */}
              {(wlWebhookSubView === 'split' || wlWebhookSubView === 'webhooks') && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Webhook Endpoint, Rotatable HMAC Secret & WP mu-plugin PHP */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className={`p-5 rounded-lg border ${ui.surface} ${ui.border} space-y-4`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h2 className="text-sm font-bold flex items-center gap-2">
                            <Webhook className="w-4 h-4 text-[#F38020]" />
                            <span>WordPress mu-plugin &amp; Webhook Ingestion</span>
                          </h2>
                          <p className={`text-xs mt-0.5 ${ui.textMuted}`}>
                            Automatically triggers multi-viewport Playwright audits whenever WordPress updates plugins, themes, or core.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleSimulateWpUpdate}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F38020] hover:bg-[#E06D10] text-white text-xs font-semibold transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Simulate WordPress Plugin Update</span>
                        </button>
                      </div>

                      {/* Webhook Endpoint URL */}
                      <div className="space-y-1">
                        <label className={`block text-[11px] font-semibold uppercase ${ui.textSubtle}`}>
                          Webhook Ingestion Endpoint (POST)
                        </label>
                        <div className="flex items-center gap-2">
                          <code className={`flex-1 px-3 py-2 rounded-md border font-mono text-xs truncate ${ui.surfaceSubtle} ${ui.border}`}>
                            https://api.viewportpulse.io/v1/webhooks/wp/litras_9928a1
                          </code>
                          <button
                            type="button"
                            onClick={() =>
                              copyText(
                                'https://api.viewportpulse.io/v1/webhooks/wp/litras_9928a1',
                                'Webhook Endpoint URL'
                              )
                            }
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium ${ui.surfaceSubtle} ${ui.border} ${ui.surfaceHover} cursor-pointer shrink-0`}
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>

                      {/* Rotatable HMAC-SHA256 Secret Key */}
                      <div className="space-y-1">
                        <label className={`block text-[11px] font-semibold uppercase ${ui.textSubtle}`}>
                          HMAC-SHA256 Signing Secret Key
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          <code className={`flex-1 min-w-[200px] px-3 py-2 rounded-md border font-mono text-xs truncate ${ui.surfaceSubtle} ${ui.border}`}>
                            {revealSecret ? hmacSecret : `vp_live_sk_••••••••••••••••••••${hmacSecret.slice(-4)}`}
                          </code>
                          <button
                            type="button"
                            onClick={() => setRevealSecret((v) => !v)}
                            className={`p-2 rounded-md border ${ui.surfaceSubtle} ${ui.border} ${ui.surfaceHover} cursor-pointer`}
                            title={revealSecret ? 'Hide Secret' : 'Reveal Secret'}
                          >
                            {revealSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyText(hmacSecret, 'HMAC-SHA256 Secret Key')}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium ${ui.surfaceSubtle} ${ui.border} ${ui.surfaceHover} cursor-pointer`}
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRotateSecret}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium text-[#F38020] ${ui.surfaceSubtle} ${ui.border} ${ui.surfaceHover} cursor-pointer`}
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Rotate Key</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Production WordPress mu-plugin PHP Code Card */}
                    <div className={`rounded-lg border overflow-hidden ${ui.surface} ${ui.border}`}>
                      <div className={`px-4 py-2.5 border-b ${ui.border} ${ui.surfaceSubtle} flex items-center justify-between gap-2`}>
                        <span className="font-mono text-xs font-semibold">
                          wp-content/mu-plugins/viewportpulse-qa-trigger.php
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyText(buildWpMuPluginCode(hmacSecret), 'WordPress mu-plugin PHP snippet')
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F38020] hover:bg-[#E06D10] text-white text-xs font-semibold cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy PHP</span>
                        </button>
                      </div>
                      <pre className="p-4 bg-[#0D1117] text-[#E6EDF3] font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[380px]">
                        <code>{buildWpMuPluginCode(hmacSecret)}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Right: Recent Webhook Delivery Log */}
                  <div className={`lg:col-span-5 rounded-lg border overflow-hidden ${ui.surface} ${ui.border}`}>
                    <div className={`px-4 py-3 border-b ${ui.border} ${ui.surfaceSubtle} flex items-center justify-between`}>
                      <span className="text-xs font-bold">Webhook Delivery &amp; Signature Log</span>
                      <span className={`tabular-nums text-[11px] ${ui.textSubtle}`}>{webhookLogs.length} events</span>
                    </div>

                    <div className={`divide-y ${darkMode ? 'divide-[#30363D]' : 'divide-[#E2E8F0]'}`}>
                      {webhookLogs.map((log) => {
                        const isOpen = expandedLogId === log.id;
                        return (
                          <div key={log.id} className="p-3.5 text-xs">
                            <div
                              onClick={() => setExpandedLogId(isOpen ? null : log.id)}
                              className="flex items-start justify-between gap-2 cursor-pointer"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="vp-badge px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px]">
                                    {log.httpStatus} ACCEPTED
                                  </span>
                                  <span className="font-semibold">{log.site}</span>
                                </div>
                                <div className={ui.textMuted}>{log.detail}</div>
                                <div className={`tabular-nums text-[10px] ${ui.textSubtle}`}>
                                  {log.id} • HMAC-SHA256 OK • {log.timestamp}
                                </div>
                              </div>

                              <span
                                className={`vp-badge px-2 py-0.5 rounded text-[10px] shrink-0 ${
                                  log.outcome === 'REGRESSION_DETECTED'
                                    ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                                    : log.outcome === 'SLOW_CWV_ALERT'
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {log.outcome}
                              </span>
                            </div>

                            {isOpen && (
                              <pre className="mt-2.5 p-2.5 rounded bg-[#0D1117] text-[#E6EDF3] border border-[#30363D] font-mono text-[10px] overflow-x-auto">
                                {JSON.stringify(log.payload, null, 2)}
                              </pre>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* =====================================================================
          3. BOTTOM STREAMING EDGE EXECUTION CONSOLE
         ===================================================================== */}
      {consoleState.open && (
        <div className="fixed bottom-4 right-4 left-4 lg:left-64 z-40 max-w-4xl mx-auto rounded-lg bg-[#0D1117] text-[#E6EDF3] border border-[#30363D] shadow-2xl overflow-hidden">
          <div className="px-4 py-2.5 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Terminal className="w-4 h-4 text-[#F38020] shrink-0" />
              <span className="font-mono text-xs font-bold truncate">
                Edge Execution Console • {consoleState.zoneDomain}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#F38020]/15 text-[#F38020] font-mono text-[10px]">
                {consoleState.triggerLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {consoleState.done && consoleState.verdict === 'REGRESSION' && (
                <button
                  type="button"
                  onClick={() => inspectZoneViewport(consoleState.zoneId, 'mobile')}
                  className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-semibold cursor-pointer"
                >
                  Open Visual Diff
                </button>
              )}
              <button
                type="button"
                onClick={() => setConsoleState((prev) => ({ ...prev, minimized: !prev.minimized }))}
                className="p-1 rounded hover:bg-[#30363D] text-[#8B949E] cursor-pointer"
                title={consoleState.minimized ? 'Expand Console' : 'Minimize Console'}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${consoleState.minimized ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setConsoleState((prev) => ({ ...prev, open: false }))}
                className="p-1 rounded hover:bg-[#30363D] text-[#8B949E] cursor-pointer"
                title="Close Console"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-full bg-[#161B22]">
            <div
              className={`h-full transition-all duration-300 ${
                consoleState.done && consoleState.verdict === 'REGRESSION' ? 'bg-red-500' : 'bg-[#F38020]'
              }`}
              style={{ width: `${consoleState.progress}%` }}
            />
          </div>

          {!consoleState.minimized && (
            <div className="p-3.5 font-mono text-[11px] space-y-1.5 max-h-40 overflow-y-auto">
              {consoleState.logs.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#6E7681] shrink-0 tabular-nums">[{entry.time}]</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                      entry.tag === 'PIXELMATCH' && consoleState.verdict === 'REGRESSION'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-[#F38020]/20 text-[#F38020]'
                    }`}
                  >
                    {entry.tag}
                  </span>
                  <span className="text-[#E6EDF3]">{entry.msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          4. ADD MONITORED ZONE MODAL
         ===================================================================== */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-xl border ${ui.surface} ${ui.border} shadow-2xl overflow-hidden`}>
            <div className={`px-5 py-4 border-b ${ui.border} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#F38020]" />
                <h3 className="text-sm font-bold">Add Monitored Zone</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddModalOpen(false);
                  setNewZoneError('');
                }}
                className={`p-1 rounded ${ui.surfaceHover} cursor-pointer`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddZoneSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold">Production Domain or URL</label>
                <input
                  type="text"
                  autoFocus
                  value={newZoneInput}
                  onChange={(e) => setNewZoneInput(e.target.value)}
                  placeholder="e.g., https://client-store.com"
                  className={`w-full px-3 py-2 rounded-md border text-xs ${ui.input} focus:outline-none focus:border-[#F38020]`}
                />
                <p className={`text-[11px] ${ui.textSubtle}`}>
                  Captures baseline PNGs across Desktop (1440×900), Tablet (768×1024), and Mobile (390×844) with SSRF IP filtering enabled.
                </p>
              </div>

              {newZoneError && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
                  {newZoneError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddModalOpen(false);
                    setNewZoneError('');
                  }}
                  className={`px-3.5 py-2 rounded-md border text-xs font-medium cursor-pointer ${ui.surfaceSubtle} ${ui.border} ${ui.surfaceHover}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#F38020] hover:bg-[#E06D10] text-white text-xs font-semibold cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Enroll Zone &amp; Capture Baseline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. FLOATING TOAST FEEDBACK
         ===================================================================== */}
      {toast && (
        <div className="fixed top-16 right-5 z-50 px-3.5 py-2.5 rounded-lg bg-[#0D1117] text-white border border-[#30363D] shadow-xl text-xs font-medium flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              toast.tone === 'success' ? 'bg-emerald-400' : 'bg-[#F38020]'
            }`}
          />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}