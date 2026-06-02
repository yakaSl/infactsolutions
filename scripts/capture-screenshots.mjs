// Auto-capture portfolio screenshots from live client URLs.
//
// Usage:
//   npm run capture:screenshots                 # capture all sites
//   npm run capture:screenshots -- srimal-safari megadeal   # only these slugs
//   FORCE=1 npm run capture:screenshots         # re-capture even if file exists
//
// Output: public/portfolio/<slug>.jpg  (16:9, above-the-fold hero shot)
//
// First run installs the browser binary automatically if needed:
//   npx playwright install chromium

import { chromium } from 'playwright';
import { mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'portfolio');

// slug -> live URL. Slugs must match imageUrl basenames in portfolio-data.ts.
// Only projects with a public website are listed (mobile-only refs are skipped).
const SITES = [
  { slug: 'srimal-safari', url: 'https://srimalsafari.com' },
  { slug: 'linaya-ceylon-tours', url: 'https://linayaceylontours.com' },
  { slug: 'barnes-media', url: 'https://www.barnesmedia.lk' },
  { slug: 'gaanu-place', url: 'https://gaanuplace.vercel.app' },
  { slug: 'megadeal', url: 'https://www.megadeal.lk' },
  { slug: 'chilanka-gems', url: 'https://chilanka-gems.vercel.app' },
  { slug: 'djy-music', url: 'https://www.djymusic.com' },
  { slug: 'thuru-lanka', url: 'https://thurulankaweb.vercel.app' },
  { slug: 'rosmed-weddings', url: 'https://rosmed-weddings.vercel.app' },
  { slug: 'meraic', url: 'https://www.meraic.com' },
  { slug: 'turn-taxi', url: 'https://turntaxi.com' },
  { slug: 'infact-solutions', url: 'https://infactsolutions.net' },
];

// 16:9 viewport so the shot matches the card's aspect-video frame.
const VIEWPORT = { width: 1440, height: 810 };
const FORCE = process.env.FORCE === '1';

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const only = process.argv.slice(2);
  const targets = only.length ? SITES.filter((s) => only.includes(s.slug)) : SITES;

  if (only.length && targets.length === 0) {
    console.error(`No matching slugs for: ${only.join(', ')}`);
    console.error(`Known slugs: ${SITES.map((s) => s.slug).join(', ')}`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // crisp on retina / high-dpi cards
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  });

  const results = [];
  for (const { slug, url } of targets) {
    const outPath = join(OUT_DIR, `${slug}.jpg`);

    if (!FORCE && (await exists(outPath))) {
      console.log(`skip   ${slug} (exists — use FORCE=1 to overwrite)`);
      results.push({ slug, status: 'skipped' });
      continue;
    }

    const page = await context.newPage();
    try {
      console.log(`shoot  ${slug} -> ${url}`);
      // 'load' fires once resources finish; we avoid 'networkidle' because sites
      // with analytics/video/polling never go fully idle and time out.
      await page.goto(url, { waitUntil: 'load', timeout: 45000 });
      // Best-effort settle for entrance animations / lazy hero images; don't
      // fail the shot if the network never quiesces.
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(2500);
      await page.screenshot({
        path: outPath,
        type: 'jpeg',
        quality: 82,
        clip: { x: 0, y: 0, ...VIEWPORT }, // above-the-fold only
      });
      console.log(`  ok   public/portfolio/${slug}.jpg`);
      results.push({ slug, status: 'ok' });
    } catch (err) {
      console.error(`  FAIL ${slug}: ${err.message}`);
      results.push({ slug, status: 'failed', error: err.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const ok = results.filter((r) => r.status === 'ok').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const failed = results.filter((r) => r.status === 'failed');
  console.log(`\nDone: ${ok} captured, ${skipped} skipped, ${failed.length} failed.`);
  if (failed.length) {
    console.log('Failed slugs (re-run after checking the URL):');
    for (const f of failed) console.log(`  - ${f.slug}: ${f.error}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
