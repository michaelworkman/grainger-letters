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

      <div className="w-full max-w-5xl mx-auto h-px bg-warm-rule" />

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
        <p className="text-sm font-sans text-subtle-gray">
          Built with love by Mike Workman · The Grainger Family Letters, 1963–1999
        </p>
      </footer>
    </div>
  );
};

export default Index;
