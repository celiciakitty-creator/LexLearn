import { describe, it, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { app, _resetForTests } from '../src/server.js';
import { _seedDeveloper, resetStoreImpl } from '../src/store.js';
import { resetTestStoreConnection } from '../src/test-store.js';

process.env.NODE_ENV = 'test';
delete process.env.SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
resetStoreImpl();

let server;

before(async () => {
  await _resetForTests();
  server = app.listen(0);
});

after(async () => {
  if (!server) return;
  server.closeAllConnections?.();
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

beforeEach(async () => {
  await _resetForTests();
  await _seedDeveloper({
    id: 'dev-test',
    handle: 'alice',
    api_key: 'test_key',
    sandbox: false,
  });
});

async function api(method, path, body, key = 'test_key') {
  const port = server.address().port;
  const res = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = res.headers.get('content-type')?.includes('json')
    ? await res.json()
    : await res.text();
  return { status: res.status, body: json };
}

const registerPayload = {
  title: 'Learn SQL',
  description: 'A'.repeat(100),
  topic: 'SQL',
  launch_url: 'https://app.example.com/launch',
  repo_url: 'https://github.com/alice/learn-sql',
};

describe('Ludwitt/Hult API', () => {
  it('registers an app', async () => {
    const { status, body } = await api('POST', '/v1/developer/apps', registerPayload);
    assert.equal(status, 201);
    assert.ok(body.app_id);
    assert.ok(body.api_key);
  });

  it('rejects invalid developer credentials', async () => {
    const { status, body } = await api(
      'POST',
      '/v1/developer/apps',
      registerPayload,
      'not-a-real-key'
    );
    assert.equal(status, 401);
    assert.equal(body.error, 'invalid api key');
  });

  it('records events and returns qualified user count', async () => {
    const reg = await api('POST', '/v1/developer/apps', {
      ...registerPayload,
      description: 'B'.repeat(100),
    });
    const app_id = reg.body.app_id;

    await api('POST', `/v1/apps/${app_id}/events`, {
      event: 'lesson_started',
      user_id: 'external-user-1',
      session_id: 'sess-1',
    });
    await api('POST', `/v1/apps/${app_id}/events`, {
      event: 'session_heartbeat',
      user_id: 'external-user-2',
      session_id: 'sess-2',
    });

    const metrics = await api('GET', `/v1/apps/${app_id}/metrics`);
    assert.equal(metrics.body.unique_users, 2);
    assert.equal(metrics.body.qualified_users, 1);
  });

  it('does not count heartbeat-only users as qualified', async () => {
    const reg = await api('POST', '/v1/developer/apps', {
      ...registerPayload,
      description: 'D'.repeat(100),
    });
    const app_id = reg.body.app_id;

    await api('POST', `/v1/apps/${app_id}/events`, {
      event: 'session_heartbeat',
      user_id: 'heartbeat-only-user',
      session_id: 'sess-hb',
    });

    const metrics = await api('GET', `/v1/apps/${app_id}/metrics`);
    assert.equal(metrics.body.unique_users, 1);
    assert.equal(metrics.body.qualified_users, 0);
  });

  it('does not count sandbox developer events', async () => {
    await _seedDeveloper({
      id: 'dev-sandbox-test',
      handle: 'sandbox-dev',
      api_key: 'sandbox_test_key',
      sandbox: true,
    });

    const reg = await api('POST', '/v1/developer/apps', {
      ...registerPayload,
      description: 'E'.repeat(100),
    }, 'sandbox_test_key');
    const app_id = reg.body.app_id;

    const event = await api(
      'POST',
      `/v1/apps/${app_id}/events`,
      {
        event: 'lesson_started',
        user_id: 'sandbox-user',
        session_id: 'sess-sandbox',
      },
      'sandbox_test_key'
    );

    assert.equal(event.status, 202);
    assert.equal(event.body.counted, false);

    const metrics = await api(
      'GET',
      `/v1/apps/${app_id}/metrics`,
      undefined,
      'sandbox_test_key'
    );
    assert.equal(metrics.body.unique_users, 0);
    assert.equal(metrics.body.qualified_users, 0);
  });

  it('blocks exact cohort member user_ids from counting', async () => {
    const reg = await api('POST', '/v1/developer/apps', {
      ...registerPayload,
      description: 'C'.repeat(100),
    });
    const app_id = reg.body.app_id;

    await api('POST', `/v1/apps/${app_id}/events`, {
      event: 'lesson_started',
      user_id: 'alice',
      session_id: 'sess-self',
    });
    await api('POST', `/v1/apps/${app_id}/events`, {
      event: 'lesson_started',
      user_id: 'alice-friend',
      session_id: 'sess-x',
    });

    const metrics = await api('GET', `/v1/apps/${app_id}/metrics`);
    assert.equal(metrics.body.qualified_users, 1);
  });
});

describe('In-memory persistence (unit)', () => {
  it('retains registered apps, events, and metrics across reinitialization', async () => {
    const reg = await api('POST', '/v1/developer/apps', {
      ...registerPayload,
      description: 'F'.repeat(100),
    });
    const app_id = reg.body.app_id;

    await api('POST', `/v1/apps/${app_id}/events`, {
      event: 'lesson_started',
      user_id: 'external-user-1',
      session_id: 'sess-1',
    });
    await api('POST', `/v1/apps/${app_id}/events`, {
      event: 'session_heartbeat',
      user_id: 'external-user-2',
      session_id: 'sess-2',
    });

    const beforeRestart = await api('GET', `/v1/apps/${app_id}/metrics`);
    assert.equal(beforeRestart.body.unique_users, 2);
    assert.equal(beforeRestart.body.qualified_users, 1);

    resetTestStoreConnection();
    resetStoreImpl();

    const afterRestart = await api('GET', `/v1/apps/${app_id}/metrics`);
    assert.equal(afterRestart.body.unique_users, 2);
    assert.equal(afterRestart.body.qualified_users, 1);
  });

  it('continues to authenticate configured developers after restart', async () => {
    resetTestStoreConnection();
    resetStoreImpl();

    const { status } = await api('POST', '/v1/developer/apps', {
      ...registerPayload,
      description: 'G'.repeat(100),
    });
    assert.equal(status, 201);
  });
});
