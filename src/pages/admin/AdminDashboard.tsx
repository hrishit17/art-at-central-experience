import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Image, CalendarDays, BookOpen, Palette } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ hero: 0, exhibitions: 0, journal: 0, artists: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [hero, exh, journal, artists] = await Promise.all([
        supabase.from("hero_media" as any).select("id", { count: "exact", head: true }),
        supabase.from("exhibitions" as any).select("id", { count: "exact", head: true }),
        supabase.from("journal_posts" as any).select("id", { count: "exact", head: true }),
        supabase.from("artist_of_month" as any).select("id", { count: "exact", head: true }),
      ]);
      setStats({
        hero: hero.count ?? 0,
        exhibitions: exh.count ?? 0,
        journal: journal.count ?? 0,
        artists: artists.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Hero Media", count: stats.hero, icon: Image },
    { label: "Exhibitions", count: stats.exhibitions, icon: CalendarDays },
    { label: "Journal Posts", count: stats.journal, icon: BookOpen },
    { label: "Artists", count: stats.artists, icon: Palette },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="editorial-heading text-2xl text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of your content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, count, icon: Icon }) => (
          <div key={label} className="border border-border rounded-md p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
              <Icon size={16} className="text-muted-foreground" />
            </div>
            <p className="text-3xl font-light text-foreground">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
