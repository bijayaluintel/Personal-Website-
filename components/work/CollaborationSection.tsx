export function CollaborationSection({ collaboration, email }: {
  collaboration: { eyebrow: string; title: string; description: string };
  email: string;
}) {
  return (
    <section className="collaboration-section" id="collaboration">
      <div className="section-shell collaboration-grid" data-reveal="up">
        <div className="collaboration-copy">
          <p className="eyebrow">{collaboration.eyebrow}</p>
          <h2>{collaboration.title}</h2>
          <p>{collaboration.description}</p>
        </div>

        <form
          action={`mailto:${email}`}
          className="collaboration-form"
          id="contact"
          method="post"
        >
          <label>
            <span>Your name</span>
            <input name="name" placeholder="How should I address you?" required type="text" />
          </label>
          <label>
            <span>Email address</span>
            <input name="email" placeholder="you@example.com" required type="email" />
          </label>
          <label className="form-wide">
            <span>What are we making?</span>
            <textarea name="message" placeholder="Tell me briefly about the project, timeline, and what you need." required rows={4} />
          </label>
          <button type="submit">
            Send an enquiry
            <span aria-hidden="true">↗</span>
          </button>
        </form>
      </div>
    </section>
  );
}
