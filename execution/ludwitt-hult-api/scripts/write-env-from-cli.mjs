import fs from 'fs';
import { spawnSync } from 'child_process';

const projectRef = 'kosfskxekvokrlgbzpui';
const result = spawnSync(
  'npx',
  ['supabase', 'projects', 'api-keys', '--project-ref', projectRef, '--reveal', '-o', 'json'],
  {
    encoding: 'utf8',
    env: { ...process.env, SUPABASE_TELEMETRY: 'disabled' },
    shell: true,
  }
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status ?? 1);
}

const keys = JSON.parse(result.stdout);
const serviceRole = keys.find((k) => k.name === 'service_role')?.api_key;
if (!serviceRole) {
  console.error('service_role key not found');
  process.exit(1);
}

const lines = [
  `SUPABASE_URL=https://${projectRef}.supabase.co`,
  `SUPABASE_SERVICE_ROLE_KEY=${serviceRole}`,
  'HULT_DEV_API_KEY=prod_key_demo',
  'HULT_DEVELOPER_HANDLE=student-demo',
  'ADMIN_KEY=dev-admin-key',
  'NODE_ENV=development',
  'PORT=4000',
];

fs.writeFileSync('.env', `${lines.join('\n')}\n`);
console.log('Wrote .env (gitignored) with SUPABASE_URL and server keys');
