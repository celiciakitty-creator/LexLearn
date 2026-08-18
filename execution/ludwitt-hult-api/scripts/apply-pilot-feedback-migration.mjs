import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationPath = path.join(
  root,
  "supabase/migrations/002_pilot_feedback.sql"
);

function readPassword() {
  const passwordPath = path.join(root, ".supabase-db-password.local");
  if (!fs.existsSync(passwordPath)) {
    console.error(
      "Missing .supabase-db-password.local — run Supabase db push manually or add the database password file."
    );
    process.exit(1);
  }
  return fs.readFileSync(passwordPath, "utf8").trim();
}

function projectRefFromEnv() {
  const url = process.env.SUPABASE_URL?.trim();
  if (!url) {
    console.error("Missing SUPABASE_URL in .env");
    process.exit(1);
  }
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) {
    console.error("Could not parse project ref from SUPABASE_URL");
    process.exit(1);
  }
  return match[1];
}

function loadEnv() {
  for (const file of [".env", ".env.production.local"]) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;
    for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (!process.env[key]) {
        process.env[key] = trimmed.slice(eq + 1).trim();
      }
    }
  }
}

loadEnv();

const projectRef = projectRefFromEnv();
const password = readPassword();
const sql = fs.readFileSync(migrationPath, "utf8");

const client = new pg.Client({
  host: "aws-0-us-west-2.pooler.supabase.com",
  port: 6543,
  user: `postgres.${projectRef}`,
  password,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log("Applied migration: 002_pilot_feedback.sql");
} catch (error) {
  console.error(
    "Migration apply failed:",
    error instanceof Error ? error.message : "unknown"
  );
  process.exit(1);
} finally {
  await client.end();
}
