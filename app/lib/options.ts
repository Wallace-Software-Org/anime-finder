import type {
  ExperienceLevel,
  MoodValue,
  QuizCommitmentValue,
  QuizOption,
  ThemeValue,
} from "./types";

export const EXPERIENCE_OPTIONS: QuizOption<ExperienceLevel>[] = [
  { emoji: "🌱", label: "Just getting started", value: "beginner" },
  { emoji: "📺", label: "Watched a decent amount", value: "casual" },
  { emoji: "🎌", label: "Seen most of the classics", value: "seasoned" },
  { emoji: "🔍", label: "Pretty deep in the rabbit hole", value: "deep" },
  { emoji: "👁️", label: "Seen it all, go obscure", value: "veteran" },
];

export const MOOD_OPTIONS: QuizOption<MoodValue>[] = [
  { emoji: "🔥", label: "Intense, edge of my seat", value: "intense" },
  { emoji: "😮‍💨", label: "Chill, something to relax into", value: "chill" },
  { emoji: "💀", label: "Dark, don't spare my feelings", value: "dark" },
  { emoji: "😂", label: "Light, make me laugh or feel good", value: "light" },
  {
    emoji: "🤯",
    label: "Mind-bending, I want to think after",
    value: "mind-bending",
  },
];

export const THEME_OPTIONS: QuizOption<ThemeValue>[] = [
  { emoji: "🗡️", label: "Power and ambition", value: "power-and-ambition" },
  {
    emoji: "🤝",
    label: "Friendship and loyalty",
    value: "friendship-and-loyalty",
  },
  { emoji: "🧠", label: "Psychological games", value: "psychological-games" },
  {
    emoji: "🌍",
    label: "World-building and lore",
    value: "world-building-and-lore",
  },
  {
    emoji: "❤️",
    label: "Love and relationships",
    value: "love-and-relationships",
  },
  { emoji: "🔍", label: "Mystery and secrets", value: "mystery-and-secrets" },
  {
    emoji: "🌱",
    label: "Growth and becoming someone",
    value: "growth-and-becoming-someone",
  },
];

export const COMMITMENT_OPTIONS: QuizOption<QuizCommitmentValue>[] = [
  { emoji: "🎯", label: "Short, 1 to 2 seasons", value: "short" },
  { emoji: "🏔️", label: "Long, 3 seasons or more", value: "long" },
  { emoji: "✨", label: "No preference", value: "no-preference" },
];
