import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile('.env');

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const tables = ['developers', 'apps', 'events', 'blocked_user_ids'];

for (const table of tables) {
  const { error } = await supabase.from(table).select('*', { head: true, count: 'exact' });
  if (error) {
    console.error(`Table check failed for ${table}:`, error.message);
    process.exit(1);
  }
  console.log(`ok: ${table}`);
}

const { data, error } = await supabase.rpc('get_app_metrics', { p_app_id: '00000000-0000-0000-0000-000000000000' });
if (error) {
  console.error('RPC get_app_metrics failed:', error.message);
  process.exit(1);
}
console.log('ok: get_app_metrics rpc');

console.log('Supabase schema verification passed');
