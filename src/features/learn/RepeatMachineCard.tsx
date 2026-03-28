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
  onContinue: () => void;
};

type RecordingState = 'idle' | 'recording' | 'recorded' | 'playing-back';

export function RepeatMachineCard({ lessonId, step, onContinue }: RepeatMachineCardProps) {
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

  return (
    <section className="step-card">
      <header className="step-card__header">
        <p className="eyebrow">{text('Repeat Machine')}</p>
        <h2>{text(step.title)}</h2>
        <p>{text(step.prompt)}</p>
      </header>

      <div className="repeat-machine">
        <div className="repeat-machine__status" aria-live="polite">
          <strong>{text('狀態')}</strong>
          <span>{statusLabel}</span>
        </div>

        <div className="repeat-machine__actions">
          <AudioButton asset={targetAudio} label={text('播放原音')} loop={loopEnabled} />
          <button type="button" className="button button--secondary" onClick={beginRecording} disabled={recordingState === 'recording'}>
            {text('開始錄音')}
          </button>
          <button type="button" className="button button--secondary" onClick={stopRecording} disabled={recordingState !== 'recording'}>
            {text('停止錄音')}
          </button>
          <button type="button" className="button button--secondary" onClick={playRecording} disabled={!recordingUrl}>
            {text('播放我的錄音')}
          </button>
          <AudioButton asset={targetAudio} label={text('再播一次原音')} />
        </div>

        <div className="repeat-machine__compare">
          <p>
            <strong>{text('目標音節')}</strong> {step.transcript}
          </p>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={loopEnabled}
              onChange={(event) => setLoopEnabled(event.target.checked)}
            />
            <span>{text('建議重播模式')}</span>
          </label>
          <p className="muted-text">
            {loopEnabled
              ? text('現在可反覆切換原音與自己的錄音，做 A/B 比對。')
              : text('如想多練幾次，可打開建議重播模式。')}
          </p>
        </div>

        <div className="repeat-machine__rating">
          <strong>{text('你自己覺得今次點？')}</strong>
          <div className="choice-grid">
            {step.selfRatingLabels.map((label) => (
              <button
                key={label}
                type="button"
                className={rating === label ? 'choice-button is-selected' : 'choice-button'}
                onClick={() => setRating(label)}
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
          >
            {reviewLater ? text('已加入稍後複習') : text('加入稍後複習')}
          </button>
        ) : null}

        {error ? <p className="feedback feedback--error">{error}</p> : null}
      </div>

      <footer className="step-card__footer">
        <button type="button" className="button button--primary" onClick={onContinue}>
          {text('下一步')}
        </button>
      </footer>
    </section>
  );
}
