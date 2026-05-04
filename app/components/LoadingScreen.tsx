"use client";

import { useState, useEffect } from "react";

const PHRASES = [
  "Finding your hidden gems...",
  "Digging through the archives...",
  "Avoiding the obvious picks...",
  "Searching the corners of anime history...",
  "Skipping the mainstream...",
  "Cross-referencing your taste...",
  "Consulting the deep catalogue...",
  "Ignoring Attack on Titan...",
  "Filtering out the normie picks...",
  "Matching your vibe to the vault...",
  "Your next obsession is loading...",
  "Almost got them...",
];

export default function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % PHRASES.length),
      3000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col mb-20 items-center justify-center flex-1 gap-4 animate-fade-up">
      {/* <div className="w-5 h-5 rounded-full border-2 border-accent/20 border-t-accent animate-spin" /> */}

      <p
        key={index}
        className="animate-fade-up text-center"
        style={{ fontSize: "20px", fontWeight: 500, color: "#f0f0f0" }}
      >
        {PHRASES[index]}
      </p>

      {/* <p
        className="text-center"
        style={{ fontSize: "13px", color: "#444450" }}
      >
        This may take a moment
      </p> */}
    </div>
  );
}
