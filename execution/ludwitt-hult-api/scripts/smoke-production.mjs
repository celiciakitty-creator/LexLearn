const baseUrl = process.argv[2]?.replace(/\/$/, '');
if (!baseUrl) {
  console.error('Usage: node scripts/smoke-production.mjs <public-api-base-url>');
  process.exit(1);
}

const health = await fetch(`${baseUrl}/health`);
const healthBody = await health.json();
console.log('health status:', health.status);
console.log('health body:', JSON.stringify(healthBody));

if (!health.ok || !healthBody.ok) {
  process.exit(1);
}

console.log('Production smoke check passed (health only).');
