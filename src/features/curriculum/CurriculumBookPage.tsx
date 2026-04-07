import { Link, Navigate, useParams } from 'react-router-dom';
import { useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';
import { getAdjacentCurriculumBooks, getCurriculumBookById, getCurriculumBookPosition, getCurriculumUnitById } from './catalog';

function getStageLabel(stageId: string): string {
  switch (stageId) {
    case 'stage-a':
      return 'Stage A';
    case 'stage-b':
      return 'Stage B';
    case 'stage-c':
      return 'Stage C';
    case 'stage-d':
      return 'Stage D';
    case 'stage-e':
      return 'Stage E';
    default:
      return stageId;
  }
}

function getPracticeLabel(unitId: string): string {
  switch (unitId) {
    case 'unit1':
      return '進入發音練習';
    case 'unit2':
      return '進入句式練習';
    case 'vocab':
      return '進入詞彙練習';
    default:
      return '進入練習';
  }
}

function getBookIntro(unitId: string, title: string, summary: string): string[] {
  if (unitId === 'unit1') {
    return [
      `呢一冊集中練「${title}」。重點唔係背理論，而係用粵拼把聲母、韻母同聲調聽穩、睇穩、打穩。`,
      `對普通話使用者嚟講，最容易出錯嘅位正正係 ${summary} 所指向嗰類對比，所以呢一冊會刻意用短音節、短詞同快回鍋把錯位拉開。`,
      '完成之後，你應該可以一聽就知道音點走，一見粵拼就讀得出，而且唔再不自覺地退返去拼音習慣。',
    ];
  }

  if (unitId === 'unit2') {
    return [
      `呢一冊集中練「${title}」。你本身已經識大部分意思，所以唔需要重學概念，而係要把普通話式出口改成真正粵語口語。`,
      `本冊核心係 ${summary}。所有練習都會盡量放入可由語境估到意思嘅短句，迫你記住粵語真正會點樣講，而唔係逐字直譯。`,
      '做完之後，呢組字、詞或者句式應該會變成你開口時的第一反應，而唔再係事後修正。',
    ];
  }

  return [
    `呢一冊集中練「${title}」。重點係見到字、詞或者短句就立刻打出完整粵拼連聲調，唔靠慢慢猜。`,
    `本冊會圍住 ${summary} 反覆出題，靠大量回鍋把字音、節奏同出手速度磨到自然。`,
    '做完之後，呢批內容應該會更快由眼到手，亦更容易喺之後的大型複習循環中穩定保留。',
  ];
}

function getBookMethod(unitId: string): string[] {
  if (unitId === 'unit1') {
    return [
      '先聽目標音，再對照粵拼。',
      '之後用輸入同跟讀分開練，確保眼、耳、口唔會脫節。',
      '最後再做回鍋，把最易滑走的細位再拉正一次。',
    ];
  }

  if (unitId === 'unit2') {
    return [
      '先用短句見到真實語境。',
      '再把 Cantonese-only 的位單獨抽出來理解用途。',
      '最後回到整句裡反覆打熟，直到唔再想起普通話直譯。',
    ];
  }

  return [
    '先看提示範圍，建立預期。',
    '之後直接輸入完整粵拼，同時保住聲調數字。',
    '答錯就即刻回鍋，直到出手速度同準確度一起穩住。',
  ];
}

export function CurriculumBookPage() {
  const { bookId } = useParams();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  const book = bookId ? getCurriculumBookById(bookId) : undefined;

  if (!book || book.status !== 'built') {
    return <Navigate to="/curriculum" replace />;
  }

  const unit = getCurriculumUnitById(book.unitId);
  const position = getCurriculumBookPosition(book.id);
  const { previousBook, nextBook } = getAdjacentCurriculumBooks(book.id);
  const introParagraphs = getBookIntro(book.unitId, book.title, book.summary);
  const methodSteps = getBookMethod(book.unitId);

  return (
    <div className="curriculum-book-page">
      <section className="curriculum-book-page__head">
        <p className="curriculum-book-page__eyebrow">
          {text(`${unit?.title ?? ''} · ${getStageLabel(book.stageId)} · 第 ${position?.index ?? 1} / ${position?.total ?? 1} 冊`)}
        </p>
        <h1>{text(book.title)}</h1>
        <p className="curriculum-book-page__summary">{text(book.summary)}</p>
      </section>

      <section className="curriculum-book-page__section">
        {introParagraphs.map((paragraph) => (
          <p key={paragraph}>{text(paragraph)}</p>
        ))}
      </section>

      <section className="curriculum-book-page__section">
        <h2>{text('你會點樣練')}</h2>
        {methodSteps.map((step, index) => (
          <p key={step}>{text(`${index + 1}. ${step}`)}</p>
        ))}
      </section>

      <section className="curriculum-book-page__section">
        <h2>{text('完成標準')}</h2>
        <p>
          {text(
            '你應該做到：見到本冊核心內容時，唔使先譯成普通話，已經可以直接聯想到正確粵拼、正確節奏，同埋相應嘅口語使用場景。',
          )}
        </p>
      </section>

      <section className="curriculum-book-page__actions">
        {book.practiceRoute ? (
          <Link className="button button--primary" to={book.practiceRoute}>
            {text(getPracticeLabel(book.unitId))}
          </Link>
        ) : null}
        <Link className="button button--secondary" to="/curriculum">
          {text('返回課程')}
        </Link>
      </section>

      <nav className="curriculum-book-page__nav" aria-label={text('冊次導航')}>
        {previousBook ? (
          <Link className="button button--secondary" to={previousBook.route ?? '/curriculum'}>
            {text(`上一冊：${previousBook.title}`)}
          </Link>
        ) : <span />}
        {nextBook ? (
          <Link className="button button--secondary" to={nextBook.route ?? '/curriculum'}>
            {text(`下一冊：${nextBook.title}`)}
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
