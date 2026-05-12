import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// Must be declared before importing the route so vi.mock hoisting works correctly.
vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = {
      stream: () => ({
        [Symbol.asyncIterator]: async function* () {
          yield {
            type: "content_block_delta",
            delta: {
              type: "text_delta",
              text:
                JSON.stringify({
                  title: "Planetes",
                  year: 2003,
                  episodes: 26,
                  whyItFits: "A grounded story about astronauts.",
                  hiddenGemNote: "Criminally underseen.",
                }) + "\n",
            },
          };
          yield {
            type: "content_block_delta",
            delta: {
              type: "text_delta",
              text:
                JSON.stringify({
                  title: "Tatami Galaxy",
                  year: 2010,
                  episodes: 11,
                  whyItFits: "A student relives the same year.",
                  hiddenGemNote: "Only 11 episodes.",
                }) + "\n",
            },
          };
        },
      }),
    };
  },
}));

import { POST } from "@/app/api/recommend/route";

const server = setupServer(
  http.get("https://api.myanimelist.net/*", () =>
    HttpResponse.json({ data: [{ node: { id: 6, mean: 8.2 } }] }),
  ),
  http.post("https://graphql.anilist.co", () =>
    HttpResponse.json({ data: { Media: { id: 6, averageScore: 79 } } }),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const validBody = {
  experience: "seasoned",
  mood: ["intense"],
  themes: ["power-and-ambition"],
  commitment: "short",
  era: ["any"],
  exclude: [],
};

async function drainStream(res: Response): Promise<void> {
  if (!res.body) return;
  const reader = res.body.getReader();
  while (!(await reader.read()).done) {
    /* drain */
  }
}

describe("POST /api/recommend", () => {
  it("returns 400 when mood is missing", async () => {
    const req = new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify({ ...validBody, mood: undefined }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 200 when themes is empty", async () => {
    const req = new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify({ ...validBody, themes: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    await drainStream(res);
  });

  it("returns a streaming response with correct content type", async () => {
    const req = new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify(validBody),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.headers.get("Content-Type")).toContain("application/x-ndjson");
    await drainStream(res);
  });

  it("handles MAL API failure gracefully", async () => {
    server.use(
      http.get("https://api.myanimelist.net/*", () => HttpResponse.error()),
    );
    const req = new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify(validBody),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    await drainStream(res);
  });
});
