export function Hero() {
  return (
    <section className="py-20 sm:py-32 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <img
          src="/photos/house.png"
          alt="Illustration of the Grainger family house"
          className="w-[300px] max-w-full h-auto mx-auto mb-8"
        />
        <h1 className="font-serif text-[2.7rem] sm:text-[3.6rem] md:text-[4.5rem] font-semibold text-foreground leading-tight tracking-tight">
          The Grainger family letters
        </h1>
        <p className="mt-4 text-mid-gray text-base sm:text-lg font-label">
          1963–1999
        </p>
        <div className="mt-6 w-16 h-0.5 bg-amber mx-auto" />
        <div className="mt-8 max-w-xl mx-auto space-y-4 font-sans text-foreground/80 leading-[1.3]">
          <p className="text-base sm:text-lg">
            These are the Christmas letters of Inslee and Eleanor Grainger of Lexington, Virginia. They follow three daughters across careers and continents, a patriarch&apos;s long pursuit of a doctorate in his father&apos;s memory, and a matriarch whose pen rarely rested through illness, divorce, or grief.
          </p>
          <p className="text-sm sm:text-base">
            This site was assembled by Michael Workman from letters preserved in a family binder. The transcriptions, narrative essay, and Q&amp;A are powered by Claude, an AI made by Anthropic, which read and interpreted the letters in close collaboration with Michael.
          </p>
          <p className="text-sm sm:text-base">
            Read the story, browse the letters, see the places on a map, or ask a question about the family.
          </p>
        </div>
      </div>
    </section>
  );
}
