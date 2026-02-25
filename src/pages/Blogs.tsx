import { useState, useEffect, useMemo, memo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface JournalPost {
  id: string;
  title: string;
  content: string | null;
  publish_date: string | null;
  author: string | null;
  thumbnail_url: string | null;
  status: string;
}

const Blogs = memo(() => {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<JournalPost | null>(null);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const fetch = () => {
      supabase
        .from("journal_posts")
        .select("id, title, content, publish_date, author, thumbnail_url, status")
        .eq("status", "published")
        .order("publish_date", { ascending: false })
        .limit(10)
        .then(({ data }) => {
          setPosts((data as JournalPost[]) ?? []);
          setLoading(false);
        });
    };

    fetch();

    const channel = supabase
      .channel("journal-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "journal_posts" }, fetch)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const formatted = useMemo(() =>
    posts.map(p => ({
      ...p,
      dateLabel: p.publish_date ? new Date(p.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      excerpt: (p.content || "").substring(0, 160) + "…",
    })),
    [posts]
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = target.scrollTop / (target.scrollHeight - target.clientHeight);
    setReadProgress(Math.min(progress * 100, 100));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 md:pt-40 px-6 md:px-12">
        <Skeleton className="h-6 w-16 mb-4" />
        <Skeleton className="h-20 w-48 mb-16" />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <Skeleton className="aspect-[16/9] w-full" />
            <Skeleton className="h-4 w-48 mt-4" />
            <Skeleton className="h-10 w-72 mt-2" />
          </div>
          <div className="col-span-12 md:col-span-4 space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-t border-border pt-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-48 mt-2" />
                <Skeleton className="h-4 w-full mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className="min-h-screen pt-24" onScroll={handleScroll}>
        <div className="fixed top-0 left-0 w-full h-[2px] z-[200] bg-border">
          <div className="h-full bg-foreground transition-all duration-100" style={{ width: `${readProgress}%` }} />
        </div>
        <div className="px-6 md:px-12 max-w-3xl mx-auto py-12">
          <button onClick={() => setSelectedPost(null)} className="micro-text text-muted-foreground hover:text-foreground transition-colors mb-12">
            ← Back to Journal
          </button>
          <p className="micro-text text-muted-foreground mb-4">
            {selectedPost.author} · {selectedPost.publish_date ? new Date(selectedPost.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
          </p>
          <h1 className="editorial-heading text-foreground text-4xl md:text-6xl mb-8">{selectedPost.title}</h1>
          {selectedPost.thumbnail_url && (
            <div className="overflow-hidden mb-12" data-cursor="art">
              <img src={selectedPost.thumbnail_url} alt={selectedPost.title} loading="lazy" decoding="async" className="w-full aspect-[16/9] object-cover" />
            </div>
          )}
          {(selectedPost.content || "").split("\n\n").map((p, i) => (
            <p key={i} className="body-text text-foreground mb-6 text-lg leading-relaxed">{p}</p>
          ))}
        </div>
      </div>
    );
  }

  if (formatted.length === 0) {
    return (
      <div className="min-h-screen pt-32 md:pt-40">
        <div className="px-6 md:px-12">
          <p className="micro-text text-muted-foreground mb-4">The</p>
          <h1 className="editorial-heading text-foreground mb-16" style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}>Journal</h1>
          <p className="body-text text-muted-foreground text-center py-24">No journal posts yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      <div className="px-6 md:px-12">
        <p className="micro-text text-muted-foreground mb-4">The</p>
        <h1 className="editorial-heading text-foreground mb-16 md:mb-24" style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}>Journal</h1>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-8 group cursor-none" onClick={() => setSelectedPost(formatted[0])} data-cursor="art">
            <div className="overflow-hidden aspect-[16/9]">
              {formatted[0].thumbnail_url ? (
                <img src={formatted[0].thumbnail_url} alt={formatted[0].title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>
            <div className="mt-4">
              <p className="micro-text text-muted-foreground">{formatted[0].author} · {formatted[0].dateLabel}</p>
              <h2 className="font-serif text-2xl md:text-4xl text-foreground mt-2">{formatted[0].title}</h2>
              <p className="body-text text-muted-foreground mt-2 max-w-xl">{formatted[0].excerpt}</p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col gap-8">
            {formatted.slice(1).map((post) => (
              <div key={post.id} className="group cursor-none border-t border-border pt-6" onClick={() => setSelectedPost(post)} data-cursor="art">
                <p className="micro-text text-muted-foreground">{post.author} · {post.dateLabel}</p>
                <h3 className="font-serif text-xl text-foreground mt-2 group-hover:text-muted-foreground transition-colors">{post.title}</h3>
                <p className="body-text text-sm text-muted-foreground mt-1">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-24" />
    </div>
  );
});

Blogs.displayName = "Blogs";
export default Blogs;
