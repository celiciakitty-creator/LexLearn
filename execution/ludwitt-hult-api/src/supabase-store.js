import { randomUUID } from 'crypto';

import { getSupabase } from './supabase.js';

const DEFAULT_BLOCKED_USER_IDS = ['cohort-member-1', 'cohort-member-2'];
const QUALIFYING_EVENTS = ['lesson_started', 'lesson_completed', 'quiz_submitted'];

function mapDeveloper(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    handle: row.handle,
    api_key: row.api_key,
    sandbox: Boolean(row.sandbox),
  };
}

function mapApp(row) {
  if (!row) {
    return null;
  }

  return {
    app_id: row.app_id,
    developer_id: row.developer_id,
    api_key: row.api_key,
    jwt_secret: row.jwt_secret,
    status: row.status,
    title: row.title,
    description: row.description,
    topic: row.topic,
    launch_url: row.launch_url,
    repo_url: row.repo_url,
    icon_url: row.icon_url ?? undefined,
    student_handle: row.student_handle,
  };
}

function csvCell(value) {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function authenticateDeveloper(apiKey) {
  const { data, error } = await getSupabase()
    .from('developers')
    .select('id, handle, api_key, sandbox')
    .eq('api_key', apiKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return mapDeveloper(data);
}

export async function registerApp(developerId, meta) {
  const app_id = randomUUID();
  const api_key = `app_${randomUUID().replace(/-/g, '')}`;
  const jwt_secret = randomUUID();

  const { error } = await getSupabase().from('apps').insert({
    app_id,
    developer_id: developerId,
    api_key,
    jwt_secret,
    status: 'pending_review',
    title: meta.title,
    description: meta.description,
    topic: meta.topic,
    launch_url: meta.launch_url,
    repo_url: meta.repo_url,
    icon_url: meta.icon_url ?? null,
    student_handle: meta.student_handle,
  });

  if (error) {
    throw error;
  }

  return { app_id, api_key, jwt_secret };
}

export async function getApp(app_id) {
  const { data, error } = await getSupabase()
    .from('apps')
    .select(
      'app_id, developer_id, api_key, jwt_secret, status, title, description, topic, launch_url, repo_url, icon_url, student_handle'
    )
    .eq('app_id', app_id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return mapApp(data);
}

export async function isBlockedUser(user_id, student_handle) {
  const normalizedUser = String(user_id ?? '').trim().toLowerCase();
  if (!normalizedUser) {
    return false;
  }

  const { data, error } = await getSupabase()
    .from('blocked_user_ids')
    .select('user_id')
    .eq('user_id', normalizedUser)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return true;
  }

  const normalizedHandle = String(student_handle ?? '').trim().toLowerCase();
  if (!normalizedHandle) {
    return false;
  }

  return normalizedUser === normalizedHandle;
}

export async function recordEvent(app_id, { event, user_id, session_id, metadata, sandbox }) {
  if (sandbox || event.startsWith('sandbox.')) {
    return;
  }

  const { error } = await getSupabase().from('events').insert({
    app_id,
    event,
    user_id,
    session_id,
    metadata: metadata ?? null,
    ts: Date.now(),
  });

  if (error) {
    throw error;
  }
}

export async function getMetrics(app_id) {
  const { data, error } = await getSupabase().rpc('get_app_metrics', { p_app_id: app_id });

  if (error) {
    throw error;
  }

  return {
    unique_users: Number(data?.unique_users ?? 0),
    qualified_users: Number(data?.qualified_users ?? 0),
  };
}

getMetrics.exportSnapshot = async function exportSnapshot() {
  const header = 'app_id,student_handle,unique_users,qualified_users';
  const rows = [header];

  const { data: apps, error } = await getSupabase()
    .from('apps')
    .select('app_id, student_handle')
    .order('app_id');

  if (error) {
    throw error;
  }

  for (const app of apps ?? []) {
    const metrics = await getMetrics(app.app_id);
    rows.push(
      [app.app_id, app.student_handle, metrics.unique_users, metrics.qualified_users]
        .map(csvCell)
        .join(',')
    );
  }

  return rows;
};

export async function seedDefaults() {
  const handle = process.env.HULT_DEVELOPER_HANDLE?.trim() || 'student-demo';
  const prodKey = process.env.HULT_DEV_API_KEY?.trim() || 'prod_key_demo';

  const { error: devError } = await getSupabase().from('developers').upsert(
    [
      {
        id: 'dev-sandbox',
        handle: 'student-demo',
        api_key: 'sandbox_key_demo',
        sandbox: true,
      },
      {
        id: 'dev-prod',
        handle,
        api_key: prodKey,
        sandbox: false,
      },
    ],
    { onConflict: 'id' }
  );

  if (devError) {
    throw devError;
  }

  const blockedRows = DEFAULT_BLOCKED_USER_IDS.map((user_id) => ({ user_id }));
  const { error: blockError } = await getSupabase()
    .from('blocked_user_ids')
    .upsert(blockedRows, { onConflict: 'user_id', ignoreDuplicates: true });

  if (blockError) {
    throw blockError;
  }
}

export async function _resetForTests() {
  const supabase = getSupabase();
  await supabase.from('events').delete().neq('id', 0);
  await supabase.from('apps').delete().neq('app_id', '');
  await supabase.from('developers').delete().neq('id', '');
  await supabase.from('blocked_user_ids').delete().neq('user_id', '');
  await seedDefaults();
}

export async function _seedDeveloper(dev) {
  const { error } = await getSupabase()
    .from('developers')
    .upsert(
      {
        id: dev.id,
        handle: dev.handle,
        api_key: dev.api_key,
        sandbox: Boolean(dev.sandbox),
      },
      { onConflict: 'id' }
    );

  if (error) {
    throw error;
  }
}

export async function _blockUser(id) {
  const user_id = String(id).trim().toLowerCase();
  const { error } = await getSupabase()
    .from('blocked_user_ids')
    .upsert({ user_id }, { onConflict: 'user_id', ignoreDuplicates: true });

  if (error) {
    throw error;
  }
}

export { QUALIFYING_EVENTS };
