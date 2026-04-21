import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  // Expect backend on :3001 and frontend on :5173 to be running already
  webServer: undefined,
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
