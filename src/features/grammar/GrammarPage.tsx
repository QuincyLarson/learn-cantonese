import { useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

export function GrammarPage() {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  return (
    <div className="page-stack">
      <section className="curriculum-head">
        <div className="curriculum-head__copy">
          <h1>{text('學語法')}</h1>
          <p>{text('之後會集中處理同普通話差得最遠的口語句式。')}</p>
        </div>
      </section>

      <section className="surface-card grammar-card">
        <ul className="grammar-card__list">
          <li>{text('句尾助詞')}</li>
          <li>{text('口語時態標記')}</li>
          <li>{text('常見口語語序')}</li>
        </ul>
      </section>
    </div>
  );
}
