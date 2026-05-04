export interface QuizOption<T extends string> {
  emoji: string;
  label: string;
  value: T;
}

export interface FilterChipOption<T extends string> {
  label: string;
  value: T;
}

export type ExperienceLevel =
  | "beginner"
  | "casual"
  | "seasoned"
  | "deep"
  | "veteran";

export type MoodValue = "intense" | "chill" | "dark" | "light" | "mind-bending";

export type ThemeValue =
  | "power-and-ambition"
  | "friendship-and-loyalty"
  | "psychological-games"
  | "world-building-and-lore"
  | "love-and-relationships"
  | "mystery-and-secrets"
  | "growth-and-becoming-someone";

export type QuizCommitmentValue = "short" | "long" | "no-preference";

export type ResultsCommitmentValue = "short" | "standard" | "movie" | "any";

export type CommitmentValue = QuizCommitmentValue | ResultsCommitmentValue;

export type EraValue =
  | "Before 1990"
  | "1990s"
  | "2000s"
  | "2010s"
  | "2020s"
  | "any";

export interface QuizAnswers {
  experience: ExperienceLevel | "";
  mood: MoodValue | "";
  themes: ThemeValue[];
  commitment: QuizCommitmentValue | "";
}

export interface Recommendation {
  title: string;
  year: number;
  episodes: number;
  malId: number | null;
  whyItFits: string;
  hiddenGemNote: string;
  malScore: number | null;
  anilistScore: number | null;
  anilistId: number | null;
}
