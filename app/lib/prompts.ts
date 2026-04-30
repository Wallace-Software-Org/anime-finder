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
- Return ONLY valid JSON — no markdown fences, no explanation, no preamble, no trailing text
- The JSON must be an array of exactly 5 objects

Each object must have these exact fields:
- "title": string — the most common English title
- "year": number — year the show first aired
- "episodes": number — total episode count (use 0 if unknown or ongoing)
- "malId": number — the correct MyAnimeList anime ID (integer)
- "whyItFits": string — 2-3 sentences explaining why this matches the taste profile
- "hiddenGemNote": string — 1-2 sentences on why it is underrated or overlooked`;

export function buildUserMessage({
  experience,
  mood,
  themes,
  commitment,
  reference,
  avoid,
}: {
  experience: string;
  mood: string;
  themes: string[];
  commitment: string;
  reference: string;
  avoid: string[];
}): string {
  const experienceInstruction =
    EXPERIENCE_MAP[experience] ?? EXPERIENCE_MAP.seasoned;

  const parts: string[] = [
    `Find me 5 anime recommendations with these preferences:`,
    `- Experience level instruction: ${experienceInstruction}`,
    `- Mood: ${mood}`,
    `- Core themes: ${themes.join(", ")}`,
    `- Episode commitment: ${commitment}`,
  ];

  if (reference?.trim()) {
    parts.push(`- Reference show I love: ${reference.trim()}`);
  }
  if (avoid.length > 0) {
    parts.push(`- Things to avoid: ${avoid.join(", ")}`);
  }

  return parts.join("\n");
}
