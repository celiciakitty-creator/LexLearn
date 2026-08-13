export type MetricsConfig = {
  baseUrl: string;
  appId: string;
  devApiKey: string;
};

function readTrimmed(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function getMetricsConfig(): MetricsConfig | null {
  const baseUrl = readTrimmed("HULT_METRICS_API_BASE_URL")?.replace(/\/$/, "");
  const appId = readTrimmed("HULT_METRICS_APP_ID");
  const devApiKey = readTrimmed("HULT_METRICS_DEV_API_KEY");

  if (!baseUrl || !appId || !devApiKey) {
    return null;
  }

  return { baseUrl, appId, devApiKey };
}

export function isMetricsConfigured(): boolean {
  return getMetricsConfig() !== null;
}
