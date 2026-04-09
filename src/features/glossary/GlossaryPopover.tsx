import { useMemo, useState } from 'react';
import { InteractiveJyutping } from '@/components/InteractiveJyutping';
import type { GlossaryEntry } from '@/content';
import { AudioButton } from '@/features/audio/AudioButton';
import { getAudioAsset } from '@/features/learn/data';
import { convertText, useScriptText } from '@/lib/script';
import { useSettingsState } from '@/features/progress';

type GlossaryPopoverProps = {
  entry: GlossaryEntry;
  triggerLabel?: string;
  ariaLabel?: string;
  buttonClassName?: string;
};

export function GlossaryPopover({ entry, triggerLabel, ariaLabel, buttonClassName }: GlossaryPopoverProps) {
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
        className={buttonClassName ?? 'glossary-chip__button'}
        aria-expanded={open}
        aria-label={ariaLabel ?? text(`${entry.headword} 詞彙說明`)}
        onClick={() => setOpen((current) => !current)}
      >
        {triggerLabel ?? text(entry.headword)}
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
            <span className="eyebrow">粵拼</span>
            <strong>
              <InteractiveJyutping jyutping={entry.jyutping} speechText={entry.headword} />
            </strong>
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
          {audio ? <AudioButton asset={audio} compact label={text(`播放 ${entry.headword}`)} /> : null}
        </div>
      ) : null}
    </div>
  );
}
