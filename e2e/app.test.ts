import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5000'; // Adjust if needed

test.describe('FlutterTravel Full App E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('App loads home page and shows welcome', async ({ page }) => {
    // Wait longer for title (10s) to avoid flakiness
    await expect(page).toHaveTitle(/FlutterTravel/i, { timeout: 10000 });
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });
  });

  test('Start session, stop session and check session logs appear', async ({ page }) => {
    // Wait for button to be visible before clicking
    await page.locator('button#start-session').waitFor({ state: 'visible', timeout: 10000 });
    await page.click('button#start-session');
    await expect(page.locator('text=Session started')).toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(2000);

    await page.locator('button#stop-session').waitFor({ state: 'visible', timeout: 10000 });
    await page.click('button#stop-session');
    await expect(page.locator('text=Session stopped')).toBeVisible({ timeout: 10000 });

    const logs = await page.locator('.session-log-item').allTextContents();
    expect(logs.length).toBeGreaterThan(0);
  });

  test('Create, update, and delete schedule flow', async ({ page }) => {
    await page.locator('a#nav-schedules').waitFor({ state: 'visible', timeout: 10000 });
    await page.click('a#nav-schedules');

    await page.locator('input#schedule-datetime').waitFor({ state: 'visible', timeout: 10000 });
    await page.fill('input#schedule-datetime', '2025-12-31T12:00');

    await page.locator('input#schedule-task').waitFor({ state: 'visible', timeout: 10000 });
    await page.fill('input#schedule-task', 'E2E Test Task');

    await page.locator('button#add-schedule').waitFor({ state: 'visible', timeout: 10000 });
    await page.click('button#add-schedule');

    await expect(page.locator('.schedule-item')).toContainText('E2E Test Task', { timeout: 10000 });

    await page.locator('.schedule-item >> button.edit').waitFor({ state: 'visible', timeout: 10000 });
    await page.click('.schedule-item >> button.edit');

    await page.locator('input#schedule-task').fill('Updated E2E Test Task');
    await page.locator('button#save-schedule').click();

    await expect(page.locator('.schedule-item')).toContainText('Updated E2E Test Task', { timeout: 10000 });

    await page.locator('.schedule-item >> button.delete').click();

    await expect(page.locator('.schedule-item')).not.toContainText('Updated E2E Test Task', { timeout: 10000 });
  });

  test('API: Validate logs and schedules endpoints', async ({ request }) => {
    const logsResponse = await request.get(`${BASE_URL}/api/logs`);
    expect(logsResponse.ok()).toBeTruthy();
    const logs = await logsResponse.json();
    expect(Array.isArray(logs)).toBe(true);

    const schedulesResponse = await request.get(`${BASE_URL}/api/schedules`);
    expect(schedulesResponse.ok()).toBeTruthy();
    const schedules = await schedulesResponse.json();
    expect(Array.isArray(schedules)).toBe(true);
  });

});
