const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const OUTPUT_DIR = path.join(__dirname, 'screenshots', 'width-check');

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
  
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(30000);

  // Admin QR
  console.log('Admin QR...');
  await page.goto(`${BASE_URL}/admin/qr`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await takeScreenshot(page, '01-admin-qr');

  // Admin Barcodes
  console.log('Admin Barcodes...');
  await page.goto(`${BASE_URL}/admin/barcodes`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '02-admin-barcodes');

  // Admin Analytics
  console.log('Admin Analytics...');
  await page.goto(`${BASE_URL}/admin/analytics`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '03-admin-analytics');

  // Admin Feedback
  console.log('Admin Feedback...');
  await page.goto(`${BASE_URL}/admin/feedback`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await takeScreenshot(page, '04-admin-feedback');

  // Admin Dashboard
  console.log('Admin Dashboard...');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await takeScreenshot(page, '05-admin-dashboard');

  await browser.close();
  console.log('Width check screenshots captured!');
}

main().catch(console.error);