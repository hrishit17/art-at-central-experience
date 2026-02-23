import { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { heroImage } from "@/data/mockData";

const Hero = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    if (imageRef.current) {
      gsap.fromTo(imageRef.current, { scale: 1.15 }, { scale: 1, duration: 3, ease: "power2.out" });
    }
    if (line1Ref.current) {
      tl.fromTo(line1Ref.current.children, { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.1 }, 0.5);
    }
    if (line2Ref.current) {
      tl.fromTo(line2Ref.current.children, { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.1 }, 0.7);
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 1.4);
    }
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      <img ref={imageRef} src={heroImage} alt="Art at Central gallery interior" className="absolute inset-0 w-full h-full object-cover will-change-transform" />
      <div className="absolute inset-0 bg-foreground/30" />
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12">
        <div>
          <div ref={line1Ref} className="overflow-hidden">
            <h1 className="editorial-heading text-primary-foreground" style={{ fontSize: "clamp(3.5rem, 12vw, 11rem)" }}>Art at</h1>
          </div>
          <div ref={line2Ref} className="overflow-hidden -mt-2 md:-mt-6">
            <h1 className="editorial-heading text-primary-foreground italic" style={{ fontSize: "clamp(3.5rem, 12vw, 11rem)" }}>Central</h1>
          </div>
          <p ref={subtitleRef} className="micro-text text-primary-foreground/70 mt-6 md:mt-8 max-w-md opacity-0">
            A curated space for contemporary art, exhibitions, and cultural dialogue. A division of Wild by Nature Global.
          </p>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;
