export type ExperienceLevel =
  | "beginner"
  | "casual"
  | "seasoned"
  | "deep"
  | "veteran";

export interface QuizAnswers {
  experience: ExperienceLevel | "";
  mood: string;
  themes: string[];
  commitment: string;
  reference: string;
  avoid: string[];
}

export interface Recommendation {
  title: string;
  year: number;
  episodes: number;
  malId: number;
  whyItFits: string;
  hiddenGemNote: string;
  malScore: number | null;
  anilistScore: number | null;
  anilistId: number | null;
}
