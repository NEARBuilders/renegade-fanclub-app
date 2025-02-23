// @ts-check
import { defineConfig, devices } from "@playwright/test";

// Set test environment variables
process.env.JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? "100%" : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "line",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    permissions: ["clipboard-read"],
    video: "off",
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    storageState: {
      cookies: [],
      origins: [
        {
          origin: BASE_URL,
          localStorage: [],
        },
      ],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: "cd ../../apps/api && bun run init && bun run dev",
      port: 8787,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
      stderr: "pipe",
      gracefulShutdown: {
        signal: "SIGTERM",
        timeout: 1000,
      },
    },
    {
      command: "cd ../../apps/www && bun run start",
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
      stderr: "pipe",
      gracefulShutdown: {
        signal: "SIGTERM",
        timeout: 1000,
      },
    },
  ],
});
