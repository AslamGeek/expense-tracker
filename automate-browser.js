import puppeteer from 'puppeteer-core';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const screenshotPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/c523f67f-79b1-4be5-922d-4cf501f7fc98/final_app_screenshot.png';

async function setReactInputValue(page, selector, value) {
  await page.evaluate((sel, val) => {
    const input = document.querySelector(sel);
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeInputValueSetter.call(input, val);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, selector, value);
}

async function run() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    defaultViewport: { width: 1280, height: 980 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log('Navigating to http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });

  const expensesToAdd = [
    { amount: '45.50', category: 'Food', date: '2026-08-28' },
    { amount: '24.00', category: 'Transport', date: '2026-08-29' },
    { amount: '120.00', category: 'Shopping', date: '2026-08-30' },
    { amount: '85.25', category: 'Bills', date: '2026-08-27' },
  ];

  for (const item of expensesToAdd) {
    console.log(`Adding expense: $${item.amount} (${item.category}) on ${item.date}`);
    
    // Set Amount
    await setReactInputValue(page, '#amount', item.amount);

    // Set Category
    await page.select('#category', item.category);

    // Set Date
    await setReactInputValue(page, '#date', item.date);

    // Click Add Expense
    await page.click('#add-expense-btn');
    await new Promise(r => setTimeout(r, 400));
  }

  // Verify total spent
  const totalText = await page.$eval('#header-total-spent', el => el.innerText);
  console.log('Total Spent from Header:', totalText);

  const transactionsCount = await page.$eval('#total-transactions-count', el => el.innerText);
  console.log('Total Transactions Count:', transactionsCount);

  // Take full screenshot
  console.log('Capturing screenshot to', screenshotPath);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await browser.close();
  console.log('Verification completed successfully!');
}

run().catch(err => {
  console.error('Error during browser automation:', err);
  process.exit(1);
});
