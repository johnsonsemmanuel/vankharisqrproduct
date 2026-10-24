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

  // Home page
  console.log('Home page...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '06-home-overlay');
  
  await page.click('button:has-text("Browse Products")', { timeout: 5000 });
  await page.waitForTimeout(500);
  await takeScreenshot(page, '07-home-products');

  // Product page
  console.log('Product page...');
  await page.goto(`${BASE_URL}/product/kharis-maize-flour`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '08-product-page');

  await browser.close();
  console.log('Public page screenshots captured!');
}

main().catch(console.error);