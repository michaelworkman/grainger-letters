import { chapters } from "@/data/chapters";
import { formatPullQuote, smartenQuotes } from "@/lib/smartenQuotes";

export function StorySection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-[680px] mx-auto">
        <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-16 text-center">
          The Story
        </h2>

        {chapters.map((chapter, i) => (
          <article key={chapter.number} className={i > 0 ? "mt-20" : ""}>
            <div className="mb-8">
              <span className="font-label text-amber text-sm tracking-widest uppercase">
                Chapter {Number(chapter.number)}
              </span>
              <h3 className="font-serif text-[2rem] font-semibold text-foreground mt-2">
                {smartenQuotes(chapter.title)}
              </h3>
            </div>

            {chapter.content.map((paragraph, pi) => (
              <p
                key={pi}
                className="prose-essay mb-6"
              >
                {paragraph}
              </p>
            ))}

            {chapter.pullQuote && (
              <blockquote className="border-l-2 border-amber pl-6 my-10">
                <p className="font-quote text-[1.35rem] text-foreground/80 leading-[1.15] sm:text-[1.65rem]">
                  {formatPullQuote(chapter.pullQuote)}
                </p>
                {chapter.pullQuoteAttribution && (
                  <cite className="font-label block mt-2 text-sm text-mid-gray not-italic">
                    — {chapter.pullQuoteAttribution}
                  </cite>
                )}
              </blockquote>
            )}

            {i < chapters.length - 1 && (
              <div className="w-32 h-0.5 bg-warm-rule mx-auto mt-16" />
            )}
          </article>
        ))}

        <div className="mt-20 border-t border-warm-rule pt-6">
          <p className="font-label text-xs uppercase tracking-[0.24em] text-mid-gray">
            Note
          </p>
          <p className="mt-3 text-sm sm:text-base font-label text-mid-gray leading-[1.5]">
            This site was assembled by Michael Workman from letters preserved in a family binder. The transcriptions, narrative essay, and Q&amp;A are powered by Claude, an AI made by Anthropic, which read and interpreted the letters in close collaboration with Michael.
          </p>
        </div>
      </div>
    </section>
  );
}
