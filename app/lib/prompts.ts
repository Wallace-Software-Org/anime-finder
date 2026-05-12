import type {
  CommitmentValue,
  EraValue,
  ExperienceLevel,
  MoodValue,
  ThemeValue,
} from "./types";

export const EXPERIENCE_MAP: Record<ExperienceLevel, string> = {
  beginner: "mainstream shows are fine, include popular well-known titles",
  casual:
    "mix of popular and lesser known, avoid the most obscure titles, under 2 million MAL members",
  seasoned: "avoid mainstream hits, under 500k MAL members only",
  veteran:
    "extremely obscure only, under 50k MAL members, shows most anime fans have never heard of",
};

export const SYSTEM_PROMPT = `You are an anime recommendation expert. Your task is to return exactly 5 anime recommendations based on the user's preferences and experience level.

Rules:
- Respect the MAL member count ceiling specified by the experience level instruction — this is the most important constraint
- Never recommend shows that violate the member count ceiling
- Prefer works that genuinely match the taste profile over well-known defaults
- All 5 recommendations must be completely different titles — never repeat a show within the same response
- Return ONLY valid NDJSON — one complete JSON object per line, no markdown fences, no explanation, no preamble, no trailing text
- Output exactly 5 lines, each a self-contained JSON object

Each object must have these exact fields:
- "title": string — the most common English title
- "year": number — year the show first aired
- "episodes": number — total episode count (use 0 if unknown or ongoing)
- "whyItFits": string — 2-3 sentences explaining why this matches the taste profile
- "hiddenGemNote": string — 1-2 sentences on why it is underrated or overlooked`;

export function buildUserMessage({
  experience,
  mood,
  themes,
  commitment,
  era,
  exclude,
}: {
  experience: ExperienceLevel | "";
  mood: MoodValue[];
  themes: ThemeValue[];
  commitment: CommitmentValue | "";
  era: EraValue[];
  exclude: string[];
}): string {
  const experienceInstruction =
    (experience ? EXPERIENCE_MAP[experience] : undefined) ??
    EXPERIENCE_MAP.seasoned;

  const parts: string[] = [
    `Find me 5 anime recommendations with these preferences:`,
    `- Experience level instruction: ${experienceInstruction}`,
    `- Mood: ${mood.join(", ")}`,
  ];

  if (themes.length > 0) {
    parts.push(`- Core themes: ${themes.join(", ")}`);
  }

  if (exclude.length > 0) {
    parts.push(`- Do not recommend any of these titles: ${exclude.join(", ")}`);
  }

  parts.push(
    ``,
    `HARD CONSTRAINT — EPISODES: Verify the episode count before recommending any show. Apply exactly one rule based on the selected commitment, with zero exceptions:`,
    `- short: recommend only shows with 26 episodes or fewer`,
    `- long: recommend only shows with 27 episodes or more`,
    `- any: no episode restriction`,
    `Selected commitment: ${commitment} — apply only the ${commitment} rule above.`,
    `A show outside this episode range is disqualified regardless of how well it matches other criteria. Violating this constraint makes the entire response wrong.`,
  );

  const eraConstraint =
    !era.includes("any") && era.length > 0
      ? era.join(", ")
      : "any (no restriction)";

  parts.push(
    ``,
    `HARD CONSTRAINT — ERA: You must verify the air date before recommending any show. Apply these exact year rules with zero exceptions:`,
    `- Before 1990: must have started airing before 1990`,
    `- 1990s: must have started airing between 1990 and 1999`,
    `- 2000s: must have started airing between 2000 and 2009`,
    `- 2010s: must have started airing between 2010 and 2019`,
    `- 2020s: must have started airing between 2020 and 2029`,
    `- any: no restriction`,
    `If a show does not meet the selected era it is disqualified regardless of how well it matches other criteria. Multiple eras can be selected — the show must fall within at least one of them.`,
    `Selected era: ${eraConstraint}`,
  );

  return parts.join("\n");
}
