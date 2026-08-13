import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

import { resetSupabaseClient } from '../src/supabase.js';
import { resetStoreImpl } from '../src/store.js';

const hasSupabase =
  Boolean(process.env.SUPABASE_URL?.trim()) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

let store;

before(async () => {
  if (!hasSupabase) {
    return;
  }

  process.env.NODE_ENV = 'test';
  resetStoreImpl();
  resetSupabaseClient();
  store = await import('../src/store.js');
  await store._resetForTests();
  await store._seedDeveloper({
    id: 'dev-test',
    handle: 'alice',
    api_key: 'test_key',
    sandbox: false,
  });
});

after(async () => {
  if (!hasSupabase) {
    return;
  }

  await store._resetForTests();
  resetSupabaseClient();
  resetStoreImpl();
});

describe('Supabase persistence (integration)', { skip: !hasSupabase }, () => {
  it('retains registered apps, events, and metrics across client reinitialization', async () => {
    const app = await store.registerApp('dev-test', {
      title: 'LexLearn',
      description: 'X'.repeat(100),
      topic: 'Law',
      launch_url: 'https://lexlearn.example/launch',
      repo_url: 'https://github.com/example/lexlearn',
      student_handle: 'alice',
    });

    await store.recordEvent(app.app_id, {
      event: 'lesson_started',
      user_id: 'external-user-1',
      session_id: 'sess-1',
      metadata: { module_id: '1' },
      sandbox: false,
    });
    await store.recordEvent(app.app_id, {
      event: 'session_heartbeat',
      user_id: 'external-user-2',
      session_id: 'sess-2',
      sandbox: false,
    });

    const beforeRestart = await store.getMetrics(app.app_id);
    assert.equal(beforeRestart.unique_users, 2);
    assert.equal(beforeRestart.qualified_users, 1);

    resetSupabaseClient();
    resetStoreImpl();
    store = await import('../src/store.js');

    const restored = await store.getApp(app.app_id);
    assert.ok(restored);
    assert.equal(restored.app_id, app.app_id);
    assert.equal(restored.developer_id, 'dev-test');
    assert.equal(restored.api_key, app.api_key);
    assert.equal(restored.jwt_secret, app.jwt_secret);
    assert.equal(restored.title, 'LexLearn');
    assert.equal(restored.student_handle, 'alice');

    const afterRestart = await store.getMetrics(app.app_id);
    assert.equal(afterRestart.unique_users, 2);
    assert.equal(afterRestart.qualified_users, 1);

    const snapshot = await store.getMetrics.exportSnapshot();
    assert.match(snapshot[1], new RegExp(app.app_id));
    assert.match(snapshot[1], /,2,1$/);
  });

  it('continues to authenticate configured developers after restart', async () => {
    resetSupabaseClient();
    resetStoreImpl();
    store = await import('../src/store.js');

    const developer = await store.authenticateDeveloper('test_key');
    assert.ok(developer);
    assert.equal(developer.handle, 'alice');
    assert.equal(developer.sandbox, false);
  });
});

describe('Supabase integration setup', { skip: hasSupabase }, () => {
  it('documents required env vars when credentials are absent', () => {
    assert.ok(true, 'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run npm run test:integration');
  });
});
