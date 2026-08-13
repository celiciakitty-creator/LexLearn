import fs from 'fs';
import { randomBytes } from 'crypto';

function loadEnvFile(path) {
  const out = {};
  if (!fs.existsSync(path)) return out;
  for (const line of fs.readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

function strongKey(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

const prodSecretsPath = '.env.production.local';
const local = loadEnvFile('.env');
let prod = loadEnvFile(prodSecretsPath);

for (const key of ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  if (!prod[key] && local[key]) prod[key] = local[key];
}

if (!prod.HULT_DEV_API_KEY) prod.HULT_DEV_API_KEY = strongKey();
if (!prod.ADMIN_KEY) prod.ADMIN_KEY = strongKey();
prod.HULT_DEVELOPER_HANDLE = 'celiciakitty-creator';
prod.NODE_ENV = 'production';

const lines = [
  '# Production secrets — gitignored',
  `SUPABASE_URL=${prod.SUPABASE_URL ?? ''}`,
  `SUPABASE_SERVICE_ROLE_KEY=${prod.SUPABASE_SERVICE_ROLE_KEY ?? ''}`,
  `HULT_DEV_API_KEY=${prod.HULT_DEV_API_KEY}`,
  `HULT_DEVELOPER_HANDLE=${prod.HULT_DEVELOPER_HANDLE}`,
  `ADMIN_KEY=${prod.ADMIN_KEY}`,
  `NODE_ENV=${prod.NODE_ENV}`,
];

if (!prod.SUPABASE_URL || !prod.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (check .env)');
  process.exit(1);
}

fs.writeFileSync(prodSecretsPath, `${lines.join('\n')}\n`);
console.log(`Wrote ${prodSecretsPath}`);
for (const name of Object.keys(prod)) {
  console.log(`  ${name}`);
}
