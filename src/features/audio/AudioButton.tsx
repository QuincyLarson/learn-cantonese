import { useEffect, useRef, useState } from 'react';
import type { AudioAsset } from '@/content';
import { useSettingsState } from '@/features/progress';
import { getAudioSource } from '@/features/audio/audio';

type AudioButtonProps = {
  asset?: AudioAsset;
  label?: string;
  compact?: boolean;
  onPlay?: () => void;
  onEnded?: () => void;
  loop?: boolean;
};

export function AudioButton({
  asset,
  label,
  compact = false,
  onPlay,
  onEnded,
  loop = false,
}: AudioButtonProps) {
  const { playbackSpeed } = useSettingsState();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<'idle' | 'playing' | 'error'>('idle');

  useEffect(() => {
    const current = audioRef.current;
    return () => {
      current?.pause();
    };
  }, []);

  if (!asset) {
    return (
      <span className={compact ? 'audio-pill audio-pill--missing' : 'audio-button audio-button--missing'}>
        音訊未附上
      </span>
    );
  }

  const playbackLabel = label ?? `播放 ${asset.label}`;

  const handlePlay = async () => {
    onPlay?.();

    if (audioRef.current && state === 'playing') {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState('idle');
      return;
    }

    const audio = new Audio(getAudioSource(asset, playbackSpeed));
    audio.preload = 'auto';
    audio.playbackRate = 1;
    audio.loop = loop;
    audioRef.current = audio;
    setState('playing');

    audio.addEventListener('ended', () => {
      setState('idle');
      onEnded?.();
    });

    audio.addEventListener('error', () => {
      setState('error');
    });

    try {
      await audio.play();
    } catch {
      setState('error');
    }
  };

  return (
    <button
      type="button"
      className={compact ? 'audio-pill' : 'audio-button'}
      onClick={handlePlay}
      aria-label={playbackLabel}
    >
      <span>{state === 'playing' ? '停止' : compact ? '聽音' : playbackLabel}</span>
      <span className="audio-button__meta">{playbackSpeed}x</span>
      {state === 'error' ? <span className="audio-button__error">缺少音檔</span> : null}
    </button>
  );
}
