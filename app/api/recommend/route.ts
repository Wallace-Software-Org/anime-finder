import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT, buildUserMessage } from '../../lib/prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface AnimeResult {
  title: string
  year: number
  episodes: number
  malId: number
  whyItFits: string
  hiddenGemNote: string
}

interface EnrichedAnime extends AnimeResult {
  malScore: number | null
  anilistScore: number | null
  anilistId: number | null
}

async function fetchMALScore(malId: number): Promise<number | null> {
  const clientId = process.env.MAL_CLIENT_ID
  if (!clientId) return null

  try {
    const res = await fetch(
      `https://api.myanimelist.net/v2/anime/${malId}?fields=mean`,
      { headers: { 'X-MAL-Client-ID': clientId } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return typeof data.mean === 'number' ? data.mean : null
  } catch {
    return null
  }
}

async function fetchAniListData(
  malId: number
): Promise<{ score: number | null; id: number | null }> {
  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query ($idMal: Int) {
            Media(idMal: $idMal, type: ANIME) {
              id
              averageScore
            }
          }
        `,
        variables: { idMal: malId },
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

async function enrichAnime(anime: AnimeResult): Promise<EnrichedAnime> {
  const [malScore, anilist] = await Promise.all([
    fetchMALScore(anime.malId),
    fetchAniListData(anime.malId),
  ])
  return {
    ...anime,
    malScore,
    anilistScore: anilist.score,
    anilistId: anilist.id,
  }
}

export async function POST(request: Request) {
  try {
    const { experience, mood, themes, commitment, reference, avoid } =
      await request.json()

    const userMessage = buildUserMessage({
      experience,
      mood,
      themes,
      commitment,
      reference,
      avoid,
    })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userMessage }],
    })

    const block = message.content[0]
    if (block.type !== 'text') {
      return Response.json({ error: 'Unexpected model response' }, { status: 500 })
    }

    let animeList: AnimeResult[]
    try {
      let text = block.text.trim()
      const fenceMatch = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/)
      if (fenceMatch) text = fenceMatch[1].trim()
      animeList = JSON.parse(text)
    } catch {
      return Response.json({ error: 'Failed to parse model response' }, { status: 500 })
    }

    if (!Array.isArray(animeList) || animeList.length === 0) {
      return Response.json({ error: 'No recommendations returned' }, { status: 500 })
    }

    const enriched = await Promise.all(animeList.map(enrichAnime))

    return Response.json(enriched)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
