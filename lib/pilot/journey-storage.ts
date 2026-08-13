import type { CourseProgress } from "@/lib/course/types";

export const SURVEY_COMPLETED_KEY = "lexlearn-survey-completed-v1";
export const FEEDBACK_PROMPT_DISMISSED_KEY =
  "lexlearn-feedback-prompt-dismissed-v1";
export const FEEDBACK_COMPLETED_KEY = "lexlearn-feedback-completed-v1";
export const PILOT_QUIZ_ATTEMPTED_KEY = "lexlearn-pilot-quiz-attempted-v1";
export const PILOT_JOURNEY_CHANGE_EVENT = "lexlearn-pilot-journey-change";

function dispatchChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PILOT_JOURNEY_CHANGE_EVENT));
}

function readFlag(key: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) === "1";
}

function writeFlag(key: string, value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) {
    window.localStorage.setItem(key, "1");
  } else {
    window.localStorage.removeItem(key);
  }
  dispatchChange();
}

export function isSurveyCompleted(): boolean {
  return readFlag(SURVEY_COMPLETED_KEY);
}

export function markSurveyCompleted(): void {
  writeFlag(SURVEY_COMPLETED_KEY, true);
}

export function isFeedbackPromptDismissed(): boolean {
  return readFlag(FEEDBACK_PROMPT_DISMISSED_KEY);
}

export function dismissFeedbackPrompt(): void {
  writeFlag(FEEDBACK_PROMPT_DISMISSED_KEY, true);
}

export function isFeedbackCompleted(): boolean {
  return readFlag(FEEDBACK_COMPLETED_KEY);
}

export function markFeedbackCompleted(): void {
  writeFlag(FEEDBACK_COMPLETED_KEY, true);
  writeFlag(FEEDBACK_PROMPT_DISMISSED_KEY, true);
}

export function isPilotQuizAttempted(): boolean {
  return readFlag(PILOT_QUIZ_ATTEMPTED_KEY);
}

export function markPilotQuizAttempted(): void {
  writeFlag(PILOT_QUIZ_ATTEMPTED_KEY, true);
}

export function hasMeaningfulPilotActivity(progress: CourseProgress): boolean {
  if (isPilotQuizAttempted()) return true;

  return Object.values(progress.modules).some(
    (module) => module?.lessonCompleted || module?.quizCompleted
  );
}

export function hasAnyPilotEngagement(progress: CourseProgress): boolean {
  if (hasMeaningfulPilotActivity(progress)) return true;
  return Object.values(progress.modules).some((module) => module?.lastVisited);
}
