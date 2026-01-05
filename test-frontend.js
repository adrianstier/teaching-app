const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    consoleErrors.push(`Page Error: ${error.message}`);
  });

  console.log('Navigating to http://localhost:3000/create...');

  try {
    await page.goto('http://localhost:3000/create', { timeout: 30000 });

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'screenshot-create.png', fullPage: true });
    console.log('Screenshot saved: screenshot-create.png');

    // Check page title
    const title = await page.title();
    console.log('Page title:', title);

    // Check for any visible text
    const bodyText = await page.textContent('body');
    console.log('Body text preview:', bodyText?.substring(0, 800));

    // Check for errors
    console.log('Console errors:', consoleErrors);

    // Try clicking Begin Development button
    const beginButton = await page.$('button:has-text("Begin Development")');
    if (beginButton) {
      console.log('Found Begin Development button, clicking...');
      await beginButton.click();
      await page.waitForTimeout(5000);
      await page.screenshot({ path: 'screenshot-after-click.png', fullPage: true });
      console.log('Screenshot saved: screenshot-after-click.png');

      // Check for errors after click
      console.log('Console errors after click:', consoleErrors);
    }

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'screenshot-error.png' });
  }

  await browser.close();
})();
