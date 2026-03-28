import type { PlaybackSpeed } from '@/features/progress';
import type { AudioAsset } from '@/content';

export type AudioPlaybackState = 'idle' | 'loading' | 'playing' | 'error';

export function getAudioVariantKey(speed: PlaybackSpeed): keyof AudioAsset['variants'] {
  if (speed === 0.5) {
    return '50';
  }

  if (speed === 0.75) {
    return '75';
  }

  return '100';
}

export function resolvePublicAssetPath(path: string): string {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${normalized}`;
}

export function getAudioSource(asset: AudioAsset, speed: PlaybackSpeed): string {
  return resolvePublicAssetPath(asset.variants[getAudioVariantKey(speed)]);
}

