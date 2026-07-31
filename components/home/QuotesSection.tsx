import { siteData } from "@/constants/home";

export function QuotesSection() {
  return (
    <section className="quotes-section section-shell" id="quotes">
      <div className="section-heading quotes-heading">
        <div>
          <p className="eyebrow">Words that linger</p>
          <h2>On the page <em>& beyond</em></h2>
        </div>
        <p className="quotes-intro">
          A glimpse from the collection, followed by the words it left with a
          reader.
        </p>
      </div>
      <div className="quotes-grid">
        {siteData.quotes.map((item, index) => (
          <blockquote
            className={`quote-card quote-card-${index + 1}`}
            key={item.source}
          >
            <div className="quote-card-top">
              <p className="quote-type">{item.type}</p>
              <span className="quote-index">0{index + 1}</span>
            </div>
            <span aria-hidden="true" className="quote-mark">“</span>
            <p className="quote-text">{item.quote}</p>
            <div className="quote-source">
              <span />
              <cite>{item.source}</cite>
            </div>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
