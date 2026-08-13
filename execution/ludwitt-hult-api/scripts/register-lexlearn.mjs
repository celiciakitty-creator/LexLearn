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

const baseUrl = process.argv[2]?.replace(/\/$/, '');
if (!baseUrl) {
  console.error('Usage: node scripts/register-lexlearn.mjs <public-api-base-url>');
  process.exit(1);
}

const description =
  'LexLearn is a beginner-friendly UK law learning platform that teaches Civil Law, Criminal Law and Everyday Law through bite-sized lessons, real-world scenarios, quizzes, Legal Bites, Case Spotlights and progress-based learning.';

const payload = {
  title: 'LexLearn',
  description,
  topic: 'UK Law',
  launch_url: 'https://lex-learn-ten.vercel.app/',
  repo_url: 'https://github.com/celiciakitty-creator/LexLearn',
};

const reg = await fetch(`${baseUrl}/v1/developer/apps`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${prod.HULT_DEV_API_KEY}`,
  },
  body: JSON.stringify(payload),
});

const regBody = await reg.json();
if (!reg.ok) {
  console.error('Registration failed:', reg.status, regBody);
  process.exit(1);
}

const { app_id, api_key, jwt_secret } = regBody;
const credsPath = '.lexlearn-registration.local.json';
fs.writeFileSync(
  credsPath,
  JSON.stringify({ app_id, api_key, jwt_secret, registered_at: new Date().toISOString() }, null, 2)
);

console.log(`Registration succeeded. app_id=${app_id}`);
console.log(`Saved credentials to ${credsPath} (gitignored)`);

const metrics = await fetch(`${baseUrl}/v1/apps/${app_id}/metrics`, {
  headers: { Authorization: `Bearer ${prod.HULT_DEV_API_KEY}` },
});
const metricsBody = await metrics.json();
console.log('Initial metrics:', JSON.stringify(metricsBody));
