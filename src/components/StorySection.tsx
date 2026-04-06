import { useState } from "react";

import { chapters } from "@/data/chapters";
import { formatPullQuote, smartenQuotes } from "@/lib/smartenQuotes";

const STORY_PREVIEW_BREAK = {
  chapterIndex: 1,
  paragraphIndex: 1,
} as const;

function StoryRevealCta({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative mt-4 pt-10 text-center">
      <button
        type="button"
        onClick={onClick}
        className="relative inline-flex items-center justify-center rounded-sm border border-amber bg-background px-5 py-3 font-label text-sm uppercase tracking-[0.2em] text-amber transition-colors hover:bg-amber hover:text-primary-foreground"
      >
        Read the Rest of the Story
      </button>
    </div>
  );
}

export function StorySection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-16 px-4">
      <div className="max-w-[680px] mx-auto">
        <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-16 text-center">
          The Story
        </h2>

        {chapters.map((chapter, i) => {
          const isPreviewChapter = i === STORY_PREVIEW_BREAK.chapterIndex;

          if (!isExpanded && i > STORY_PREVIEW_BREAK.chapterIndex) {
            return null;
          }

          const visibleParagraphs =
            !isPreviewChapter || isExpanded
              ? chapter.content
              : chapter.content.slice(0, STORY_PREVIEW_BREAK.paragraphIndex + 1);

          const previewParagraph = !isExpanded && isPreviewChapter
            ? chapter.content[STORY_PREVIEW_BREAK.paragraphIndex + 1]
            : null;
          const hasHiddenContent = chapter.content.length > visibleParagraphs.length;
          const shouldShowDivider = isExpanded
            ? i < chapters.length - 1
            : i < STORY_PREVIEW_BREAK.chapterIndex;

          return (
            <article key={chapter.number} className={i > 0 ? "mt-20" : ""}>
              <div className="mb-8">
                <span className="font-label text-amber text-sm tracking-widest uppercase">
                  Chapter {Number(chapter.number)}
                </span>
                <h3 className="font-serif text-[2rem] font-semibold text-foreground mt-2">
                  {smartenQuotes(chapter.title)}
                </h3>
              </div>

              {visibleParagraphs.map((paragraph, pi) => (
                <p
                  key={pi}
                  className="prose-essay mb-6"
                >
                  {paragraph}
                </p>
              ))}

              {previewParagraph ? (
                <div className="relative -mt-1 max-h-28 overflow-hidden">
                  <p className="prose-essay">
                    {previewParagraph}
                  </p>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(245, 239, 230, 0) 0%, rgba(245, 239, 230, 0.88) 60%, rgba(245, 239, 230, 1) 100%)",
                    }}
                  />
                </div>
              ) : null}

              {!isExpanded && isPreviewChapter && hasHiddenContent ? (
                <StoryRevealCta onClick={() => setIsExpanded(true)} />
              ) : null}

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

              {shouldShowDivider && (
                <div className="w-32 h-0.5 bg-warm-rule mx-auto mt-16" />
              )}
            </article>
          );
        })}

        {isExpanded ? (
          <div className="mt-20 border-t border-warm-rule pt-6">
            <p className="font-label text-xs uppercase tracking-[0.24em] text-mid-gray">
              Note
            </p>
            <p className="mt-3 text-sm sm:text-base font-label text-mid-gray leading-[1.5]">
              This site was assembled by Michael Workman from letters preserved in a family binder. The transcriptions, narrative essay, and Q&amp;A are powered by Claude, an AI made by Anthropic, which read and interpreted the letters in close collaboration with Michael.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
