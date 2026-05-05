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

function randomIndex(exclude: number) {
  let next: number;
  do {
    next = Math.floor(Math.random() * PHRASES.length);
  } while (next === exclude && PHRASES.length > 1);
  return next;
}

export default function LoadingScreen() {
  const [index, setIndex] = useState(() => randomIndex(-1));

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => randomIndex(i)), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col mb-20 items-center justify-center flex-1 gap-4 animate-fade-up">
      <p
        key={index}
        className="animate-fade-up text-center"
        style={{ fontSize: "20px", fontWeight: 500, color: "#f0f0f0" }}
      >
        {PHRASES[index]}
      </p>
    </div>
  );
}
