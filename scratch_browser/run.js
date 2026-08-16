const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  try {
    await page.goto('http://localhost:5173/app/notes', { waitUntil: 'networkidle2' });
  } catch(e) {
    console.log('Error navigating:', e.toString());
  }
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
