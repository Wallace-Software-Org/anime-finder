export type ExperienceLevel =
  | "beginner"
  | "casual"
  | "seasoned"
  | "deep"
  | "veteran";

export type Commitment = "short" | "standard" | "movie" | "any";

export interface QuizAnswers {
  experience: ExperienceLevel | "";
  mood: string;
  themes: string[];
  commitment: Commitment | "";
}

export interface MALAnime {
  score: number | null;
  id: number | null;
  episodes: number | null;
  media_type?: string;
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
