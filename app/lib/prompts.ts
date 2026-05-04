export const EXPERIENCE_MAP: Record<string, string> = {
  beginner:
    "mainstream shows are fine, include popular well-known titles",
  casual:
    "mix of popular and lesser known, avoid the most obscure titles, under 2 million MAL members",
  seasoned:
    "avoid mainstream hits, under 500k MAL members only",
  deep:
    "hidden gems only, under 200k MAL members, nothing that appears on mainstream recommendation lists",
  veteran:
    "extremely obscure only, under 50k MAL members, shows most anime fans have never heard of",
};

export const SYSTEM_PROMPT = `You are an anime recommendation expert. Your task is to return exactly 5 anime recommendations based on the user's preferences and experience level.

Rules:
- Respect the MAL member count ceiling specified by the experience level instruction — this is the most important constraint
- Never recommend shows that violate the member count ceiling
- Prefer works that genuinely match the taste profile over well-known defaults
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
  experience: string;
  mood: string;
  themes: string[];
  commitment: string;
  era: string[];
  exclude: string[];
}): string {
  const experienceInstruction =
    EXPERIENCE_MAP[experience] ?? EXPERIENCE_MAP.seasoned;

  const parts: string[] = [
    `Find me 5 anime recommendations with these preferences:`,
    `- Experience level instruction: ${experienceInstruction}`,
    `- Mood: ${mood}`,
    `- Core themes: ${themes.join(", ")}`,
  ];

  if (exclude.length > 0) {
    parts.push(`- Do not recommend any of these titles: ${exclude.join(", ")}`);
  }

  parts.push(
    ``,
    `HARD CONSTRAINT — EPISODES: You must verify the episode count before recommending any show. Apply these exact numeric rules with zero exceptions:`,
    `- short: must be fewer than 15 episodes total`,
    `- standard: must be between 13 and 52 episodes total`,
    `- long: must be over 50 episodes total`,
    `- any: no restriction`,
    `If a show does not meet this exact episode range it is disqualified. Do not recommend it regardless of how well it matches other criteria.`,
    `Selected episode commitment: ${commitment}`,
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
