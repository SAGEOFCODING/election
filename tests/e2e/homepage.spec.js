const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('loads and shows timeline', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/ElectionIQ/);
    
    // Check header
    const header = page.locator('h1', { hasText: 'ElectionIQ' });
    await expect(header).toBeVisible();

    // Check timeline is rendered
    const timelineSection = page.locator('#timeline-section');
    await expect(timelineSection).toBeVisible();
    
    // Assuming mock data loads "Voter Registration" and "Election Day"
    const phase1 = page.locator('h4', { hasText: 'Voter Registration' });
    await expect(phase1).toBeVisible();
    
    // Click phase to expand
    await phase1.click();
    const addBtn = page.locator('button', { hasText: 'Add to Calendar' }).first();
    await expect(addBtn).toBeVisible();
  });
});
