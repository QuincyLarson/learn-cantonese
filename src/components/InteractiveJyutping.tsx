import { Fragment, useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getSpeechRate, speakText } from '@/features/audio/audio';
import { findGlossaryEntryByJyutping } from '@/features/learn/data';
import type { PlaybackSpeed } from '@/features/progress';
import { useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';
import { ToneContourSvg } from '@/features/pronunciation/ToneContourSvg';

type InteractiveJyutpingProps = {
  jyutping: string;
  speechText?: string;
  className?: string;
};

type JyutpingAwareTextProps = {
  text: string;
  className?: string;
  resolveSpeechText?: (jyutping: string) => string | undefined;
};

type ParsedSyllable = {
  token: string;
  tone: number;
};

const JYUTPING_TOKEN_PATTERN = /^[a-z]+[1-6]$/i;
const JYUTPING_PHRASE_PATTERN = /[a-z]+[1-6](?:\s+[a-z]+[1-6])*/gi;

function parseSyllables(jyutping: string): ParsedSyllable[] {
  return jyutping
    .trim()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => JYUTPING_TOKEN_PATTERN.test(token))
    .map((token) => ({
      token,
      tone: Number(token[token.length - 1]),
    }));
}

function getSequenceStepMs(speed: PlaybackSpeed): number {
  return Math.max(320, Math.round(450 / getSpeechRate(speed)));
}

export function InteractiveJyutping({
  jyutping,
  speechText,
  className,
}: InteractiveJyutpingProps) {
  const { scriptPreference, playbackSpeed } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [animationSeed, setAnimationSeed] = useState(0);
  const panelId = useId();
  const syllables = useMemo(() => parseSyllables(jyutping), [jyutping]);
  const resolvedSpeechText = useMemo(
    () => speechText ?? findGlossaryEntryByJyutping(jyutping)?.headword,
    [jyutping, speechText],
  );
  const sequenceStepMs = getSequenceStepMs(playbackSpeed);

  if (syllables.length === 0) {
    return <span className={className}>{jyutping}</span>;
  }

  function preview(openPanel = true) {
    if (openPanel) {
      setOpen(true);
    }

    setAnimationSeed((current) => current + 1);

    if (resolvedSpeechText) {
      speakText(resolvedSpeechText, playbackSpeed, { rateMultiplier: 0.9 });
    }
  }

  return (
    <span
      className={['interactive-jyutping', className ?? ''].filter(Boolean).join(' ')}
      onMouseEnter={() => {
        setOpen(true);
        preview(false);
      }}
      onMouseLeave={() => {
        if (!pinned) {
          setOpen(false);
        }
      }}
      onFocus={() => {
        setOpen(true);
        preview(false);
      }}
      onBlur={(event) => {
        if (!pinned && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        className="interactive-jyutping__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (pinned) {
            setPinned(false);
            setOpen(false);
            return;
          }

          setPinned(true);
          setOpen(true);
          preview(false);
        }}
      >
        {jyutping}
      </button>

      {open ? (
        <span id={panelId} className="interactive-jyutping__popover" role="dialog" aria-label={text(`${jyutping} 粵拼預覽`)}>
          <span className="interactive-jyutping__head">
            <strong>{jyutping}</strong>
            <button
              type="button"
              className="interactive-jyutping__replay"
              onClick={() => preview(false)}
            >
              {text('播放')}
            </button>
          </span>
          <span className="interactive-jyutping__tones">
            {syllables.map((syllable, index) => (
              <span key={`${syllable.token}-${animationSeed}`} className="interactive-jyutping__syllable">
                <span className="interactive-jyutping__syllable-token">{syllable.token}</span>
                <ToneContourSvg
                  activeTone={syllable.tone}
                  compact
                  animate
                  animationDelayMs={index * sequenceStepMs}
                  animationDurationMs={620}
                  ariaLabel={text(`${syllable.token} 聲走勢圖`)}
                />
              </span>
            ))}
          </span>
        </span>
      ) : null}
    </span>
  );
}

export function JyutpingAwareText({
  text,
  className,
  resolveSpeechText,
}: JyutpingAwareTextProps) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(JYUTPING_PHRASE_PATTERN)) {
    const index = match.index ?? 0;
    const value = match[0];

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    nodes.push(
      <InteractiveJyutping
        key={`${value}-${index}`}
        jyutping={value}
        speechText={resolveSpeechText?.(value)}
      />,
    );

    lastIndex = index + value.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  if (nodes.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {nodes.map((node, index) => (
        <Fragment key={`jyutping-fragment-${index}`}>{node}</Fragment>
      ))}
    </span>
  );
}
