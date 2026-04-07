type ToneContourSvgProps = {
  activeTone: number;
};

const toneContours = [
  { tone: 1, label: '55', path: 'M42 40 L162 40' },
  { tone: 2, label: '25', path: 'M42 118 L162 52' },
  { tone: 3, label: '33', path: 'M42 92 L162 92' },
  { tone: 4, label: '21', path: 'M42 138 L162 182' },
  { tone: 5, label: '23', path: 'M42 146 L162 108' },
  { tone: 6, label: '22', path: 'M42 138 L162 138' },
] as const;

export function ToneContourSvg({ activeTone }: ToneContourSvgProps) {
  return (
    <svg
      className="tone-diagram"
      viewBox="0 0 204 224"
      role="img"
      aria-label={`粵語第 ${activeTone} 聲調值圖`}
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
                ? 'tone-diagram__path tone-diagram__path--active'
                : 'tone-diagram__path'
            }
          />
          <text
            x="188"
            y={contour.tone === 1 ? 44 : contour.tone === 2 ? 58 : contour.tone === 3 ? 96 : contour.tone === 4 ? 186 : contour.tone === 5 ? 112 : 142}
            className={contour.tone === activeTone ? 'tone-diagram__label tone-diagram__label--active' : 'tone-diagram__label'}
          >
            {contour.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
