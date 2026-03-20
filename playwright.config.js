// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 30_000,
    retries: 0,
    use: {
        baseURL: 'http://localhost:4173',
        headless: true,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // Serve the built frontend before running tests
    webServer: {
        command: 'npm run preview --prefix client',
        url: 'http://localhost:4173/shopsmart/',
        reuseExistingServer: true,
        timeout: 30_000,
    },
});
