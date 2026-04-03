import { chapters } from "@/data/chapters";

export function StorySection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-[680px] mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-16 text-center">
          The Story
        </h2>

        {chapters.map((chapter, i) => (
          <article key={chapter.number} className={i > 0 ? "mt-20" : ""}>
            <div className="mb-8">
              <span className="text-amber text-sm font-sans font-medium tracking-widest uppercase">
                Chapter {Number(chapter.number)}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mt-2">
                {chapter.title}
              </h3>
            </div>

            {chapter.content.map((paragraph, pi) => (
              <p
                key={pi}
                className="prose-letter mb-6"
              >
                {paragraph}
              </p>
            ))}

            <blockquote className="border-l-2 border-amber pl-6 my-10">
              <p className="font-serif text-lg italic text-foreground/80 leading-relaxed">
                "{chapter.pullQuote}"
              </p>
              <cite className="block mt-2 text-sm font-sans text-mid-gray not-italic">
                — {chapter.pullQuoteAttribution}
              </cite>
            </blockquote>

            {i < chapters.length - 1 && (
              <div className="w-8 h-0.5 bg-warm-rule mx-auto mt-16" />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
