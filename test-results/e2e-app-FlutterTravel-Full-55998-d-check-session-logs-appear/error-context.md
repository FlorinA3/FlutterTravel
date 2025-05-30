# Test info

- Name: FlutterTravel Full App E2E >> Start session, stop session and check session logs appear
- Location: C:\Users\Alexx\Desktop\app\munca\FlutterTravel\e2e\app.test.ts:17:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('button#start-session') to be visible

    at C:\Users\Alexx\Desktop\app\munca\FlutterTravel\e2e\app.test.ts:19:48
```

# Page snapshot

```yaml
- region "Notifications (F8)":
  - list
- banner:
  - img "Device"
  - heading "BLE Controller" [level=1]
  - img
  - text: 0/10
  - button:
    - img
- navigation:
  - button "Devices"
  - button "Logs"
  - button "Schedule"
- main:
  - button "Scan for Devices":
    - img
    - text: Scan for Devices
  - img
  - text: Add Device
```

# Test source

```ts
   1 | ﻿import { test, expect } from '@playwright/test';
   2 |
   3 | const BASE_URL = 'http://localhost:5000'; // Adjust if needed
   4 |
   5 | test.describe('FlutterTravel Full App E2E', () => {
   6 |
   7 |   test.beforeEach(async ({ page }) => {
   8 |     await page.goto(BASE_URL);
   9 |   });
  10 |
  11 |   test('App loads home page and shows welcome', async ({ page }) => {
  12 |     // Wait longer for title (10s) to avoid flakiness
  13 |     await expect(page).toHaveTitle(/FlutterTravel/i, { timeout: 10000 });
  14 |     await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });
  15 |   });
  16 |
  17 |   test('Start session, stop session and check session logs appear', async ({ page }) => {
  18 |     // Wait for button to be visible before clicking
> 19 |     await page.locator('button#start-session').waitFor({ state: 'visible', timeout: 10000 });
     |                                                ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  20 |     await page.click('button#start-session');
  21 |     await expect(page.locator('text=Session started')).toBeVisible({ timeout: 10000 });
  22 |
  23 |     await page.waitForTimeout(2000);
  24 |
  25 |     await page.locator('button#stop-session').waitFor({ state: 'visible', timeout: 10000 });
  26 |     await page.click('button#stop-session');
  27 |     await expect(page.locator('text=Session stopped')).toBeVisible({ timeout: 10000 });
  28 |
  29 |     const logs = await page.locator('.session-log-item').allTextContents();
  30 |     expect(logs.length).toBeGreaterThan(0);
  31 |   });
  32 |
  33 |   test('Create, update, and delete schedule flow', async ({ page }) => {
  34 |     await page.locator('a#nav-schedules').waitFor({ state: 'visible', timeout: 10000 });
  35 |     await page.click('a#nav-schedules');
  36 |
  37 |     await page.locator('input#schedule-datetime').waitFor({ state: 'visible', timeout: 10000 });
  38 |     await page.fill('input#schedule-datetime', '2025-12-31T12:00');
  39 |
  40 |     await page.locator('input#schedule-task').waitFor({ state: 'visible', timeout: 10000 });
  41 |     await page.fill('input#schedule-task', 'E2E Test Task');
  42 |
  43 |     await page.locator('button#add-schedule').waitFor({ state: 'visible', timeout: 10000 });
  44 |     await page.click('button#add-schedule');
  45 |
  46 |     await expect(page.locator('.schedule-item')).toContainText('E2E Test Task', { timeout: 10000 });
  47 |
  48 |     await page.locator('.schedule-item >> button.edit').waitFor({ state: 'visible', timeout: 10000 });
  49 |     await page.click('.schedule-item >> button.edit');
  50 |
  51 |     await page.locator('input#schedule-task').fill('Updated E2E Test Task');
  52 |     await page.locator('button#save-schedule').click();
  53 |
  54 |     await expect(page.locator('.schedule-item')).toContainText('Updated E2E Test Task', { timeout: 10000 });
  55 |
  56 |     await page.locator('.schedule-item >> button.delete').click();
  57 |
  58 |     await expect(page.locator('.schedule-item')).not.toContainText('Updated E2E Test Task', { timeout: 10000 });
  59 |   });
  60 |
  61 |   test('API: Validate logs and schedules endpoints', async ({ request }) => {
  62 |     const logsResponse = await request.get(`${BASE_URL}/api/logs`);
  63 |     expect(logsResponse.ok()).toBeTruthy();
  64 |     const logs = await logsResponse.json();
  65 |     expect(Array.isArray(logs)).toBe(true);
  66 |
  67 |     const schedulesResponse = await request.get(`${BASE_URL}/api/schedules`);
  68 |     expect(schedulesResponse.ok()).toBeTruthy();
  69 |     const schedules = await schedulesResponse.json();
  70 |     expect(Array.isArray(schedules)).toBe(true);
  71 |   });
  72 |
  73 | });
  74 |
```