const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const OUTPUT_DIR = path.join(__dirname, 'screenshots', 'final-verification');

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

  // 1. Home page with overlay
  console.log('Home page with scan overlay...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '01-home-with-overlay');
  
  // Click "Browse Products" to dismiss
  await page.click('button:has-text("Browse Products")', { timeout: 5000 });
  await page.waitForTimeout(500);
  await takeScreenshot(page, '02-home-products-revealed');

  // 2. Product page with deep link
  console.log('Product page with batch...');
  await page.goto(`${BASE_URL}/product/kharis-maize-flour?batch=KF-2026-W25-A7F3`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '03-product-with-batch');

  // 3. Admin QR - test Register Batch modal
  console.log('Admin QR with Register Batch modal...');
  await page.goto(`${BASE_URL}/admin/qr`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await takeScreenshot(page, '04-admin-qr-before-modal');
  
  try {
    // Click the first "Register Batch Run" button
    await page.click('button:has-text("Register Batch Run")', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '05-admin-qr-register-modal');
    
    // Test focus trap - press Tab
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    await takeScreenshot(page, '06-admin-qr-modal-focus');
    
    // Close modal with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await takeScreenshot(page, '07-admin-qr-modal-closed');
  } catch (e) {
    console.log('Could not open modal:', e.message);
  }

  // 4. Admin Barcodes
  console.log('Admin Barcodes...');
  await page.goto(`${BASE_URL}/admin/barcodes`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '08-admin-barcodes');

  // 5. Admin Analytics
  console.log('Admin Analytics...');
  await page.goto(`${BASE_URL}/admin/analytics`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '09-admin-analytics');

  // 6. Admin Feedback
  console.log('Admin Feedback...');
  await page.goto(`${BASE_URL}/admin/feedback`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await takeScreenshot(page, '10-admin-feedback');

  // 7. Mobile views
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  
  console.log('Mobile home...');
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  await takeScreenshot(mobilePage, '11-mobile-home-overlay');
  
  await mobilePage.click('button:has-text("Browse Products")', { timeout: 5000 });
  await mobilePage.waitForTimeout(500);
  await takeScreenshot(mobilePage, '12-mobile-home-products');

  console.log('Mobile product...');
  await mobilePage.goto(`${BASE_URL}/product/kharis-maize-flour`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  await takeScreenshot(mobilePage, '13-mobile-product');

  console.log('Mobile admin QR...');
  await mobilePage.goto(`${BASE_URL}/admin/qr`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(3000);
  await takeScreenshot(mobilePage, '14-mobile-admin-qr');

  await browser.close();
  console.log('All final verification screenshots captured!');
}

main().catch(console.error);