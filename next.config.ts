import type { NextConfig } from 'next';

const GH = process.env.GH_PAGES === 'true';
const BASE = process.env.BASE_PATH || '';
const isDev = process.env.NODE_ENV !== 'production';

const csp = `default-src 'self'; script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'${isDev ? ' ws:' : ''}; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`;

// Vercel build: normal Next.js server, root "/" is rewritten to "/fa" (URL stays "/").
// GitHub Pages build (GH_PAGES=true): static export, no server, so no rewrites/headers —
// a real index.html at the export root is generated instead (see package.json build:ghpages).
const config: NextConfig = {
  poweredByHeader: false,
  ...(GH
    ? { output: 'export', basePath: BASE, assetPrefix: BASE ? `${BASE}/` : undefined, images: { unoptimized: true } }
    : {
        async rewrites() { return [{ source: '/', destination: '/fa' }]; },
        async headers() {
          return [{ source: '/(.*)', headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
            { key: 'Content-Security-Policy', value: csp },
          ] }];
        },
      }),
};
export default config;
