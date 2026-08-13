import fs from 'fs';
import { randomBytes } from 'crypto';
import { spawnSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

const ENV_PATH = '.env.production.local';
const LEXLEARN_APP_ID = '10af7f09-1664-4ccf-866c-c917dc9d9df2';
const PRODUCTION_URL = 'https://lexlearn-week5-metrics-api.vercel.app';

function loadEnvFile(path) {
  const out = {};
  if (!fs.existsSync(path)) {
    return out;
  }
  for (const line of fs.readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

function writeEnvFile(path, env) {
  const lines = [
    '# Production secrets — gitignored',
    `SUPABASE_URL=${env.SUPABASE_URL ?? ''}`,
    `SUPABASE_SERVICE_ROLE_KEY=${env.SUPABASE_SERVICE_ROLE_KEY ?? ''}`,
    `HULT_DEV_API_KEY=${env.HULT_DEV_API_KEY ?? ''}`,
    `HULT_DEVELOPER_HANDLE=${env.HULT_DEVELOPER_HANDLE ?? 'celiciakitty-creator'}`,
    `ADMIN_KEY=${env.ADMIN_KEY ?? ''}`,
    `NODE_ENV=${env.NODE_ENV ?? 'production'}`,
  ];
  fs.writeFileSync(path, `${lines.join('\n')}\n`);
}

function strongKey(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

function runVercel(args) {
  const result = spawnSync('npx', ['vercel', ...args], {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    console.error(`vercel ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
    process.exit(result.status ?? 1);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const env = loadEnvFile(ENV_PATH);
if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.production.local');
  process.exit(1);
}

const newDevKey = strongKey();
const newAdminKey = strongKey();

env.HULT_DEV_API_KEY = newDevKey;
env.ADMIN_KEY = newAdminKey;
writeEnvFile(ENV_PATH, env);
console.log(`Updated ${ENV_PATH} (HULT_DEV_API_KEY, ADMIN_KEY rotated)`);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data: appBefore, error: appBeforeError } = await supabase
  .from('apps')
  .select('app_id, title, student_handle, launch_url')
  .eq('app_id', LEXLEARN_APP_ID)
  .maybeSingle();

if (appBeforeError) {
  console.error('Failed to load LexLearn app before rotation:', appBeforeError.message);
  process.exit(1);
}

if (!appBefore) {
  console.error('LexLearn app registration not found before rotation');
  process.exit(1);
}

const { error: devUpdateError } = await supabase
  .from('developers')
  .update({ api_key: newDevKey })
  .eq('id', 'dev-prod');

if (devUpdateError) {
  console.error('Failed to update Supabase developer api_key:', devUpdateError.message);
  process.exit(1);
}
console.log('Updated Supabase developers.dev-prod api_key');

for (const name of ['HULT_DEV_API_KEY', 'ADMIN_KEY']) {
  runVercel(['env', 'add', name, 'production', '--force', '--value', env[name], '--yes']);
  console.log(`Set Vercel production env: ${name}`);
}

console.log('Redeploying reference API to production...');
const deploy = spawnSync('npx', ['vercel', 'deploy', '--prod', '--yes'], {
  shell: true,
  stdio: ['ignore', 'inherit', 'inherit'],
});
if (deploy.status !== 0) {
  process.exit(deploy.status ?? 1);
}
console.log('Production redeploy complete');

console.log('Waiting for deployment to become live...');
await sleep(15000);

let metricsOk = false;
let metricsBody = null;
for (let attempt = 1; attempt <= 5; attempt += 1) {
  const response = await fetch(
    `${PRODUCTION_URL}/v1/apps/${LEXLEARN_APP_ID}/metrics`,
    {
      headers: { Authorization: `Bearer ${newDevKey}` },
      cache: 'no-store',
    }
  );

  if (response.ok) {
    metricsBody = await response.json();
    metricsOk = true;
    break;
  }

  if (attempt < 5) {
    await sleep(10000);
  } else {
    console.error('Metrics verification failed:', response.status);
    process.exit(1);
  }
}

const { data: appAfter, error: appAfterError } = await supabase
  .from('apps')
  .select('app_id, title, student_handle, launch_url')
  .eq('app_id', LEXLEARN_APP_ID)
  .maybeSingle();

if (appAfterError || !appAfter) {
  console.error('LexLearn app missing after rotation');
  process.exit(1);
}

const registrationUnchanged =
  appAfter.app_id === appBefore.app_id &&
  appAfter.title === appBefore.title &&
  appAfter.student_handle === appBefore.student_handle &&
  appAfter.launch_url === appBefore.launch_url;

console.log(
  JSON.stringify(
    {
      authentication: metricsOk ? 'ok' : 'failed',
      metrics: {
        unique_users: metricsBody?.unique_users,
        qualified_users: metricsBody?.qualified_users,
      },
      lexlearn_app_id: appAfter.app_id,
      registration_unchanged: registrationUnchanged,
    },
    null,
    2
  )
);

if (!registrationUnchanged) {
  process.exit(1);
}

if (
  metricsBody?.unique_users !== 0 ||
  metricsBody?.qualified_users !== 0
) {
  console.error('Expected metrics 0 / 0 after rotation');
  process.exit(1);
}

console.log('Secret rotation completed successfully.');
