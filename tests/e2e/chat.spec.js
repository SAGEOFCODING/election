const { test, expect } = require('@playwright/test');

test.describe('Chat Assistant', () => {
  test('opens and handles query', async ({ page }) => {
    await page.goto('/');
    
    const toggleBtn = page.locator('#toggle-chat-btn');
    await expect(toggleBtn).toBeVisible();
    
    // Open chat
    await toggleBtn.click();
    
    // Click a suggested chip
    const chip = page.locator('button.chip', { hasText: 'How do I register?' });
    await chip.click();
    
    // Expect user message
    const userMsg = page.locator('.message.user', { hasText: 'How do I register?' });
    await expect(userMsg).toBeVisible();
    
    // Expect bot response
    const botMsg = page.locator('.message.bot', { hasText: /register online/i });
    await expect(botMsg).toBeVisible({ timeout: 5000 });
  });
});
