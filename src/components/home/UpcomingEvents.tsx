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
}

const UpcomingEvents = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = () => {
      supabase
        .from("exhibitions")
        .select("id, title, category, start_date, end_date, cover_image_url, description")
        .in("status", ["upcoming", "current"])
        .order("start_date", { ascending: true })
        .limit(6)
        .then(({ data }) => {
          setExhibitions((data as Exhibition[]) ?? []);
          setLoading(false);
        });
    };

    fetch();

    const channel = supabase
      .channel("exhibitions-home")
      .on("postgres_changes", { event: "*", schema: "public", table: "exhibitions" }, fetch)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const formatted = useMemo(() =>
    exhibitions.map(e => ({
      ...e,
      dateLabel: e.end_date
        ? `${new Date(e.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${new Date(e.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
        : new Date(e.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    })),
    [exhibitions]
  );

  useEffect(() => {
    if (loading || formatted.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".event-card").forEach((card, i) => {
        gsap.fromTo(card, { y: 80 + i * 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%", end: "top 50%", toggleActions: "play none none none" },
        });
      });

      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (!isTouchDevice) {
        gsap.utils.toArray<HTMLElement>(".event-image").forEach((img) => {
          gsap.to(img, {
            yPercent: -15, ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, formatted]);

  if (loading) {
    return (
      <section className="px-6 md:px-12 py-24 md:py-40">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-16 w-64 mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {[7, 5, 7, 5].map((span, i) => (
            <div key={i} className={`col-span-1 md:col-span-${span}`}>
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="h-4 w-32 mt-4" />
              <Skeleton className="h-8 w-48 mt-2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (formatted.length === 0) return null;

  return (
    <section ref={sectionRef} className="px-6 md:px-12 py-24 md:py-40">
      <p className="micro-text text-muted-foreground mb-4">Upcoming</p>
      <h2 className="editorial-heading text-foreground mb-16 md:mb-24" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>
        Exhibitions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {formatted.map((event, i) => {
          const colSpan = i % 2 === 0 ? "md:col-span-7" : "md:col-span-5";
          return (
            <div key={event.id} className={`event-card col-span-1 ${colSpan} group`} data-cursor="art">
              <div className="overflow-hidden aspect-[4/5]">
                {event.cover_image_url ? (
                  <img src={event.cover_image_url} alt={event.title} loading="lazy" decoding="async" className="event-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="micro-text text-muted-foreground">{event.category}</p>
                <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-1">{event.title}</h3>
                <p className="body-text text-sm text-muted-foreground mt-2">{event.dateLabel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

UpcomingEvents.displayName = "UpcomingEvents";
export default UpcomingEvents;
