# AniMatch — Meta assets

## Files

- `favicon.svg` → place in `/public/favicon.svg`
- `og-image.svg` → convert to PNG, place in `/public/og-image.png`

---

## Converting og-image.svg to PNG

Social platforms require PNG, not SVG. Run this in your project root:

```bash
npx svgexport public/og-image.svg public/og-image.png 1200:630
```

If svgexport is not installed:

```bash
npm install -g svgexport
```

---

## Environment variable

Add this to Vercel under Settings → Environment Variables:

```
NEXT_PUBLIC_BASE_URL = https://your-actual-vercel-url.vercel.app
```

Update to your custom domain once you have one.

---

## Keywords to add to layout.tsx metadata

```typescript
keywords: [
  "anime recommendations",
  "anime finder",
  "what anime should I watch",
  "anime discovery",
  "anime suggestion",
  "find anime",
  "anime match",
];
```

---

## Checking your og-image is working

After deploying, paste your URL into:

- https://cards-dev.twitter.com/validator
- https://developers.facebook.com/tools/debug/
- https://www.opengraph.xyz

These tools show exactly what social platforms will display when your link is shared.
