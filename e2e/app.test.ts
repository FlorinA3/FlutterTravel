import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5000'; // Change if your backend runs on a different port

test.describe('FlutterTravel Full App E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('App loads home page and shows welcome', async ({ page }) => {
    await expect(page).toHaveTitle(/FlutterTravel/i);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('Start session, stop session and check session logs appear', async ({ page }) => {
    await page.click('button#start-session');
    await expect(page.locator('text=Session started')).toBeVisible();
    await page.waitForTimeout(2000);
    await page.click('button#stop-session');
    await expect(page.locator('text=Session stopped')).toBeVisible();
    const logs = await page.locator('.session-log-item').allTextContents();
    expect(logs.length).toBeGreaterThan(0);
  });

  test('Create, update, and delete schedule flow', async ({ page }) => {
    await page.click('a#nav-schedules');
    await page.fill('input#schedule-datetime', '2025-12-31T12:00');
    await page.fill('input#schedule-task', 'E2E Test Task');
    await page.click('button#add-schedule');
    await expect(page.locator('.schedule-item')).toContainText('E2E Test Task');
    await page.click('.schedule-item >> button.edit');
    await page.fill('input#schedule-task', 'Updated E2E Test Task');
    await page.click('button#save-schedule');
    await expect(page.locator('.schedule-item')).toContainText('Updated E2E Test Task');
    await page.click('.schedule-item >> button.delete');
    await expect(page.locator('.schedule-item')).not.toContainText('Updated E2E Test Task');
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
