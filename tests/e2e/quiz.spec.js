const { test, expect } = require('@playwright/test');

test.describe('Interactive Quiz', () => {
  test('completes the quiz', async ({ page }) => {
    await page.goto('/');
    
    const startBtn = page.locator('#start-quiz-btn');
    await startBtn.click();
    
    const modal = page.locator('#quiz-modal');
    await expect(modal).toBeVisible();
    
    // Question 1
    const opt18 = page.locator('.quiz-opt', { hasText: '18' });
    await opt18.click();
    
    // Wait for explanation
    const feedback = page.locator('#quiz-feedback');
    await expect(feedback).toContainText('Correct!');
    
    // Question 2
    const optEC = page.locator('.quiz-opt', { hasText: 'A system to elect the president' });
    await optEC.click();
    
    // Wait for end
    const scoreText = page.locator('p', { hasText: /Your score: 2 out of 2/ });
    await expect(scoreText).toBeVisible({ timeout: 5000 });
  });
});
