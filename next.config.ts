import type {NextConfig} from 'next';

// Content-Security-Policy. Kept intentionally practical rather than nonce-strict:
// Next's App Router emits inline hydration scripts and styled-jsx inline styles,
// so 'unsafe-inline' is required here without a nonce pipeline. The high-value
// directives below (frame-ancestors, object-src, base-uri, form-action,
// upgrade-insecure-requests) are what block clickjacking, base-tag hijacking and
// mixed content. Allow-lists cover Firebase Analytics (gtag / google-analytics),
// the placehold.co image host, and Firebase/Google APIs used by the web SDK.
// PayPal checkout is a full-page redirect (window.location), so it needs no CSP
// allowance here.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://placehold.co https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.googleapis.com https://*.google-analytics.com https://*.googletagmanager.com https://*.firebaseio.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // Force HTTPS for 2 years, including subdomains. Safe on App Hosting (HTTPS-only).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
];

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to every route.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  // NOTE: Do NOT add redirects from /sitemap.xml or /robots.txt. Next.js App
  // Router serves those files natively from src/app/sitemap.ts and robots.ts at
  // exactly those URLs; redirecting them sends crawlers to non-existent routes (404).
};

export default nextConfig;
