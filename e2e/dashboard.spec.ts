import { test, expect } from '@playwright/test';

test.describe('Dashboard loads and displays data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title and header are visible', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Entire PoC Dashboard');
    await expect(page.locator('header p')).toContainText('Pattern C Validation');
  });

  test('ingestion status panel renders with data', async ({ page }) => {
    // Wait for loading to complete
    await expect(page.locator('.animate-pulse')).toHaveCount(0, { timeout: 10_000 });

    // Check key stat labels are visible (use exact matching to avoid ambiguity)
    await expect(page.getByText('Sessions', { exact: true })).toBeVisible();
    await expect(page.getByText('Checkpoints', { exact: true })).toBeVisible();
    await expect(page.getByText('Links', { exact: true })).toBeVisible();

    // Version labels should appear
    await expect(page.getByText('v0.1.0')).toBeVisible();
    await expect(page.getByText('A-star-v1')).toBeVisible();
  });

  test('refresh button triggers ingestion', async ({ page }) => {
    // Wait for initial load
    await expect(page.locator('.animate-pulse')).toHaveCount(0, { timeout: 10_000 });

    const refreshBtn = page.getByRole('button', { name: /Refresh|Running/i });
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();

    // Eventually should show "Refresh" again
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible({ timeout: 30_000 });
  });

  test('all six chart cards are visible', async ({ page }) => {
    const chartTitles = [
      'Sessions Over Time (Chart 1)',
      'Agent % per Commit (Chart 4)',
      'Slash Command Frequency (Chart 14)',
      'Tool Usage Mix (Chart 21)',
      'Friction per Session (Chart 25)',
      'Open Items per Session (Chart 26)',
    ];

    for (const title of chartTitles) {
      await expect(page.getByText(title)).toBeVisible({ timeout: 10_000 });
    }
  });

  test('cross-repo session map shows session data', async ({ page }) => {
    await expect(page.getByText('Cross-Repo Session Map')).toBeVisible();

    // Wait for the table to appear
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 15_000 });

    // Table should have headers
    await expect(page.locator('th:has-text("Session")')).toBeVisible();
    await expect(page.locator('th:has-text("Repos Touched")')).toBeVisible();
    await expect(page.locator('th:has-text("Confidence")')).toBeVisible();

    // Should have at least one data row
    const rows = table.locator('tbody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(1);
  });

  test('cross-repo session shows multi-repo badges', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 15_000 });

    // Repo badges should show backend and frontend (prefix-stripped)
    await expect(table.getByText('backend')).toBeVisible();
    await expect(table.getByText('frontend')).toBeVisible();
  });

  test('cross-repo session shows confidence badges', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 15_000 });

    await expect(table.getByText('MEDIUM')).toBeVisible();
  });

  test('workspace repo badge is shown in ingestion status', async ({ page }) => {
    await expect(page.locator('.animate-pulse')).toHaveCount(0, { timeout: 10_000 });

    // The ingestion status panel (first section) should have the workspace badge
    const statusPanel = page.locator('.bg-green-100').first();
    await expect(statusPanel).toContainText('workspace');
  });

  test('tool usage chart shows data', async ({ page }) => {
    await page.waitForTimeout(3000);

    const toolCard = page.getByText('Tool Usage Mix (Chart 21)').locator('..');
    await expect(toolCard).toBeVisible();
    await expect(toolCard.locator('.animate-pulse')).toHaveCount(0, { timeout: 10_000 });
  });

  test('footer is visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText('Entire Pattern C Validation PoC');
  });
});

test.describe('Backend API health checks', () => {
  // Trigger ingestion first so we have data in a freshly-started backend
  test('POST /api/ingest/run triggers ingestion successfully', async ({ request }) => {
    const res = await request.post('http://localhost:3001/api/ingest/run');
    expect(res.ok()).toBe(true);

    const data = await res.json();
    expect(data.jobId).toBeTruthy();
    expect(data.sessions).toBeGreaterThanOrEqual(1);
    expect(data.errors).toEqual([]);
  });

  test('GET /api/status returns valid data', async ({ request }) => {
    // Ensure ingestion has run first
    await request.post('http://localhost:3001/api/ingest/run');

    const res = await request.get('http://localhost:3001/api/status');
    expect(res.ok()).toBe(true);

    const data = await res.json();
    expect(data.version).toBe('0.1.0');
    expect(data.patternVersion).toBe('A-star-v1');
    expect(data.sessionCount).toBeGreaterThanOrEqual(1);
    expect(data.checkpointCount).toBeGreaterThanOrEqual(1);
    expect(data.repos).toContain('entire-poc-workspace');
  });

  test('GET /api/sessions/cross-repo returns sessions with multi-repo touches', async ({ request }) => {
    // Ensure ingestion has run first
    await request.post('http://localhost:3001/api/ingest/run');

    const res = await request.get('http://localhost:3001/api/sessions/cross-repo');
    expect(res.ok()).toBe(true);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);

    // Find a session that touches multiple repos
    const multiRepoSession = data.find((s: { repos: string[] }) => s.repos.length >= 2);
    expect(multiRepoSession).toBeTruthy();
    expect(multiRepoSession.repos).toContain('entire-poc-backend');
    expect(multiRepoSession.repos).toContain('entire-poc-frontend');
  });

  test('chart endpoints return arrays', async ({ request }) => {
    const endpoints = [
      '/api/charts/sessions-over-time',
      '/api/charts/agent-percentage',
      '/api/charts/slash-commands',
      '/api/charts/tool-usage',
      '/api/charts/friction',
      '/api/charts/open-items',
    ];

    for (const endpoint of endpoints) {
      const res = await request.get(`http://localhost:3001${endpoint}`);
      expect(res.ok(), `${endpoint} should return 200`).toBe(true);
      const data = await res.json();
      expect(Array.isArray(data), `${endpoint} should return an array`).toBe(true);
    }
  });

  test('tool-usage chart has real data', async ({ request }) => {
    // Ensure ingestion has run
    await request.post('http://localhost:3001/api/ingest/run');

    const res = await request.get('http://localhost:3001/api/charts/tool-usage');
    const data = await res.json();

    expect(data.length).toBeGreaterThanOrEqual(1);
    const toolNames = data.map((d: { tool: string }) => d.tool);
    expect(toolNames).toContain('Read');
    expect(toolNames).toContain('Edit');
  });
});
