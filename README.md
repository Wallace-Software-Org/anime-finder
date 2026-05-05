# AniMatch

**Find your next anime.**

AniMatch is an AI-powered anime recommendation tool. Answer four questions about your experience level, mood, themes, and commitment — get five recommendations matched to your taste, powered by Claude and enriched with real data from MyAnimeList and AniList.

![AniMatch](public/og-image.png)

---

## Features

- **Experience-aware** — recommendations scale from mainstream entry points for beginners to deep cuts for veterans
- **Taste-matched** — mood, themes, and commitment length shape every result
- **Real data** — each recommendation is enriched with live MAL scores, AniList scores, episode counts, and direct links
- **Streaming results** — cards appear progressively as Claude generates them, no waiting for all five
- **Era filter** — refine results by decade on the results page without starting over
- **Find 5 more** — load additional recommendations without repeating what you've already seen
- **Loading screen** — animated full-screen loading state with rotating phrases while Claude generates results

---

## Stack

- **Framework** — Next.js 14 App Router
- **Language** — TypeScript
- **Styling** — Tailwind CSS
- **AI** — Anthropic Claude (`claude-sonnet-4-6`)
- **Anime data** — MyAnimeList API, AniList GraphQL API
- **Deployment** — Vercel

---

## Getting started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)
- A [MyAnimeList Client ID](https://myanimelist.net/apiconfig)

### Installation

```bash
git clone https://github.com/Wallace-Software-Org/anime-finder.git
cd anime-finder
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
MAL_CLIENT_ID=your_mal_client_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How it works

1. User completes a four-question quiz — experience level, mood, themes, commitment
2. Answers are posted to `/api/recommend`
3. Claude generates five recommendations as streaming NDJSON
4. Each result is enriched in parallel with real MAL and AniList data
5. Cards render progressively as they arrive — no full-page wait

The experience level question controls the MAL member count ceiling Claude targets, ranging from mainstream titles for beginners to shows with under 50k members for veterans.

---

## Project structure

```
├── app/
│   ├── api/recommend/route.ts   — Streaming API route
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AniMatchLogo.tsx         — Reusable logo mark
│   ├── BottomNavigation.tsx
│   ├── Header.tsx
│   ├── LandingScreen.tsx
│   ├── LoadingScreen.tsx        — Full-screen loading state with rotating phrases
│   ├── OptionPill.tsx
│   ├── ProgressBar.tsx
│   ├── QuizScreen.tsx
│   └── ResultsScreen.tsx
├── hooks/
│   └── useQuiz.ts               — Quiz state management
├── lib/
│   ├── options.ts               — Quiz option definitions
│   ├── prompts.ts               — Claude prompt builder
│   └── types.ts                 — Shared TypeScript types
└── public/
    ├── favicon.svg
    └── og-image.png
```

---

## Deployment

The project is configured for Vercel. Connect your GitHub repository and add the following environment variables in the Vercel dashboard:

```
ANTHROPIC_API_KEY
MAL_CLIENT_ID
NEXT_PUBLIC_BASE_URL
```

---

## License

MIT
