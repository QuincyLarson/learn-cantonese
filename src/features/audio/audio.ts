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

export function primeSpeechVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.getVoices();
}

function getPreferredSpeechVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return undefined;
  }

  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => /^yue(?:[-_]|$)/i.test(voice.lang)) ??
    voices.find((voice) => /^zh-HK$/i.test(voice.lang)) ??
    voices.find((voice) => /^zh-TW$/i.test(voice.lang)) ??
    voices.find((voice) => /^zh-CN$/i.test(voice.lang)) ??
    voices.find((voice) => /^zh(?:[-_]|$)/i.test(voice.lang))
  );
}

export function getSpeechRate(speed: PlaybackSpeed): number {
  if (speed === 0.5) {
    return 0.6;
  }

  if (speed === 0.75) {
    return 0.8;
  }

  return 1;
}

export function stopSpeechPlayback(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
}

export function speakText(text: string, speed: PlaybackSpeed, options?: { rateMultiplier?: number }): boolean {
  const normalizedText = text.trim();
  if (!normalizedText || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  const synthesis = window.speechSynthesis;
  const voice = getPreferredSpeechVoice();
  const utterance = new SpeechSynthesisUtterance(normalizedText);
  utterance.lang = voice?.lang ?? 'zh-HK';
  utterance.rate = Math.max(0.45, getSpeechRate(speed) * (options?.rateMultiplier ?? 1));
  utterance.pitch = 1;
  utterance.volume = 1;

  if (voice) {
    utterance.voice = voice;
  }

  synthesis.resume();
  synthesis.cancel();
  synthesis.speak(utterance);
  return true;
}
