const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const OUTPUT_DIR = path.join(__dirname, 'screenshots', 'selected-state');

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
  
  // Light mode
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(30000);
  
  console.log('Light mode - Barcodes...');
  await page.goto(`${BASE_URL}/admin/barcodes`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await takeScreenshot(page, '01-barcodes-light');
  
  // Click second product to select it
  await page.click('button:has-text("Kharis Rice")', { timeout: 5000 });
  await page.waitForTimeout(500);
  await takeScreenshot(page, '02-barcodes-light-selected');
  
  // Dark mode
  const darkPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await darkPage.goto(`${BASE_URL}/admin/barcodes`, { waitUntil: 'networkidle' });
  await darkPage.waitForTimeout(2000);
  
  // Force dark mode
  await darkPage.evaluate(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  });
  await darkPage.waitForTimeout(1000);
  await takeScreenshot(darkPage, '03-barcodes-dark');
  
  // Click second product in dark mode
  await darkPage.click('button:has-text("Kharis Rice")', { timeout: 5000 });
  await darkPage.waitForTimeout(500);
  await takeScreenshot(darkPage, '04-barcodes-dark-selected');
  
  await browser.close();
  console.log('Selected state screenshots captured!');
}

main().catch(console.error);