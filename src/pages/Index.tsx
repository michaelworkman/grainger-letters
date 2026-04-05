import { useRef, useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StorySection } from "@/components/StorySection";
import { LettersSection } from "@/components/LettersSection";
import { PlacesSection } from "@/components/PlacesSection";
import { AskSection } from "@/components/AskSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const placesRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      hero: heroRef,
      story: storyRef,
      letters: lettersRef,
      places: placesRef,
      ask: askRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(section);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header activeSection={activeSection} onNavigate={scrollTo} />

      <div ref={heroRef}>
        <Hero />
      </div>

      <section className="px-4 pb-12">
        <div className="max-w-[680px] mx-auto">
          <img
            src="/photos/inslee-eleanor-grainger.jpg"
            alt="Eleanor and Inslee Grainger standing together outdoors"
            className="w-full h-auto rounded-sm"
            loading="eager"
            decoding="async"
          />
        </div>
      </section>

      <div ref={storyRef}>
        <StorySection />
      </div>

      <div className="w-full max-w-5xl mx-auto h-px bg-warm-rule" />

      <div ref={lettersRef}>
        <LettersSection />
      </div>

      <div className="w-full max-w-5xl mx-auto h-px bg-warm-rule" />

      <div ref={placesRef}>
        <PlacesSection />
      </div>

      <div className="w-full max-w-5xl mx-auto h-px bg-warm-rule" />

      <div ref={askRef}>
        <AskSection />
      </div>

      <footer className="py-12 text-center border-t border-warm-rule">
        <p className="text-sm font-label text-subtle-gray">
          Built with love by{" "}
          <a
            href="https://michaelwworkman.com"
            target="_blank"
            rel="noreferrer"
            className="text-foreground transition-colors hover:text-amber"
          >
            Michael Workman
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
