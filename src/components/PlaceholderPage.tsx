type PlaceholderPageProps = {
  title: string;
  body: string;
};

export function PlaceholderPage({ title, body }: PlaceholderPageProps) {
  return (
    <section className="placeholder-page">
      <div className="placeholder-page__inner">
        <p className="eyebrow">{title}</p>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </section>
  );
}
