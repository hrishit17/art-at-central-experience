import { memo, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { supabase } from "@/integrations/supabase/client";
import heroFallback from "@/assets/hero-gallery.jpg";

interface HeroMedia {
  id: string;
  media_url: string;
  media_type: string;
}

const Hero = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [media, setMedia] = useState<HeroMedia | null>(null);

  useEffect(() => {
    const fetchHero = () => {
      supabase
        .from("hero_media")
        .select("id, media_url, media_type")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setMedia(data as HeroMedia);
        });
    };

    fetchHero();

    const channel = supabase
      .channel("hero-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "hero_media" }, fetchHero)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });
      const mediaEl = imageRef.current || videoRef.current;
      if (mediaEl) {
        gsap.fromTo(mediaEl, { scale: 1.15 }, { scale: 1, duration: 3, ease: "power2.out" });
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
    }, containerRef);
    return () => ctx.revert();
  }, [media]);

  const heroSrc = media?.media_url || heroFallback;
  const isVideo = media?.media_type === "video";

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      {isVideo ? (
        <video ref={videoRef} src={heroSrc} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover will-change-transform" />
      ) : (
        <img ref={imageRef} src={heroSrc} alt="Art at Central gallery interior" loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover will-change-transform" />
      )}
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
