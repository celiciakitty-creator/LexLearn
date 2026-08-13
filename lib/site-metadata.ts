/** Public site metadata — safe to import from server and client modules. */

export const siteConfig = {
  name: "LexLearn",
  tagline: "Learn. Understand. Apply.",
  title: "LexLearn | Understand UK Law & Your Everyday Rights",
  description:
    "A simpler way to understand UK law and your everyday legal rights. Bite-sized lessons, quizzes and real-life examples for England and Wales — currently in early-access pilot testing.",
  keywords: [
    "UK law",
    "beginner law",
    "civil law",
    "criminal law",
    "everyday legal rights",
    "England and Wales",
    "legal education",
    "interactive learning",
    "LexLearn",
  ],
  author: "LexLearn",
  locale: "en_GB",
} as const;

export function getSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (value) {
    return value.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}
