import { memo, useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

gsap.registerPlugin(ScrollTrigger);

interface Exhibition {
  id: string;
  title: string;
  category: string | null;
  start_date: string;
  end_date: string | null;
  cover_image_url: string | null;
  description: string | null;
  status: string;
}

const Exhibitions = memo(() => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = () => {
      supabase
        .from("exhibitions")
        .select("id, title, category, start_date, end_date, cover_image_url, description, status")
        .order("start_date", { ascending: false })
        .limit(20)
        .then(({ data }) => {
          setExhibitions((data as Exhibition[]) ?? []);
          setLoading(false);
        });
    };

    fetch();

    const channel = supabase
      .channel("exhibitions-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "exhibitions" }, fetch)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const { current, past } = useMemo(() => {
    const current = exhibitions.filter(e => e.status === "upcoming" || e.status === "current");
    const past = exhibitions.filter(e => e.status === "past");
    return { current, past };
  }, [exhibitions]);

  const formatDate = (start: string, end: string | null) => {
    const s = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!end) return s;
    return `${s} — ${new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".exhibit-card").forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 60 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: i * 0.05,
          scrollTrigger: { trigger: card, start: "top 85%" },
        });
      });
    }, gridRef);
    return () => ctx.revert();
  }, [loading, exhibitions]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 md:pt-40 px-6 md:px-12">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-20 w-72 mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="h-4 w-32 mt-4" />
              <Skeleton className="h-8 w-48 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="min-h-screen pt-32 md:pt-40">
      <div className="px-6 md:px-12">
        <p className="micro-text text-muted-foreground mb-4">Now Showing</p>
        <h1 className="editorial-heading text-foreground mb-16 md:mb-24" style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}>
          Exhibitions
        </h1>

        {current.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-24 md:mb-40">
            {current.map((event) => (
              <div key={event.id} className="exhibit-card group" data-cursor="art">
                <div className="overflow-hidden aspect-[4/5]">
                  {event.cover_image_url ? (
                    <img src={event.cover_image_url} alt={event.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform" />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
                <div className="mt-4">
                  <p className="micro-text text-muted-foreground">{event.category}</p>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-2">{event.title}</h3>
                  <p className="body-text text-sm text-muted-foreground mt-1">{formatDate(event.start_date, event.end_date)}</p>
                  {event.description && <p className="body-text text-sm text-muted-foreground mt-2 max-w-md">{event.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="border-t border-border pt-16 md:pt-24">
            <p className="micro-text text-muted-foreground mb-4">Archive</p>
            <h2 className="editorial-heading text-foreground text-4xl md:text-6xl mb-16">Past Exhibitions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {past.map((exhibit) => (
                <div key={exhibit.id} className="exhibit-card group" data-cursor="art">
                  <div className="overflow-hidden aspect-[4/5]">
                    {exhibit.cover_image_url ? (
                      <img src={exhibit.cover_image_url} alt={exhibit.title} loading="lazy" decoding="async" className="w-full h-full object-cover film-grain transition-transform duration-700 group-hover:scale-105 will-change-transform" />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="micro-text text-muted-foreground">{new Date(exhibit.start_date).getFullYear()}</p>
                    <h3 className="font-serif text-xl text-foreground mt-1">{exhibit.title}</h3>
                    <p className="body-text text-sm text-muted-foreground mt-1">{exhibit.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {current.length === 0 && past.length === 0 && (
          <p className="body-text text-muted-foreground text-center py-24">No exhibitions yet. Check back soon.</p>
        )}
      </div>
      <div className="h-24" />
    </div>
  );
});

Exhibitions.displayName = "Exhibitions";
export default Exhibitions;
