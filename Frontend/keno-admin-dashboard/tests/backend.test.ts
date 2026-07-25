import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from '../server';

const originalNodeEnv = process.env.NODE_ENV;

test('health and dashboard endpoints respond', async () => {
  process.env.NODE_ENV = 'production';

  const server = await startServer(0);
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Server did not bind to a TCP port');
  }

  try {
    const healthRes = await fetch(`http://127.0.0.1:${address.port}/health`);
    assert.equal(healthRes.status, 200);
    const healthBody = await healthRes.json();
    assert.equal(healthBody.status, 'ok');

    const dashboardRes = await fetch(`http://127.0.0.1:${address.port}/admin/dashboard`);
    assert.equal(dashboardRes.status, 200);
    const dashboardBody = await dashboardRes.json();
    assert.ok(dashboardBody.kpis);
    assert.ok(dashboardBody.charts);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    process.env.NODE_ENV = originalNodeEnv;
  }
});
