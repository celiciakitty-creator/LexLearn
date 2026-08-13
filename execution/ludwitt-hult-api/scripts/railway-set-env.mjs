import fs from 'fs';
import { spawnSync } from 'child_process';
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

const local = loadEnvFile('.env');
const prodSecretsPath = '.env.production.local';
let prod = loadEnvFile(prodSecretsPath);

const requiredFromLocal = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
for (const key of requiredFromLocal) {
  if (!prod[key] && local[key]) prod[key] = local[key];
}

if (!prod.HULT_DEV_API_KEY) prod.HULT_DEV_API_KEY = strongKey();
if (!prod.ADMIN_KEY) prod.ADMIN_KEY = strongKey();
prod.HULT_DEVELOPER_HANDLE = 'celiciakitty-creator';
prod.NODE_ENV = 'production';

const lines = [
  '# Generated for Railway production — gitignored',
  `SUPABASE_URL=${prod.SUPABASE_URL ?? ''}`,
  `SUPABASE_SERVICE_ROLE_KEY=${prod.SUPABASE_SERVICE_ROLE_KEY ?? ''}`,
  `HULT_DEV_API_KEY=${prod.HULT_DEV_API_KEY}`,
  `HULT_DEVELOPER_HANDLE=${prod.HULT_DEVELOPER_HANDLE}`,
  `ADMIN_KEY=${prod.ADMIN_KEY}`,
  `NODE_ENV=${prod.NODE_ENV}`,
];
fs.writeFileSync(prodSecretsPath, `${lines.join('\n')}\n`);

const railwayBin = process.platform === 'win32' ? 'node_modules\\.bin\\railway.cmd' : 'node_modules/.bin/railway';
const setVar = (name, value) => {
  const result = spawnSync(railwayBin, ['variables', 'set', `${name}=${value}`], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

for (const [name, value] of Object.entries(prod)) {
  if (!value) {
    console.error(`Missing value for ${name}`);
    process.exit(1);
  }
  setVar(name, value);
}

console.log(`Wrote ${prodSecretsPath} and pushed Railway variables (names only in logs).`);
for (const name of Object.keys(prod)) {
  console.log(`  set ${name}`);
}
