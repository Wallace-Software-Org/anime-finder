import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserMessage } from "../../lib/prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AnimeResult {
  title: string;
  year: number;
  episodes: number;
  whyItFits: string;
  hiddenGemNote: string;
}

interface EnrichedAnime extends AnimeResult {
  malId: number | null;
  malScore: number | null;
  anilistScore: number | null;
  anilistId: number | null;
}

async function fetchMALData(
  title: string,
): Promise<{ score: number | null; id: number | null }> {
  const clientId = process.env.MAL_CLIENT_ID;
  if (!clientId) return { score: null, id: null };

  try {
    const res = await fetch(
      `https://api.myanimelist.net/v2/anime?q=${encodeURIComponent(title)}&limit=1&fields=mean`,
      { headers: { "X-MAL-Client-ID": clientId } },
    );
    if (!res.ok) return { score: null, id: null };
    const data = await res.json();
    const node = data?.data?.[0]?.node;
    if (!node) return { score: null, id: null };
    return {
      score: typeof node.mean === "number" ? node.mean : null,
      id: typeof node.id === "number" ? node.id : null,
    };
  } catch {
    return { score: null, id: null };
  }
}

async function fetchAniListData(
  title: string,
): Promise<{ score: number | null; id: number | null }> {
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query ($search: String) {
            Media(search: $search, type: ANIME) {
              id
              averageScore
            }
          }
        `,
        variables: { search: title },
      }),
    });
    if (!res.ok) return { score: null, id: null };
    const data = await res.json();
    const media = data?.data?.Media;
    if (!media) return { score: null, id: null };
    return {
      score: typeof media.averageScore === "number" ? media.averageScore : null,
      id: typeof media.id === "number" ? media.id : null,
    };
  } catch {
    return { score: null, id: null };
  }
}

async function enrichAnime(anime: AnimeResult): Promise<EnrichedAnime> {
  const [mal, anilist] = await Promise.all([
    fetchMALData(anime.title),
    fetchAniListData(anime.title),
  ]);
  return {
    ...anime,
    malId: mal.id,
    malScore: mal.score,
    anilistScore: anilist.score,
    anilistId: anilist.id,
  };
}

export async function POST(request: Request) {
  try {
    const {
      experience,
      mood,
      themes,
      commitment,
      era = ["any"],
      exclude = [],
    } = await request.json();

    if (!Array.isArray(mood) || mood.length === 0) {
      return Response.json(
        { error: "mood is required" },
        { status: 400 },
      );
    }

    const userMessage = buildUserMessage({
      experience,
      mood,
      themes,
      commitment,
      era,
      exclude,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const anthropicStream = anthropic.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 2048,
            temperature: 1,
            system: [
              {
                type: "text",
                text: SYSTEM_PROMPT,
                cache_control: { type: "ephemeral" },
              },
            ],
            messages: [{ role: "user", content: userMessage }],
          });

          let buffer = "";

          for await (const event of anthropicStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              buffer += event.delta.text;
              const newlineIdx = buffer.lastIndexOf("\n");
              if (newlineIdx !== -1) {
                const completeText = buffer.slice(0, newlineIdx);
                buffer = buffer.slice(newlineIdx + 1);
                for (const line of completeText.split("\n")) {
                  const trimmed = line.trim();
                  if (!trimmed) continue;
                  try {
                    const anime = JSON.parse(trimmed) as AnimeResult;
                    const enriched = await enrichAnime(anime);
                    controller.enqueue(
                      encoder.encode(JSON.stringify(enriched) + "\n"),
                    );
                  } catch {
                    // skip malformed lines
                  }
                }
              }
            }
          }

          // flush any remaining buffered line
          const remaining = buffer.trim();
          if (remaining) {
            try {
              const anime = JSON.parse(remaining) as AnimeResult;
              const enriched = await enrichAnime(anime);
              controller.enqueue(
                encoder.encode(JSON.stringify(enriched) + "\n"),
              );
            } catch {
              // ignore
            }
          }

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson" },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
