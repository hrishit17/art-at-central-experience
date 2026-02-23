import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Loader2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "@/hooks/use-toast";

interface JournalPost {
  id: string;
  title: string;
  content: string | null;
  author: string | null;
  thumbnail_url: string | null;
  status: string;
  publish_date: string | null;
}

const JournalManager = () => {
  const [items, setItems] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JournalPost | null>(null);
  const [form, setForm] = useState({ title: "", content: "", author: "Art at Central", thumbnail_url: "", status: "draft", publish_date: new Date().toISOString().split("T")[0] });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("journal_posts" as any).select("*").order("created_at", { ascending: false });
    setItems((data as any as JournalPost[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setForm({ title: "", content: "", author: "Art at Central", thumbnail_url: "", status: "draft", publish_date: new Date().toISOString().split("T")[0] });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (post: JournalPost) => {
    setForm({
      title: post.title,
      content: post.content ?? "",
      author: post.author ?? "Art at Central",
      thumbnail_url: post.thumbnail_url ?? "",
      status: post.status,
      publish_date: post.publish_date ?? new Date().toISOString().split("T")[0],
    });
    setEditing(post);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      content: form.content || null,
      author: form.author || "Art at Central",
      thumbnail_url: form.thumbnail_url || null,
      status: form.status,
      publish_date: form.publish_date || null,
    };

    if (editing) {
      await supabase.from("journal_posts" as any).update(payload as any).eq("id", editing.id);
      toast({ title: "Post updated" });
    } else {
      await supabase.from("journal_posts" as any).insert(payload as any);
      toast({ title: "Post created" });
    }
    setSaving(false);
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("journal_posts" as any).delete().eq("id", id);
    toast({ title: "Post deleted" });
    fetchItems();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="editorial-heading text-2xl text-foreground">Journal</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage blog posts and articles</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2">
          <Plus size={14} /> New Post
        </Button>
      </div>

      {showForm && (
        <div className="border border-border rounded-md p-6 space-y-5 bg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">{editing ? "Edit" : "New"} Post</h3>
            <button onClick={resetForm}><X size={16} className="text-muted-foreground" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Author</Label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Publish Date</Label>
              <Input type="date" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Content</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} placeholder="Write your article content here. Supports markdown formatting." />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Thumbnail</Label>
            <ImageUpload
              bucket="journal"
              currentUrl={form.thumbnail_url || undefined}
              onUpload={(url) => setForm({ ...form, thumbnail_url: url })}
              onRemove={() => setForm({ ...form, thumbnail_url: "" })}
              resolution="Recommended Thumbnail: 1200×630px (Landscape)"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={() => { setForm({ ...form, status: "draft" }); handleSave(); }} variant="outline" disabled={saving} className="flex-1">
              Save as Draft
            </Button>
            <Button onClick={() => { setForm({ ...form, status: "published" }); handleSave(); }} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Publish
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border border-border rounded-md p-4">
            {item.thumbnail_url && (
              <div className="w-20 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.author} · {item.publish_date}</p>
            </div>
            <Badge variant={item.status === "published" ? "default" : "secondary"} className="capitalize text-xs">
              {item.status}
            </Badge>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>Edit</Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                <Trash2 size={14} className="text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default JournalManager;
