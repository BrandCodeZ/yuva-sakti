export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Yuva Shakti Run"
      fill="none"
    >
      <rect width="48" height="48" rx="8" fill="#161816" />
      <path d="M8 32 L18 22 L26 28 L40 12" stroke="#F47B20" strokeWidth="4" strokeLinecap="square" />
      <path d="M29 12 H40 V23" stroke="#F47B20" strokeWidth="4" strokeLinecap="square" />
      <path d="M8 41 H40" stroke="#138808" strokeWidth="4" strokeLinecap="square" />
    </svg>
  );
}
