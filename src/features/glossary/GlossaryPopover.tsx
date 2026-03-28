import { useMemo, useState } from 'react';
import type { GlossaryEntry } from '@/content';
import { AudioButton } from '@/features/audio/AudioButton';
import { getAudioAsset } from '@/features/learn/data';
import { convertText, useScriptText } from '@/lib/script';
import { useSettingsState } from '@/features/progress';

type GlossaryPopoverProps = {
  entry: GlossaryEntry;
};

export function GlossaryPopover({ entry }: GlossaryPopoverProps) {
  const { scriptPreference } = useSettingsState();
  const [open, setOpen] = useState(false);
  const text = useScriptText(scriptPreference);
  const audio = useMemo(() => getAudioAsset(entry.audioId), [entry.audioId]);

  return (
    <div
      className="glossary-chip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="glossary-chip__button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {text(entry.headword)}
      </button>
      {open ? (
        <div className="glossary-popover" role="dialog" aria-label={text(`${entry.headword} 詞彙說明`)}>
          <div className="glossary-popover__row">
            <span className="eyebrow">繁體</span>
            <strong>{entry.headword}</strong>
          </div>
          <div className="glossary-popover__row">
            <span className="eyebrow">簡體</span>
            <strong>{convertText(entry.headword, 'simplified')}</strong>
          </div>
          <div className="glossary-popover__row">
            <span className="eyebrow">Jyutping</span>
            <strong>{entry.jyutping}</strong>
          </div>
          <div className="glossary-popover__row">
            <span className="eyebrow">普通話說明</span>
            <p>{text(entry.mandarinGloss)}</p>
          </div>
          {entry.note ? (
            <div className="glossary-popover__row">
              <span className="eyebrow">補充</span>
              <p>{text(entry.note)}</p>
            </div>
          ) : null}
          <AudioButton asset={audio} compact label={text(`播放 ${entry.headword}`)} />
        </div>
      ) : null}
    </div>
  );
}
