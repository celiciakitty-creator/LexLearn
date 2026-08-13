import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function loadEnvFile(relativePath) {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    return;
  }
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const baseUrl = process.env.HULT_METRICS_API_BASE_URL?.trim().replace(/\/$/, "");
const appId = process.env.HULT_METRICS_APP_ID?.trim();
const devApiKey = process.env.HULT_METRICS_DEV_API_KEY?.trim();

if (!baseUrl || !appId || !devApiKey) {
  console.error(
    "Missing HULT_METRICS_API_BASE_URL, HULT_METRICS_APP_ID, or HULT_METRICS_DEV_API_KEY"
  );
  process.exit(1);
}

const url = `${baseUrl}/v1/apps/${appId}/metrics`;

try {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${devApiKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error(
        "Metrics request failed: 401 (invalid developer API key). Ensure HULT_METRICS_DEV_API_KEY in .env.local matches the rotated HULT_DEV_API_KEY in execution/ludwitt-hult-api/.env.production.local."
      );
    } else {
      console.error("Metrics request failed:", response.status);
    }
    process.exit(1);
  }

  const metrics = await response.json();
  console.log(
    JSON.stringify(
      {
        unique_users: metrics.unique_users,
        qualified_users: metrics.qualified_users,
      },
      null,
      2
    )
  );
} catch (error) {
  console.error(
    "Metrics request error:",
    error instanceof Error ? error.message : "unknown"
  );
  process.exit(1);
}
