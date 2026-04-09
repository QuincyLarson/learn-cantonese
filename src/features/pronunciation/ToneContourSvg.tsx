type ToneContourSvgProps = {
  activeTone: number;
  compact?: boolean;
  animate?: boolean;
  animationDelayMs?: number;
  animationDurationMs?: number;
  className?: string;
  ariaLabel?: string;
};

const toneContours = [
  { tone: 1, path: 'M42 40 L162 40' },
  { tone: 2, path: 'M42 118 L162 52' },
  { tone: 3, path: 'M42 92 L162 92' },
  { tone: 4, path: 'M42 138 L162 188' },
  { tone: 5, path: 'M42 146 L162 108' },
  { tone: 6, path: 'M42 138 L162 138' },
] as const;

export function ToneContourSvg({
  activeTone,
  compact = false,
  animate = false,
  animationDelayMs = 0,
  animationDurationMs = 720,
  className,
  ariaLabel,
}: ToneContourSvgProps) {
  return (
    <svg
      className={[
        'tone-diagram',
        compact ? 'tone-diagram--compact' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      viewBox="0 0 204 224"
      role="img"
      aria-label={ariaLabel ?? `粵語第 ${activeTone} 聲走勢圖`}
    >
      <rect x="28" y="24" width="148" height="156" className="tone-diagram__frame" />
      <line x1="28" y1="76" x2="176" y2="76" className="tone-diagram__guide" />
      <line x1="28" y1="128" x2="176" y2="128" className="tone-diagram__guide" />

      {toneContours.map((contour) => (
        <g key={contour.tone}>
          <path
            d={contour.path}
            className={
              contour.tone === activeTone
                ? animate
                  ? 'tone-diagram__path tone-diagram__path--active tone-diagram__path--animate'
                  : 'tone-diagram__path tone-diagram__path--active'
                : 'tone-diagram__path'
            }
            style={
              animate && contour.tone === activeTone
                ? {
                    animationDelay: `${animationDelayMs}ms`,
                    animationDuration: `${animationDurationMs}ms`,
                  }
                : undefined
            }
          />
        </g>
      ))}
    </svg>
  );
}
