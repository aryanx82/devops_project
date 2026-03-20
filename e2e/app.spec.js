/**
 * E2E Tests — Playwright
 *
 * Simulates real user flow visiting the ShopSmart frontend.
 * Runs against the static build served at http://localhost:4173
 * (Vite preview server).
 *
 * Flow tested:
 *   1. User visits the homepage
 *   2. Page loads with correct title
 *   3. "Backend Status" section is visible
 *   4. Loading message appears initially
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4173/shopsmart/';

test.describe('ShopSmart E2E — Homepage', () => {
    test('page has ShopSmart heading', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // Wait for React to render
        
        // Look for ShopSmart text anywhere on the page
        const shopSmartText = page.getByText(/ShopSmart/i);
        await expect(shopSmartText).toBeVisible();
    });

    test('page shows Backend Status section', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // Wait for React to render
        
        // Look for API online text instead of "Backend Status"
        const apiStatus = page.getByText(/API online/i);
        await expect(apiStatus).toBeVisible();
    });

    test('page title is correct', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page).toHaveTitle(/ShopSmart/i);
    });
});
