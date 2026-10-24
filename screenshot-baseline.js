const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const OUTPUT_DIR = path.join(__dirname, 'screenshots', 'baseline');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function takeScreenshot(page, name, options = {}) {
  const filename = path.join(OUTPUT_DIR, `${name}.png`);
  await page.screenshot({ path: filename, fullPage: true, ...options });
  console.log(`Saved: ${filename}`);
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Wait for network to be idle
  page.setDefaultTimeout(30000);
  
  // 1. Home page (scan overlay should appear)
  console.log('Capturing home page...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '01-home-with-scan-overlay');
  
  // 2. Click "Browse Products" to dismiss overlay and see home
  try {
    await page.click('button:has-text("Browse Products")', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '02-home-products');
  } catch (e) {
    console.log('Browse Products button not found or already dismissed');
  }
  
  // 3. Navigate to a product page (simulate scan with batch)
  console.log('Capturing product page...');
  await page.goto(`${BASE_URL}/product/kharis-maize-flour?batch=KF-2026-W25-A7F3`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '03-product-page-with-authenticity');
  
  // 4. Admin QR page
  console.log('Capturing admin QR studio...');
  await page.goto(`${BASE_URL}/admin/qr`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // Wait for data to load
  await takeScreenshot(page, '04-admin-qr-studio-full');
  
  // Scroll and capture more
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(500);
  await takeScreenshot(page, '05-admin-qr-studio-mid');
  
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await takeScreenshot(page, '06-admin-qr-studio-bottom');
  
  // 5. Admin Barcodes page
  console.log('Capturing admin barcode studio...');
  await page.goto(`${BASE_URL}/admin/barcodes`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '07-admin-barcodes-studio');
  
  // 6. Mobile viewport for scan overlay
  console.log('Capturing mobile scan overlay...');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  await takeScreenshot(mobilePage, '08-mobile-scan-overlay');
  
  // 7. Mobile product page
  await mobilePage.goto(`${BASE_URL}/product/kharis-maize-flour?batch=KF-2026-W25-A7F3`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  await takeScreenshot(mobilePage, '09-mobile-product-page');
  
  await browser.close();
  console.log('All baseline screenshots captured!');
}

main().catch(console.error);