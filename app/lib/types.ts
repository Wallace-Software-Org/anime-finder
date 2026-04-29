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
