"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { CourseProgress } from "@/lib/course/types";
import {
  computePilotJourneySteps,
  type PilotJourneySteps,
} from "@/lib/pilot/journey-state";
import {
  dismissFeedbackPrompt,
  hasMeaningfulPilotActivity,
  isFeedbackCompleted,
  isFeedbackPromptDismissed,
  isSurveyCompleted,
  markFeedbackCompleted,
  markPilotQuizAttempted,
  PILOT_JOURNEY_CHANGE_EVENT,
  readPilotFlagsSignature,
  setSurveyCompleted,
} from "@/lib/pilot/journey-storage";
import {
  DEFAULT_PROGRESS,
  PROGRESS_CHANGE_EVENT,
  PROGRESS_STORAGE_KEY,
  parseProgress,
} from "@/lib/progress/storage";

export type PilotJourneySnapshot = {
  progress: CourseProgress;
  surveyComplete: boolean;
  learnComplete: boolean;
  feedbackComplete: boolean;
  feedbackPromptDismissed: boolean;
  showFeedbackPrompt: boolean;
  steps: PilotJourneySteps;
};

const SERVER_SNAPSHOT: PilotJourneySnapshot = {
  progress: DEFAULT_PROGRESS,
  surveyComplete: false,
  learnComplete: false,
  feedbackComplete: false,
  feedbackPromptDismissed: false,
  showFeedbackPrompt: false,
  steps: {
    survey: "current",
    learn: "not_started",
    feedback: "not_started",
  },
};

let cachedSignature = "";
let cachedSnapshot: PilotJourneySnapshot = SERVER_SNAPSHOT;
let cachedProgressRaw: string | null | undefined;
let cachedProgress: CourseProgress = DEFAULT_PROGRESS;

function getProgressFromRaw(raw: string | null): CourseProgress {
  if (raw === cachedProgressRaw) {
    return cachedProgress;
  }
  cachedProgressRaw = raw;
  cachedProgress = parseProgress(raw);
  return cachedProgress;
}

function buildSnapshot(progressRaw: string | null): PilotJourneySnapshot {
  const progress = getProgressFromRaw(progressRaw);
  const surveyComplete = isSurveyCompleted();
  const learnComplete = hasMeaningfulPilotActivity(progress);
  const feedbackComplete = isFeedbackCompleted();
  const feedbackPromptDismissed = isFeedbackPromptDismissed();
  const showFeedbackPrompt =
    learnComplete && !feedbackComplete && !feedbackPromptDismissed;

  return {
    progress,
    surveyComplete,
    learnComplete,
    feedbackComplete,
    feedbackPromptDismissed,
    showFeedbackPrompt,
    steps: computePilotJourneySteps(progress),
  };
}

function getClientSnapshot(): PilotJourneySnapshot {
  const progressRaw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
  const signature = `${progressRaw ?? ""}::${readPilotFlagsSignature()}`;

  if (signature === cachedSignature) {
    return cachedSnapshot;
  }

  cachedSignature = signature;
  cachedSnapshot = buildSnapshot(progressRaw);
  return cachedSnapshot;
}

function getServerSnapshot(): PilotJourneySnapshot {
  return SERVER_SNAPSHOT;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(PILOT_JOURNEY_CHANGE_EVENT, onStoreChange);
  window.addEventListener(PROGRESS_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(PILOT_JOURNEY_CHANGE_EVENT, onStoreChange);
    window.removeEventListener(PROGRESS_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function usePilotJourney() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const setSurveyComplete = useCallback((completed: boolean) => {
    setSurveyCompleted(completed);
  }, []);

  const dismissPrompt = useCallback(() => {
    dismissFeedbackPrompt();
  }, []);

  const completeFeedback = useCallback(() => {
    markFeedbackCompleted();
  }, []);

  const recordQuizAttempt = useCallback(() => {
    markPilotQuizAttempted();
  }, []);

  return {
    progress: snapshot.progress,
    steps: snapshot.steps,
    surveyComplete: snapshot.surveyComplete,
    learnComplete: snapshot.learnComplete,
    feedbackComplete: snapshot.feedbackComplete,
    showFeedbackPrompt: snapshot.showFeedbackPrompt,
    setSurveyComplete,
    dismissPrompt,
    completeFeedback,
    recordQuizAttempt,
  };
}

export type { PilotJourneySteps };
