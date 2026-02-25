import { memo, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/integrations/supabase/client";
import { featuredArtist as fallbackArtist } from "@/data/mockData";

gsap.registerPlugin(ScrollTrigger);

interface ArtistWork {
  id: string;
  title: string;
  image_url: string;
  year: string | null;
}

interface ArtistData {
  id: string;
  name: string;
  portrait_url: string | null;
  bio: string | null;
  quote: string | null;
}

const ArtistOfMonth = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [works, setWorks] = useState<ArtistWork[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      const { data } = await supabase
        .from("artist_of_month")
        .select("id, name, portrait_url, bio, quote")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

      if (data) {
        setArtist(data as ArtistData);
        const { data: worksData } = await supabase
          .from("artist_works")
          .select("id, title, image_url, year")
          .eq("artist_id", (data as ArtistData).id)
          .order("sort_order", { ascending: true })
          .limit(4);
        setWorks((worksData as ArtistWork[]) ?? []);
      }
      setLoaded(true);
    };

    fetchArtist();

    const channel = supabase
      .channel("artist-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "artist_of_month" }, fetchArtist)
      .on("postgres_changes", { event: "*", schema: "public", table: "artist_works" }, fetchArtist)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".artist-content", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".artist-content", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loaded]);

  const displayArtist = artist || {
    name: fallbackArtist.name,
    portrait_url: fallbackArtist.portrait,
    bio: fallbackArtist.bio,
    quote: fallbackArtist.quote,
  };
  const displayWorks = works.length > 0
    ? works.map(w => ({ title: w.title, image: w.image_url, year: w.year || "" }))
    : fallbackArtist.works;

  if (!loaded) return null;

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-16 md:py-24">
      <p className="micro-text text-muted-foreground mb-4">Featured</p>
      <h2 className="editorial-heading text-foreground text-5xl md:text-7xl mb-16 md:mb-24">Artist of the Month</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <div className="md:sticky md:top-24 md:self-start" data-cursor="art">
          <div className="overflow-hidden">
            <img src={displayArtist.portrait_url || ""} alt={displayArtist.name} loading="lazy" decoding="async" className="w-full aspect-[3/4] object-cover" />
          </div>
          <h3 className="editorial-heading text-foreground text-3xl md:text-5xl mt-6">{displayArtist.name}</h3>
        </div>

        <div className="artist-content">
          <blockquote className="font-serif italic text-foreground text-2xl md:text-4xl leading-snug mb-12">
            "{displayArtist.quote}"
          </blockquote>
          {(displayArtist.bio || "").split("\n\n").map((paragraph, i) => (
            <p key={i} className="body-text text-muted-foreground mb-6">{paragraph}</p>
          ))}
          <div className="mt-12">
            <p className="micro-text text-muted-foreground mb-6">Selected Works</p>
            <div className="grid grid-cols-2 gap-4">
              {displayWorks.map((work, i) => (
                <div key={i} className="group" data-cursor="art">
                  <div className="overflow-hidden aspect-square">
                    <img src={work.image} alt={work.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform" />
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
});

ArtistOfMonth.displayName = "ArtistOfMonth";
export default ArtistOfMonth;
