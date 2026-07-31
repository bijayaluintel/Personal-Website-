export function ArrowIcon({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <svg
      aria-hidden="true"
      className={direction === "down" ? "rotate-90" : ""}
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
    >
      <path d="M3 9h11M10 5l4 4-4 4" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}
