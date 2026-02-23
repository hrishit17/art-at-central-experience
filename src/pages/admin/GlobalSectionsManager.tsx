import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "@/hooks/use-toast";

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  quote: string | null;
  portrait_url: string | null;
  is_active: boolean;
}

interface GalleryRoom {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

const GlobalSectionsManager = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [rooms, setRooms] = useState<GalleryRoom[]>([]);
  const [loading, setLoading] = useState(true);

  // Artist form
  const [artistForm, setArtistForm] = useState({ name: "", bio: "", quote: "", portrait_url: "" });
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [savingArtist, setSavingArtist] = useState(false);

  // Room form
  const [roomForm, setRoomForm] = useState({ name: "", description: "", image_url: "" });
  const [editingRoom, setEditingRoom] = useState<GalleryRoom | null>(null);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [savingRoom, setSavingRoom] = useState(false);

  const fetchData = async () => {
    const [a, r] = await Promise.all([
      supabase.from("artist_of_month" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_rooms" as any).select("*").order("sort_order"),
    ]);
    setArtists((a.data as any as Artist[]) ?? []);
    setRooms((r.data as any as GalleryRoom[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Artist CRUD
  const saveArtist = async () => {
    if (!artistForm.name) { toast({ title: "Name required", variant: "destructive" }); return; }
    setSavingArtist(true);
    const payload = {
      name: artistForm.name,
      bio: artistForm.bio || null,
      quote: artistForm.quote || null,
      portrait_url: artistForm.portrait_url || null,
    };
    if (editingArtist) {
      await supabase.from("artist_of_month" as any).update(payload as any).eq("id", editingArtist.id);
      toast({ title: "Artist updated" });
    } else {
      await supabase.from("artist_of_month" as any).insert(payload as any);
      toast({ title: "Artist added" });
    }
    setSavingArtist(false);
    setShowArtistForm(false);
    setEditingArtist(null);
    setArtistForm({ name: "", bio: "", quote: "", portrait_url: "" });
    fetchData();
  };

  const toggleArtistActive = async (id: string, active: boolean) => {
    if (active) await supabase.from("artist_of_month" as any).update({ is_active: false } as any).neq("id", id);
    await supabase.from("artist_of_month" as any).update({ is_active: active } as any).eq("id", id);
    toast({ title: active ? "Artist activated" : "Artist deactivated" });
    fetchData();
  };

  const deleteArtist = async (id: string) => {
    await supabase.from("artist_of_month" as any).delete().eq("id", id);
    toast({ title: "Artist deleted" });
    fetchData();
  };

  // Room CRUD
  const saveRoom = async () => {
    if (!roomForm.name) { toast({ title: "Name required", variant: "destructive" }); return; }
    setSavingRoom(true);
    const payload = {
      name: roomForm.name,
      description: roomForm.description || null,
      image_url: roomForm.image_url || null,
      sort_order: rooms.length,
    };
    if (editingRoom) {
      await supabase.from("gallery_rooms" as any).update(payload as any).eq("id", editingRoom.id);
      toast({ title: "Room updated" });
    } else {
      await supabase.from("gallery_rooms" as any).insert(payload as any);
      toast({ title: "Room added" });
    }
    setSavingRoom(false);
    setShowRoomForm(false);
    setEditingRoom(null);
    setRoomForm({ name: "", description: "", image_url: "" });
    fetchData();
  };

  const deleteRoom = async (id: string) => {
    await supabase.from("gallery_rooms" as any).delete().eq("id", id);
    toast({ title: "Room deleted" });
    fetchData();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-12">
      {/* Artist of the Month Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="editorial-heading text-2xl text-foreground">Artist of the Month</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage featured artists</p>
          </div>
          <Button onClick={() => { setArtistForm({ name: "", bio: "", quote: "", portrait_url: "" }); setEditingArtist(null); setShowArtistForm(true); }} className="gap-2">
            <Plus size={14} /> Add Artist
          </Button>
        </div>

        {showArtistForm && (
          <div className="border border-border rounded-md p-6 space-y-4 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
                <Input value={artistForm.name} onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Quote</Label>
                <Input value={artistForm.quote} onChange={(e) => setArtistForm({ ...artistForm, quote: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Biography</Label>
              <Textarea value={artistForm.bio} onChange={(e) => setArtistForm({ ...artistForm, bio: e.target.value })} rows={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Portrait</Label>
              <ImageUpload
                bucket="artists"
                currentUrl={artistForm.portrait_url || undefined}
                onUpload={(url) => setArtistForm({ ...artistForm, portrait_url: url })}
                onRemove={() => setArtistForm({ ...artistForm, portrait_url: "" })}
                resolution="Recommended Portrait: 800×1000px"
              />
            </div>
            <Button onClick={saveArtist} disabled={savingArtist} className="w-full">
              {savingArtist ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              {editingArtist ? "Update" : "Add"} Artist
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {artists.map((a) => (
            <div key={a.id} className="flex items-center gap-4 border border-border rounded-md p-4">
              {a.portrait_url && (
                <div className="w-12 h-14 rounded overflow-hidden bg-muted flex-shrink-0">
                  <img src={a.portrait_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.name}</p>
                <p className="text-xs text-muted-foreground truncate">{a.bio?.slice(0, 60)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{a.is_active ? "Active" : ""}</span>
                <Switch checked={a.is_active} onCheckedChange={(v) => toggleArtistActive(a.id, v)} />
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setArtistForm({ name: a.name, bio: a.bio ?? "", quote: a.quote ?? "", portrait_url: a.portrait_url ?? "" }); setEditingArtist(a); setShowArtistForm(true); }}>Edit</Button>
              <Button variant="ghost" size="icon" onClick={() => deleteArtist(a.id)}>
                <Trash2 size={14} className="text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Rooms Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="editorial-heading text-2xl text-foreground">Gallery Rooms</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage the horizontal gallery section</p>
          </div>
          <Button onClick={() => { setRoomForm({ name: "", description: "", image_url: "" }); setEditingRoom(null); setShowRoomForm(true); }} className="gap-2">
            <Plus size={14} /> Add Room
          </Button>
        </div>

        {showRoomForm && (
          <div className="border border-border rounded-md p-6 space-y-4 bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Room Name</Label>
                <Input value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
                <Input value={roomForm.description} onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Room Image</Label>
              <ImageUpload
                bucket="gallery-rooms"
                currentUrl={roomForm.image_url || undefined}
                onUpload={(url) => setRoomForm({ ...roomForm, image_url: url })}
                onRemove={() => setRoomForm({ ...roomForm, image_url: "" })}
                resolution="Recommended: 1600×900px"
              />
            </div>
            <Button onClick={saveRoom} disabled={savingRoom} className="w-full">
              {savingRoom ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              {editingRoom ? "Update" : "Add"} Room
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {rooms.map((r) => (
            <div key={r.id} className="flex items-center gap-4 border border-border rounded-md p-4">
              {r.image_url && (
                <div className="w-20 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                  <img src={r.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setRoomForm({ name: r.name, description: r.description ?? "", image_url: r.image_url ?? "" }); setEditingRoom(r); setShowRoomForm(true); }}>Edit</Button>
              <Button variant="ghost" size="icon" onClick={() => deleteRoom(r.id)}>
                <Trash2 size={14} className="text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GlobalSectionsManager;
