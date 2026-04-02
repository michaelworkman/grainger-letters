export function Hero() {
  return (
    <section className="py-20 sm:py-32 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground leading-tight tracking-tight">
          The Grainger family letters
        </h1>
        <p className="mt-4 text-mid-gray text-base sm:text-lg font-sans">
          Lexington, Virginia · 1963–1999
        </p>
        <div className="mt-6 w-16 h-0.5 bg-amber mx-auto" />
        <p className="mt-8 text-foreground/80 font-serif text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Thirty-six years of Christmas letters from an extraordinary American family — 
          from the Shenandoah Valley to Rwanda, from a Navy retirement to a doctorate, 
          from three daughters' childhoods to their humanitarian work on four continents.
        </p>
      </div>
    </section>
  );
}
