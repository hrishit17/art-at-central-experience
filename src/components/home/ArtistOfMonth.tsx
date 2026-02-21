import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredArtist } from "@/data/mockData";

gsap.registerPlugin(ScrollTrigger);

const ArtistOfMonth = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".artist-content",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".artist-content",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-24 md:py-40">
      <p className="micro-text text-muted-foreground mb-4">Featured</p>
      <h2 className="editorial-heading text-foreground text-5xl md:text-7xl mb-16 md:mb-24">
        Artist of the Month
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {/* Left: Sticky Portrait */}
        <div className="md:sticky md:top-24 md:self-start" data-cursor="art">
          <div className="overflow-hidden">
            <img
              src={featuredArtist.portrait}
              alt={featuredArtist.name}
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
          <h3
            className="editorial-heading text-foreground text-3xl md:text-5xl mt-6"
          >
            {featuredArtist.name}
          </h3>
        </div>

        {/* Right: Scrollable Content */}
        <div className="artist-content">
          {/* Quote */}
          <blockquote className="font-serif italic text-foreground text-2xl md:text-4xl leading-snug mb-12">
            "{featuredArtist.quote}"
          </blockquote>

          {/* Bio */}
          {featuredArtist.bio.split("\n\n").map((paragraph, i) => (
            <p key={i} className="body-text text-muted-foreground mb-6">
              {paragraph}
            </p>
          ))}

          {/* Works Grid */}
          <div className="mt-12">
            <p className="micro-text text-muted-foreground mb-6">Selected Works</p>
            <div className="grid grid-cols-2 gap-4">
              {featuredArtist.works.map((work, i) => (
                <div key={i} className="group" data-cursor="art">
                  <div className="overflow-hidden aspect-square">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="body-text text-sm text-foreground mt-2">{work.title}</p>
                  <p className="micro-text text-muted-foreground">{work.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistOfMonth;
