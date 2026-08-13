import fs from 'fs';
import { spawnSync } from 'child_process';

const prod = {};
for (const line of fs.readFileSync('.env.production.local', 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  prod[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
}

const vercelBin = process.platform === 'win32' ? 'npx vercel' : 'npx vercel';

for (const [name, value] of Object.entries(prod)) {
  if (!value) {
    console.error(`Missing value for ${name}`);
    process.exit(1);
  }
  const result = spawnSync(
    vercelBin,
    ['env', 'add', name, 'production', '--force', '--value', value, '--yes'],
    {
      shell: true,
      stdio: ['ignore', 'inherit', 'inherit'],
    }
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log(`set ${name} (production)`);
}

console.log('Vercel production environment variables updated.');
