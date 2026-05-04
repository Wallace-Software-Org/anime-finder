import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT, buildUserMessage } from '../../lib/prompts'
import type { MALAnime } from '../../lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface AnimeResult {
  title: string
  year: number
  episodes: number
  whyItFits: string
  hiddenGemNote: string
}

interface EnrichedAnime extends AnimeResult {
  malId: number | null
  malScore: number | null
  anilistScore: number | null
  anilistId: number | null
}

interface EnrichedAnimeWithMeta extends EnrichedAnime {
  malEpisodes: number | null
  malMediaType: string | null
}

interface RejectedAnime {
  title: string
  realMediaType: string | null
  realEpisodes: number | null
}

async function fetchMALData(title: string): Promise<MALAnime> {
  const clientId = process.env.MAL_CLIENT_ID
  if (!clientId) return { score: null, id: null, episodes: null }

  try {
    const res = await fetch(
      `https://api.myanimelist.net/v2/anime?q=${encodeURIComponent(title)}&limit=1&fields=mean,num_episodes,media_type`,
      { headers: { 'X-MAL-Client-ID': clientId } }
    )
    if (!res.ok) return { score: null, id: null, episodes: null }
    const data = await res.json()
    const node = data?.data?.[0]?.node
    if (!node) return { score: null, id: null, episodes: null }
    return {
      score: typeof node.mean === 'number' ? node.mean : null,
      id: typeof node.id === 'number' ? node.id : null,
      episodes: typeof node.num_episodes === 'number' ? node.num_episodes : null,
      media_type: typeof node.media_type === 'string' ? node.media_type : undefined,
    }
  } catch {
    return { score: null, id: null, episodes: null }
  }
}

function validateCommitment(
  commitment: string,
  episodes: number | null,
  mediaType: string | null
): boolean {
  switch (commitment) {
    case 'movie':
      return mediaType === 'movie'
    case 'short':
      return mediaType === 'tv' && episodes !== null && episodes >= 12 && episodes <= 52
    case 'standard':
      return mediaType === 'tv' && episodes !== null && episodes >= 36 && episodes <= 130
    case 'any':
    default:
      return true
  }
}

async function fetchAniListData(
  title: string
): Promise<{ score: number | null; id: number | null }> {
  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    })
    if (!res.ok) return { score: null, id: null }
    const data = await res.json()
    const media = data?.data?.Media
    if (!media) return { score: null, id: null }
    return {
      score: typeof media.averageScore === 'number' ? media.averageScore : null,
      id: typeof media.id === 'number' ? media.id : null,
    }
  } catch {
    return { score: null, id: null }
  }
}

async function enrichAnime(anime: AnimeResult): Promise<EnrichedAnimeWithMeta> {
  const [mal, anilist] = await Promise.all([
    fetchMALData(anime.title),
    fetchAniListData(anime.title),
  ])
  return {
    ...anime,
    malId: mal.id,
    malScore: mal.score,
    malEpisodes: mal.episodes ?? null,
    malMediaType: mal.media_type ?? null,
    anilistScore: anilist.score,
    anilistId: anilist.id,
  }
}

async function* streamLines(
  params: Parameters<typeof anthropic.messages.stream>[0]
): AsyncGenerator<string> {
  const s = anthropic.messages.stream(params)
  let buffer = ''
  for await (const event of s) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      buffer += event.delta.text
      const newlineIdx = buffer.lastIndexOf('\n')
      if (newlineIdx !== -1) {
        const completeText = buffer.slice(0, newlineIdx)
        buffer = buffer.slice(newlineIdx + 1)
        for (const line of completeText.split('\n')) {
          const trimmed = line.trim()
          if (trimmed) yield trimmed
        }
      }
    }
  }
  const remaining = buffer.trim()
  if (remaining) yield remaining
}

export async function POST(request: Request) {
  try {
    const { experience, mood, themes, commitment, era = ['any'], exclude = [] } =
      await request.json()

    const userMessage = buildUserMessage({
      experience,
      mood,
      themes,
      commitment,
      era,
      exclude,
    })

    const encoder = new TextEncoder()
    const claudeParams = {
      model: 'claude-haiku-4-5-20251001' as const,
      max_tokens: 2048,
      system: [{ type: 'text' as const, text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' as const } }],
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const accepted: string[] = []
          const rejected: RejectedAnime[] = []

          for await (const line of streamLines({ ...claudeParams, messages: [{ role: 'user', content: userMessage }] })) {
            try {
              const anime = JSON.parse(line) as AnimeResult
              const enriched = await enrichAnime(anime)
              if (validateCommitment(commitment, enriched.malEpisodes, enriched.malMediaType)) {
                const { malEpisodes: _ep, malMediaType: _mt, ...clientAnime } = enriched
                controller.enqueue(encoder.encode(JSON.stringify(clientAnime) + '\n'))
                accepted.push(anime.title)
              } else {
                rejected.push({
                  title: anime.title,
                  realMediaType: enriched.malMediaType,
                  realEpisodes: enriched.malEpisodes,
                })
              }
            } catch {
              // skip malformed lines
            }
          }

          if (rejected.length > 0) {
            const retryMessage = [
              userMessage,
              ``,
              `CORRECTION: The following ${rejected.length} recommendation(s) were rejected because they do not match the selected commitment. Provide exactly ${rejected.length} replacement(s):`,
              ...rejected.map(r =>
                `- "${r.title}" rejected (actual media_type: ${r.realMediaType ?? 'unknown'}, actual episodes: ${r.realEpisodes ?? 'unknown'})`
              ),
              `Do not suggest these already-accepted titles: ${accepted.join(', ')}`,
              `Output exactly ${rejected.length} NDJSON lines.`,
            ].join('\n')

            for await (const line of streamLines({ ...claudeParams, messages: [{ role: 'user', content: retryMessage }] })) {
              try {
                const anime = JSON.parse(line) as AnimeResult
                const enriched = await enrichAnime(anime)
                if (validateCommitment(commitment, enriched.malEpisodes, enriched.malMediaType)) {
                  const { malEpisodes: _ep, malMediaType: _mt, ...clientAnime } = enriched
                  controller.enqueue(encoder.encode(JSON.stringify(clientAnime) + '\n'))
                }
              } catch {
                // skip malformed lines
              }
            }
          }

          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'application/x-ndjson' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
