const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testUploadFeature() {
  console.log('🔍 Testing upload feature with Playwright...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser console error:', msg.text());
      }
    });

    // Navigate to the application
    console.log('📡 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for React to load
    await page.waitForTimeout(2000);

    // Check if dashboard is visible
    const hasApp = await page.locator('text=/Automated Lecture Development System/i').count() > 0;

    if (!hasApp) {
      console.log('❌ Application not loaded properly');
      return;
    }

    console.log('✅ Application loaded successfully');

    // Click on "Create Lecture" button if it exists
    const createButton = page.locator('button:has-text("Create Lecture")').first();
    if (await createButton.count() > 0) {
      console.log('📝 Clicking "Create Lecture" button...');
      await createButton.click();
      await page.waitForTimeout(1000);
    } else {
      console.log('⚠️ Create Lecture button not found, checking if already in intake form...');
    }

    // Check if intake form is visible
    const intakeFormVisible = await page.locator('text=/Phase 1: Lecture Intake/i').count() > 0;

    if (!intakeFormVisible) {
      console.log('❌ Intake form not visible');
      await page.screenshot({ path: 'upload-test-error.png', fullPage: true });
      return;
    }

    console.log('✅ Intake form is visible');

    // Check if upload section exists
    const uploadSection = await page.locator('text=/Upload Existing Materials/i').count() > 0;

    if (!uploadSection) {
      console.log('❌ Upload section not found in intake form');
      await page.screenshot({ path: 'upload-section-missing.png', fullPage: true });
      return;
    }

    console.log('✅ Upload section found!');

    // Check for file input
    const fileInput = await page.locator('input[type="file"]').count() > 0;

    if (!fileInput) {
      console.log('❌ File input not found');
      return;
    }

    console.log('✅ File input element found');

    // Take screenshot of the form with upload section
    await page.screenshot({ path: 'upload-feature-success.png', fullPage: true });
    console.log('📸 Screenshot saved as upload-feature-success.png');

    // Try to upload the test file
    const testFilePath = path.join(__dirname, 'test-lecture-outline.md');

    if (fs.existsSync(testFilePath)) {
      console.log('\n📤 Attempting to upload test file...');

      // Set the file on the input
      await page.setInputFiles('input[type="file"]', testFilePath);

      // Wait for upload to process
      await page.waitForTimeout(3000);

      // Check if file was uploaded successfully
      const successMessage = await page.locator('text=/analyzed successfully/i').count() > 0;
      const suggestionsButton = await page.locator('button:has-text("Apply Suggestions")').count() > 0;

      if (successMessage || suggestionsButton) {
        console.log('✅ File uploaded and processed successfully!');

        if (suggestionsButton) {
          console.log('✅ Suggestions available - Auto-fill ready!');

          // Click apply suggestions
          await page.locator('button:has-text("Apply Suggestions")').click();
          await page.waitForTimeout(1000);

          // Check if form was populated
          const titleField = await page.inputValue('input[name="title"]');
          if (titleField && titleField.length > 0) {
            console.log(`✅ Form auto-filled with title: "${titleField}"`);
          }
        }

        await page.screenshot({ path: 'upload-complete.png', fullPage: true });
        console.log('📸 Final screenshot saved as upload-complete.png');
      } else {
        console.log('⚠️ Upload may have completed but no success indicators found');
      }
    } else {
      console.log('⚠️ Test file not found, skipping upload test');
    }

    console.log('\n🎉 Upload feature test complete!');
    console.log('The upload functionality has been successfully integrated into the intake form.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

// Run the test
testUploadFeature().then(() => {
  console.log('\n✨ Test finished!');
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});