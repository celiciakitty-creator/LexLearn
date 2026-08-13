/** Optional market-validation survey URL — hide UI when unset. */

export function getSurveyUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_LEXLEARN_SURVEY_URL?.trim();
  if (!value) {
    return undefined;
  }
  return value;
}

export function isSurveyConfigured(): boolean {
  return Boolean(getSurveyUrl());
}
