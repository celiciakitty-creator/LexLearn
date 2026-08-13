import type { CourseProgress } from "@/lib/course/types";
import {
  hasAnyPilotEngagement,
  hasMeaningfulPilotActivity,
  isFeedbackCompleted,
  isSurveyCompleted,
} from "@/lib/pilot/journey-storage";

export type JourneyStepState = "not_started" | "current" | "complete";

export type PilotJourneySteps = {
  survey: JourneyStepState;
  learn: JourneyStepState;
  feedback: JourneyStepState;
};

export function computePilotJourneySteps(
  progress: CourseProgress
): PilotJourneySteps {
  const surveyComplete = isSurveyCompleted();
  const learnComplete = hasMeaningfulPilotActivity(progress);
  const feedbackComplete = isFeedbackCompleted();
  const hasEngagement = hasAnyPilotEngagement(progress);

  const survey: JourneyStepState = surveyComplete
    ? "complete"
    : !learnComplete && !hasEngagement
      ? "current"
      : "not_started";

  const learn: JourneyStepState = learnComplete
    ? "complete"
    : surveyComplete || hasEngagement
      ? "current"
      : "not_started";

  const feedback: JourneyStepState = feedbackComplete
    ? "complete"
    : learnComplete
      ? "current"
      : "not_started";

  return { survey, learn, feedback };
}
