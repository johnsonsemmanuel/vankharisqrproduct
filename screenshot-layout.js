const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const OUTPUT_DIR = path.join(__dirname, 'screenshots', 'layout-check');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function takeScreenshot(page, name) {
  const filename = path.join(OUTPUT_DIR, `${name}.png`);
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`Saved: ${filename}`);
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  const browser = await chromium.launch({ headless: true });
  
  // Desktop viewport
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(30000);

  // 1. Home page
  console.log('Home page...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '01-home-full');

  // Dismiss overlay
  try { await page.click('button:has-text("Scan Another")', { timeout: 3000 }); } catch {}
  await page.waitForTimeout(500);
  await takeScreenshot(page, '02-home-products');

  // 2. Product page
  console.log('Product page...');
  await page.goto(`${BASE_URL}/product/kharis-maize-flour?batch=KF-2026-W25-A7F3`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '03-product-full');

  // 3. Admin dashboard
  console.log('Admin dashboard...');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await takeScreenshot(page, '04-admin-dashboard');

  // 4. Admin QR Studio
  console.log('Admin QR...');
  await page.goto(`${BASE_URL}/admin/qr`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await takeScreenshot(page, '05-admin-qr-full');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(300);
  await takeScreenshot(page, '06-admin-qr-mid');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await takeScreenshot(page, '07-admin-qr-bottom');

  // 5. Admin Barcodes
  console.log('Admin Barcodes...');
  await page.goto(`${BASE_URL}/admin/barcodes`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '08-admin-barcodes-full');

  // 6. Admin Analytics
  console.log('Admin Analytics...');
  await page.goto(`${BASE_URL}/admin/analytics`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '09-admin-analytics');

  // 7. Admin Feedback
  console.log('Admin Feedback...');
  await page.goto(`${BASE_URL}/admin/feedback`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await takeScreenshot(page, '10-admin-feedback');

  // Mobile viewport
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  
  console.log('Mobile home...');
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  await takeScreenshot(mobilePage, '11-mobile-home');

  console.log('Mobile product...');
  await mobilePage.goto(`${BASE_URL}/product/kharis-maize-flour`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  await takeScreenshot(mobilePage, '12-mobile-product');

  console.log('Mobile admin QR...');
  await mobilePage.goto(`${BASE_URL}/admin/qr`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(3000);
  await takeScreenshot(mobilePage, '13-mobile-admin-qr');

  await browser.close();
  console.log('All layout screenshots captured!');
}

main().catch(console.error);