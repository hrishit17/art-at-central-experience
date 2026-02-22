import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { upcomingEvents } from "@/data/mockData";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import artwork4 from "@/assets/artwork-4.jpg";

gsap.registerPlugin(ScrollTrigger);

const pastExhibitions = [
  { id: "p1", title: "Fractured Light", artist: "Ava Chen", year: "2025", image: artwork3 },
  { id: "p2", title: "Still Life, Still Moving", artist: "James Okoro", year: "2025", image: artwork4 },
  { id: "p3", title: "Monochrome Dreams", artist: "Lena Müller", year: "2024", image: artwork1 },
  { id: "p4", title: "The Weight of Silence", artist: "David Park", year: "2024", image: artwork2 },
  { id: "p5", title: "Surface Tension", artist: "Maria Santos", year: "2024", image: artwork3 },
  { id: "p6", title: "Invisible Architecture", artist: "Yuki Tanaka", year: "2023", image: artwork4 },
];

const Exhibitions = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".exhibit-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.05,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className="min-h-screen pt-32 md:pt-40">
      <div className="px-6 md:px-12">
        <p className="micro-text text-muted-foreground mb-4">Now Showing</p>
        <h1 className="editorial-heading text-foreground text-5xl md:text-8xl mb-16 md:mb-24">
          Exhibitions
        </h1>

        {/* Current Exhibitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-24 md:mb-40">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="exhibit-card group" data-cursor="art">
              <div className="overflow-hidden aspect-[4/5]">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <p className="micro-text text-muted-foreground">{event.category}</p>
                <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-2">{event.title}</h3>
                <p className="body-text text-sm text-muted-foreground mt-1">{event.date}</p>
                <p className="body-text text-sm text-muted-foreground mt-2 max-w-md">{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Past Exhibitions */}
        <div className="border-t border-border pt-16 md:pt-24">
          <p className="micro-text text-muted-foreground mb-4">Archive</p>
          <h2 className="editorial-heading text-foreground text-4xl md:text-6xl mb-16">
            Past Exhibitions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {pastExhibitions.map((exhibit) => (
              <div key={exhibit.id} className="exhibit-card group" data-cursor="art">
                <div className="overflow-hidden aspect-[4/5]">
                  <img
                    src={exhibit.image}
                    alt={exhibit.title}
                    className="w-full h-full object-cover film-grain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <p className="micro-text text-muted-foreground">{exhibit.year}</p>
                  <h3 className="font-serif text-xl text-foreground mt-1">{exhibit.title}</h3>
                  <p className="body-text text-sm text-muted-foreground mt-1">{exhibit.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-24" />
    </div>
  );
};

export default Exhibitions;
