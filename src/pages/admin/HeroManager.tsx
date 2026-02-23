import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "@/hooks/use-toast";

interface HeroMedia {
  id: string;
  media_url: string;
  media_type: string;
  is_active: boolean;
  file_name: string | null;
  created_at: string;
}

const HeroManager = () => {
  const [items, setItems] = useState<HeroMedia[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("hero_media" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as any as HeroMedia[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleUpload = async (url: string) => {
    const isVideo = url.match(/\.(mp4|webm|mov)$/i);
    await supabase.from("hero_media" as any).insert({
      media_url: url,
      media_type: isVideo ? "video" : "image",
      file_name: url.split("/").pop(),
    } as any);
    toast({ title: "Hero media added" });
    fetchItems();
  };

  const toggleActive = async (id: string, active: boolean) => {
    if (active) {
      // Deactivate all others first
      await supabase.from("hero_media" as any).update({ is_active: false } as any).neq("id", id);
    }
    await supabase.from("hero_media" as any).update({ is_active: active } as any).eq("id", id);
    toast({ title: active ? "Set as active" : "Deactivated" });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("hero_media" as any).delete().eq("id", id);
    toast({ title: "Hero media deleted" });
    fetchItems();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="editorial-heading text-2xl text-foreground">Hero Manager</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage hero banner images and videos</p>
      </div>

      <ImageUpload
        bucket="hero-media"
        onUpload={handleUpload}
        resolution="Recommended: 1920×1080px (16:9 ratio, Max 5MB)"
        accept="image/*,video/mp4,video/webm"
      />

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border border-border rounded-md p-4">
            <div className="w-24 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
              {item.media_type === "video" ? (
                <video src={item.media_url} className="w-full h-full object-cover" muted />
              ) : (
                <img src={item.media_url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{item.file_name || "Untitled"}</p>
              <p className="text-xs text-muted-foreground capitalize">{item.media_type}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{item.is_active ? "Active" : "Inactive"}</span>
                <Switch checked={item.is_active} onCheckedChange={(v) => toggleActive(item.id, v)} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                <Trash2 size={14} className="text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No hero media yet. Upload one above.</p>
        )}
      </div>
    </div>
  );
};

export default HeroManager;
