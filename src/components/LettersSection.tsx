import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { letters } from "@/data/letters";

export function LettersSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-12 text-center">
          The Letters
        </h2>

        <Accordion
          type="multiple"
          className="rounded border border-warm-rule bg-card px-6 sm:px-8"
        >
          {letters.map((letter) => {
            const scans = letter.photos?.length
              ? letter.photos
              : letter.photo
                ? [letter.photo]
                : [];
            const location = letter.address.split(", ").slice(-2).join(", ");

            return (
              <AccordionItem key={letter.id} value={letter.id} className="border-warm-rule">
              <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
                <div className="flex flex-1 flex-col gap-1 text-left">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-label text-lg font-bold text-foreground sm:text-xl">
                      {letter.year}
                    </span>
                    <span className="font-label text-sm text-mid-gray">{letter.date}</span>
                  </div>
                  <p className="font-label text-sm text-subtle-gray">{location}</p>
                  {letter.note && (
                    <p className="font-label text-xs italic text-amber">{letter.note}</p>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-6">
                <div className="border-t border-warm-rule pt-6">
                  <div className="prose-letter whitespace-pre-line">
                    {letter.content}
                  </div>

                  {letter.pullQuote && (
                    <blockquote className="border-l-2 border-amber pl-6 mt-8">
                      <p className="font-quote text-base italic text-foreground/80">
                        "{letter.pullQuote}"
                      </p>
                    </blockquote>
                  )}

                  {scans.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {scans.map((scan, index) => (
                        <div
                          key={scan}
                          className="border border-warm-rule rounded overflow-hidden bg-background"
                        >
                          <img
                            src={scan}
                            alt={`Scanned letter from ${letter.date}${scans.length > 1 ? `, page ${index + 1}` : ""}`}
                            className="w-full h-auto"
                            loading="lazy"
                          />
                          <p className="font-label px-4 py-2 text-xs text-subtle-gray">
                            Original letter, {letter.date}
                            {scans.length > 1 ? ` — page ${index + 1}` : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
