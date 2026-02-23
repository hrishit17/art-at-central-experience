import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Loader2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import ResolutionBadge from "@/components/admin/ResolutionBadge";
import { toast } from "@/hooks/use-toast";

interface Exhibition {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  start_date: string;
  end_date: string | null;
  category: string | null;
  status: string;
}

const ExhibitionsManager = () => {
  const [items, setItems] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Exhibition | null>(null);
  const [form, setForm] = useState({ title: "", description: "", cover_image_url: "", start_date: "", end_date: "", category: "Group Exhibition" });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("exhibitions" as any).select("*").order("start_date", { ascending: false });
    setItems((data as any as Exhibition[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", cover_image_url: "", start_date: "", end_date: "", category: "Group Exhibition" });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (ex: Exhibition) => {
    setForm({
      title: ex.title,
      description: ex.description ?? "",
      cover_image_url: ex.cover_image_url ?? "",
      start_date: ex.start_date,
      end_date: ex.end_date ?? "",
      category: ex.category ?? "Group Exhibition",
    });
    setEditing(ex);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.start_date) {
      toast({ title: "Title and start date required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      cover_image_url: form.cover_image_url || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      category: form.category,
    };

    if (editing) {
      await supabase.from("exhibitions" as any).update(payload as any).eq("id", editing.id);
      toast({ title: "Exhibition updated" });
    } else {
      await supabase.from("exhibitions" as any).insert(payload as any);
      toast({ title: "Exhibition created" });
    }
    setSaving(false);
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("exhibitions" as any).delete().eq("id", id);
    toast({ title: "Exhibition deleted" });
    fetchItems();
  };

  const toggleStatus = async (id: string, status: string) => {
    const newStatus = status === "archived" ? "upcoming" : "archived";
    await supabase.from("exhibitions" as any).update({ status: newStatus } as any).eq("id", id);
    toast({ title: `Exhibition ${newStatus}` });
    fetchItems();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="editorial-heading text-2xl text-foreground">Exhibitions</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage upcoming and past exhibitions</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2">
          <Plus size={14} /> Add Exhibition
        </Button>
      </div>

      {showForm && (
        <div className="border border-border rounded-md p-6 space-y-5 bg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">{editing ? "Edit" : "New"} Exhibition</h3>
            <button onClick={resetForm}><X size={16} className="text-muted-foreground" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Start Date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">End Date</Label>
              <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Cover Image</Label>
            <ImageUpload
              bucket="exhibitions"
              currentUrl={form.cover_image_url || undefined}
              onUpload={(url) => setForm({ ...form, cover_image_url: url })}
              onRemove={() => setForm({ ...form, cover_image_url: "" })}
              resolution="Recommended: 1080×1350px (4:5 ratio)"
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            {editing ? "Update" : "Create"} Exhibition
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border border-border rounded-md p-4">
            {item.cover_image_url && (
              <div className="w-16 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                <img src={item.cover_image_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.start_date}{item.end_date ? ` — ${item.end_date}` : ""}</p>
            </div>
            <Badge variant={item.status === "archived" ? "secondary" : "default"} className="capitalize text-xs">
              {item.status}
            </Badge>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => toggleStatus(item.id, item.status)}>
                {item.status === "archived" ? "Restore" : "Archive"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>Edit</Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                <Trash2 size={14} className="text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No exhibitions yet.</p>
        )}
      </div>
    </div>
  );
};

export default ExhibitionsManager;
