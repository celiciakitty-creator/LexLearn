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
  markSurveyCompleted,
  PILOT_JOURNEY_CHANGE_EVENT,
} from "@/lib/pilot/journey-storage";
import {
  PROGRESS_CHANGE_EVENT,
  PROGRESS_STORAGE_KEY,
  parseProgress,
} from "@/lib/progress/storage";

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

function getSnapshot(): CourseProgress {
  if (typeof window === "undefined") {
    return { modules: {} };
  }
  return parseProgress(window.localStorage.getItem(PROGRESS_STORAGE_KEY));
}

function getServerSnapshot(): CourseProgress {
  return { modules: {} };
}

export function usePilotJourney() {
  const progress = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const steps = computePilotJourneySteps(progress);
  const surveyComplete = isSurveyCompleted();
  const learnComplete = hasMeaningfulPilotActivity(progress);
  const feedbackComplete = isFeedbackCompleted();
  const feedbackPromptDismissed = isFeedbackPromptDismissed();
  const showFeedbackPrompt =
    learnComplete && !feedbackComplete && !feedbackPromptDismissed;

  const completeSurvey = useCallback(() => {
    markSurveyCompleted();
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
    progress,
    steps,
    surveyComplete,
    learnComplete,
    feedbackComplete,
    showFeedbackPrompt,
    completeSurvey,
    dismissPrompt,
    completeFeedback,
    recordQuizAttempt,
  };
}

export type { PilotJourneySteps };
