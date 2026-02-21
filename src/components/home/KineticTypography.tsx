import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { missionWords } from "@/data/mockData";

gsap.registerPlugin(ScrollTrigger);

const KineticTypography = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLSpanElement>(".kinetic-word").forEach((word) => {
        gsap.to(word, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: word,
            start: "top 75%",
            end: "top 40%",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-32 md:py-52">
      <p className="micro-text text-muted-foreground mb-12">Our Mission</p>
      <p className="editorial-heading text-foreground text-3xl md:text-6xl lg:text-7xl leading-tight">
        {missionWords.map((word, i) => (
          <span
            key={i}
            className="kinetic-word inline-block mr-[0.3em] opacity-[0.15]"
          >
            {word}
          </span>
        ))}
      </p>
    </section>
  );
};

export default KineticTypography;
