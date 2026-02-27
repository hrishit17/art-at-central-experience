import { memo, useEffect, useRef, useState, useMemo, useCallback } from "react";
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

const PAGE_SIZE = 12;

const ExhibitionCard = memo(({ event, formatDate, showYear }: { event: Exhibition; formatDate: (s: string, e: string | null) => string; showYear?: boolean }) => (
  <div className="exhibit-card group" data-cursor="art">
    <div className="overflow-hidden aspect-[4/5]">
      {event.cover_image_url ? (
        <img src={event.cover_image_url} alt={event.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform" />
      ) : (
        <div className="w-full h-full bg-muted" />
      )}
    </div>
    <div className="mt-4">
      <p className="micro-text text-muted-foreground">{showYear ? new Date(event.start_date).getFullYear() : event.category}</p>
      <h3 className={`font-serif ${showYear ? 'text-xl' : 'text-2xl md:text-3xl'} text-foreground mt-${showYear ? '1' : '2'}`}>{event.title}</h3>
      {!showYear && <p className="body-text text-sm text-muted-foreground mt-1">{formatDate(event.start_date, event.end_date)}</p>}
      {!showYear && event.description && <p className="body-text text-sm text-muted-foreground mt-2 max-w-md">{event.description}</p>}
      {showYear && <p className="body-text text-sm text-muted-foreground mt-1">{event.category}</p>}
    </div>
  </div>
));
ExhibitionCard.displayName = "ExhibitionCard";

const Exhibitions = memo(() => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = useCallback(async (offset: number, append: boolean) => {
    const { data } = await supabase
      .from("exhibitions")
      .select("id, title, category, start_date, end_date, cover_image_url, description, status")
      .order("start_date", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    const results = (data as Exhibition[]) ?? [];
    if (results.length < PAGE_SIZE) setHasMore(false);
    setExhibitions(prev => append ? [...prev, ...results] : results);
    setLoading(false);
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    fetchPage(0, false);

    const channel = supabase
      .channel("exhibitions-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "exhibitions" }, () => {
        setHasMore(true);
        fetchPage(0, false);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPage]);

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);
    fetchPage(exhibitions.length, true);
  }, [exhibitions.length, fetchPage]);

  const { current, past } = useMemo(() => {
    const current = exhibitions.filter(e => e.status === "upcoming" || e.status === "current");
    const past = exhibitions.filter(e => e.status === "past");
    return { current, past };
  }, [exhibitions]);

  const formatDate = useCallback((start: string, end: string | null) => {
    const s = new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!end) return s;
    return `${s} — ${new Date(end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  }, []);

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
              <ExhibitionCard key={event.id} event={event} formatDate={formatDate} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="border-t border-border pt-16 md:pt-24">
            <p className="micro-text text-muted-foreground mb-4">Archive</p>
            <h2 className="editorial-heading text-foreground text-4xl md:text-6xl mb-16">Past Exhibitions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {past.map((exhibit) => (
                <ExhibitionCard key={exhibit.id} event={exhibit} formatDate={formatDate} showYear />
              ))}
            </div>
          </div>
        )}

        {current.length === 0 && past.length === 0 && (
          <p className="body-text text-muted-foreground text-center py-24">No exhibitions yet. Check back soon.</p>
        )}

        {hasMore && (
          <div className="flex justify-center py-16">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="micro-text border border-foreground text-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-500 disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Load More"}
            </button>
          </div>
        )}
      </div>
      <div className="h-24" />
    </div>
  );
});

Exhibitions.displayName = "Exhibitions";
export default Exhibitions;
