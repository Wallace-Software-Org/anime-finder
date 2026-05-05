interface AniMatchLogoProps {
  size?: number;
}

export function AniMatchLogo({ size = 32 }: AniMatchLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="15" r="11" fill="none" stroke="#7c5cfc" strokeWidth="1.75" />
      <line x1="9" y1="11" x2="23" y2="11" stroke="#7c5cfc" strokeWidth="2.25" strokeLinecap="round" opacity="0.4" />
      <line x1="10" y1="16" x2="22" y2="16" stroke="#7c5cfc" strokeWidth="2.25" strokeLinecap="round" />
      <circle cx="16" cy="21.5" r="2.25" fill="#7c5cfc" />
    </svg>
  );
}
