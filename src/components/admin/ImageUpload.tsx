import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import ResolutionBadge from "./ResolutionBadge";
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
  bucket: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  resolution: string;
  accept?: string;
  maxSizeMB?: number;
}

const ImageUpload = ({
  bucket,
  currentUrl,
  onUpload,
  onRemove,
  resolution,
  accept = "image/*",
  maxSizeMB = 5,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({ title: "File too large", description: `Max size is ${maxSizeMB}MB`, variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
    setPreview(publicUrl);
    onUpload(publicUrl);
    setUploading(false);
    toast({ title: "Upload complete" });
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <ResolutionBadge text={resolution} />
      {preview ? (
        <div className="relative group rounded-md overflow-hidden border border-border">
          {accept.includes("video") ? (
            <video src={preview} className="w-full max-h-48 object-cover" controls muted />
          ) : (
            <img src={preview} alt="Preview" className="w-full max-h-48 object-cover" />
          )}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
        >
          {uploading ? (
            <Loader2 className="mx-auto animate-spin text-muted-foreground" size={24} />
          ) : (
            <>
              <Upload className="mx-auto text-muted-foreground mb-2" size={24} />
              <p className="text-sm text-muted-foreground">Click to upload</p>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />
    </div>
  );
};

export default ImageUpload;
