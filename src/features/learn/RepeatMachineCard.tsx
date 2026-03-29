import { useEffect, useMemo, useRef, useState } from 'react';
import type { RepeatMachineStep } from '@/content';
import { AudioButton } from '@/features/audio/AudioButton';
import { useProgressState, toggleReviewLater } from '@/features/progress';
import { getAudioAsset } from '@/features/learn/data';
import { useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

type RepeatMachineCardProps = {
  lessonId: string;
  step: RepeatMachineStep;
  busy?: boolean;
  onContinue: () => void;
};

type RecordingState = 'idle' | 'recording' | 'recorded' | 'playing-back';

export function RepeatMachineCard({ lessonId, step, busy = false, onContinue }: RepeatMachineCardProps) {
  const { scriptPreference } = useSettingsState();
  const progress = useProgressState();
  const text = useScriptText(scriptPreference);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [loopEnabled, setLoopEnabled] = useState(Boolean(step.loopSuggested));
  const [error, setError] = useState<string | null>(null);
  const targetAudio = useMemo(() => getAudioAsset(step.targetAudioId), [step.targetAudioId]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const playbackRef = useRef<HTMLAudioElement | null>(null);
  const reviewLater = progress.reviewLaterIds.includes(lessonId);

  useEffect(() => {
    return () => {
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
      playbackRef.current?.pause();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [recordingUrl]);

  const beginRecording = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError(text('此瀏覽器暫時不支援錄音。'));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      setError(null);
      setRecordingState('recording');

      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener('stop', () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const nextUrl = URL.createObjectURL(blob);
        if (recordingUrl) {
          URL.revokeObjectURL(recordingUrl);
        }
        setRecordingUrl(nextUrl);
        setRecordingState('recorded');
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      });

      recorder.start();
    } catch {
      setError(text('錄音權限未開啟，無法使用跟讀機。'));
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const playRecording = async () => {
    if (!recordingUrl) {
      return;
    }

    const audio = new Audio(recordingUrl);
    playbackRef.current?.pause();
    playbackRef.current = audio;
    setRecordingState('playing-back');
    audio.addEventListener('ended', () => {
      setRecordingState('recorded');
    });
    await audio.play().catch(() => {
      setError(text('無法播放錄音。'));
      setRecordingState('recorded');
    });
  };

  const statusLabel = {
    idle: text('待錄音'),
    recording: text('錄音中'),
    recorded: text('已錄好'),
    'playing-back': text('播放錄音中'),
  }[recordingState];
  const readyToContinue = Boolean(rating) && (Boolean(recordingUrl) || Boolean(error));

  return (
    <section className="step-card">
      <header className="step-card__header">
        <h2>{text(step.prompt)}</h2>
      </header>

      <div className="repeat-machine">
        <div className="repeat-machine__status" aria-live="polite">
          <strong>{text('狀態')}</strong>
          <span>{statusLabel}</span>
        </div>

        <div className="repeat-machine__actions">
          <AudioButton asset={targetAudio} label={text('聽原音')} compact loop={loopEnabled} />
          <button type="button" className="button button--secondary" onClick={beginRecording} disabled={busy || recordingState === 'recording'}>
            {text('錄音')}
          </button>
          <button type="button" className="button button--secondary" onClick={stopRecording} disabled={busy || recordingState !== 'recording'}>
            {text('停止')}
          </button>
          <button type="button" className="button button--secondary" onClick={playRecording} disabled={busy || !recordingUrl}>
            {text('聽我')}
          </button>
          <AudioButton asset={targetAudio} label={text('再聽原音')} compact />
        </div>

        <div className="repeat-machine__compare">
          <p>
            <strong>{text('目標')}</strong> {step.transcript}
          </p>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={loopEnabled}
              onChange={(event) => setLoopEnabled(event.target.checked)}
              disabled={busy}
            />
            <span>{text('循環播放')}</span>
          </label>
        </div>

        <div className="repeat-machine__rating">
          <strong>{text('自評')}</strong>
          <div className="choice-grid">
            {step.selfRatingLabels.map((label) => (
              <button
                key={label}
                type="button"
                className={rating === label ? 'choice-button is-selected' : 'choice-button'}
                onClick={() => setRating(label)}
                disabled={busy}
              >
                {text(label)}
              </button>
            ))}
          </div>
        </div>

        {step.reviewLaterSuggested ? (
          <button
            type="button"
            className={reviewLater ? 'button button--secondary is-flagged' : 'button button--secondary'}
            onClick={() => toggleReviewLater(lessonId)}
            disabled={busy}
          >
            {reviewLater ? text('已加入稍後複習') : text('加入稍後複習')}
          </button>
        ) : null}

        {error ? <p className="feedback feedback--error">{error}</p> : null}
      </div>

      <footer className="step-card__footer">
        <button type="button" className="button button--primary" onClick={onContinue} disabled={busy || !readyToContinue}>
          {text('完成')}
        </button>
      </footer>
    </section>
  );
}
