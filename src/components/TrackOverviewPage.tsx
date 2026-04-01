import { Link } from 'react-router-dom';

type TrackOverviewItem = {
  title: string;
  summary: string;
};

type TrackOverviewPageProps = {
  title: string;
  summary: string;
  items: readonly TrackOverviewItem[];
  action?: {
    label: string;
    to: string;
  };
};

export function TrackOverviewPage({ title, summary, items, action }: TrackOverviewPageProps) {
  return (
    <div className="page-stack">
      <section className="curriculum-head">
        <div className="curriculum-head__copy">
          <h1>{title}</h1>
          <p>{summary}</p>
        </div>
      </section>

      <section className="track-grid" aria-label={title}>
        {items.map((item) => (
          <article key={item.title} className="surface-card track-card">
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
          </article>
        ))}
      </section>

      {action ? (
        <section className="surface-card track-action">
          <Link className="button button--primary" to={action.to}>
            {action.label}
          </Link>
        </section>
      ) : null}
    </div>
  );
}
