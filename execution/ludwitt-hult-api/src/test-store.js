import { randomUUID } from 'crypto';

const DEFAULT_BLOCKED_USER_IDS = ['cohort-member-1', 'cohort-member-2'];

const developers = new Map();
const apps = new Map();
const events = [];
const blockedUserIds = new Set();

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
  for (const dev of developers.values()) {
    if (dev.api_key === apiKey) {
      return mapDeveloper(dev);
    }
  }
  return null;
}

export async function registerApp(developerId, meta) {
  const app_id = randomUUID();
  const api_key = `app_${randomUUID().replace(/-/g, '')}`;
  const jwt_secret = randomUUID();

  apps.set(app_id, {
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

  return { app_id, api_key, jwt_secret };
}

export async function getApp(app_id) {
  return mapApp(apps.get(app_id));
}

export async function isBlockedUser(user_id, student_handle) {
  const normalizedUser = String(user_id ?? '').trim().toLowerCase();
  if (!normalizedUser) {
    return false;
  }

  if (blockedUserIds.has(normalizedUser)) {
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

  events.push({
    app_id,
    event,
    user_id,
    session_id,
    metadata: metadata ?? null,
    ts: Date.now(),
  });
}

export async function getMetrics(app_id) {
  const appEvents = events.filter((row) => row.app_id === app_id);
  const uniqueUsers = new Set(appEvents.map((row) => row.user_id));
  const qualifiedUsers = new Set(
    appEvents
      .filter((row) =>
        ['lesson_started', 'lesson_completed', 'quiz_submitted'].includes(row.event)
      )
      .map((row) => row.user_id)
  );

  return {
    unique_users: uniqueUsers.size,
    qualified_users: qualifiedUsers.size,
  };
}

getMetrics.exportSnapshot = async function exportSnapshot() {
  const header = 'app_id,student_handle,unique_users,qualified_users';
  const rows = [header];
  const sortedApps = [...apps.values()].sort((a, b) => a.app_id.localeCompare(b.app_id));

  for (const app of sortedApps) {
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

  developers.set('dev-sandbox', {
    id: 'dev-sandbox',
    handle: 'student-demo',
    api_key: 'sandbox_key_demo',
    sandbox: true,
  });
  developers.set('dev-prod', {
    id: 'dev-prod',
    handle,
    api_key: prodKey,
    sandbox: false,
  });

  for (const userId of DEFAULT_BLOCKED_USER_IDS) {
    blockedUserIds.add(userId);
  }
}

export async function _resetForTests() {
  developers.clear();
  apps.clear();
  events.length = 0;
  blockedUserIds.clear();
  await seedDefaults();
}

export async function _seedDeveloper(dev) {
  developers.set(dev.id, {
    id: dev.id,
    handle: dev.handle,
    api_key: dev.api_key,
    sandbox: Boolean(dev.sandbox),
  });
}

export async function _blockUser(id) {
  blockedUserIds.add(String(id).trim().toLowerCase());
}

export function resetTestStoreConnection() {
  // In-memory data persists across simulated restarts — same as durable external storage.
}
