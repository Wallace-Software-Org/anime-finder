# AniMatch — Meta tags for layout.tsx

Replace the existing metadata export in app/layout.tsx with this:

```typescript
export const metadata: Metadata = {
  title: "AniMatch — Find your next anime",
  description:
    "Answer four questions. Get five hidden gem anime recommendations matched to your exact taste. No obvious picks, no mainstream defaults.",
  keywords: [
    "anime recommendations",
    "anime finder",
    "hidden gem anime",
    "anime discovery",
    "what anime should I watch",
    "anime suggestion",
  ],
  openGraph: {
    title: "AniMatch — Find your next anime",
    description:
      "Answer four questions. Get five hidden gem anime recommendations matched to your exact taste.",
    url: "https://animatch.app",
    siteName: "AniMatch",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AniMatch — Find your next anime",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AniMatch — Find your next anime",
    description:
      "Answer four questions. Get five hidden gem anime recommendations matched to your exact taste.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  themeColor: "#0d0d0f",
};
```

## File placement

- og-image.svg → convert to og-image.png and place in /public/og-image.png
- favicon.svg → place in /public/favicon.svg (Next.js serves /public as root)

## Converting SVG to PNG for og-image

The og-image needs to be a PNG for broad social media support.
Options:

1. Open og-image.svg in a browser, screenshot at 1200x630, save as og-image.png
2. Use an online SVG to PNG converter like svgtopng.com
3. In Claude Code: `npx sharp-cli input=og-image.svg output=og-image.png width=1200 height=630`

## Update your domain

Replace https://animatch.app with your actual Vercel URL until you have a custom domain.
