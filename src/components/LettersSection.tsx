import { useState } from "react";
import { letters } from "@/data/letters";

export function LettersSection() {
  const [selectedId, setSelectedId] = useState(letters[0].id);
  const selected = letters.find((l) => l.id === selectedId) || letters[0];

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-12 text-center">
          The Letters
        </h2>

        {/* Mobile: dropdown */}
        <div className="md:hidden mb-6">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full border border-warm-rule bg-card rounded px-3 py-2 text-sm font-sans text-foreground"
          >
            {letters.map((l) => (
              <option key={l.id} value={l.id}>
                {l.year} — {l.address}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-8">
          {/* Timeline sidebar - desktop */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
              <div className="relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-warm-rule" />
                {letters.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedId(l.id)}
                    className={`relative flex items-start gap-3 w-full text-left py-2 group`}
                  >
                    <div
                      className={`relative z-10 mt-1.5 w-[15px] h-[15px] rounded-full border-2 flex-shrink-0 transition-colors ${
                        selectedId === l.id
                          ? "bg-amber border-amber"
                          : "bg-card border-warm-rule group-hover:border-amber"
                      }`}
                    />
                    <div>
                      <span
                        className={`text-sm font-sans font-medium block leading-tight ${
                          selectedId === l.id ? "text-foreground" : "text-mid-gray"
                        }`}
                      >
                        {l.year}
                      </span>
                      <span className="text-xs text-subtle-gray font-sans leading-tight block">
                        {l.address.split(",")[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Letter display */}
          <div className="flex-1 min-w-0">
            <div className="border border-warm-rule bg-card rounded p-6 sm:p-10">
              <div className="mb-6 pb-4 border-b border-warm-rule">
                <p className="text-sm font-sans text-mid-gray">{selected.date}</p>
                <p className="text-sm font-sans text-subtle-gray">{selected.address}</p>
                {selected.note && (
                  <p className="text-xs font-sans text-amber mt-1 italic">{selected.note}</p>
                )}
              </div>

              <div className="prose-letter whitespace-pre-line">
                {selected.content}
              </div>

              {selected.pullQuote && (
                <blockquote className="border-l-2 border-amber pl-6 mt-8">
                  <p className="font-serif text-base italic text-foreground/80">
                    "{selected.pullQuote}"
                  </p>
                </blockquote>
              )}
            </div>

            {/* Photo */}
            {selected.photo && (
              <div className="mt-6 border border-warm-rule rounded overflow-hidden bg-card">
                <img
                  src={selected.photo}
                  alt={`Scanned letter from ${selected.date}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
                <p className="px-4 py-2 text-xs font-sans text-subtle-gray">
                  Original letter, {selected.date}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
