import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Image,
  Video,
  Upload,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";

type MediaItem = {
  id: number;
  type: "photo" | "video";
  title: string | null;
  titleMn: string | null;
  description: string | null;
  descriptionMn: string | null;
  url: string;
  thumbnailUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type FormState = {
  type: "photo" | "video";
  title: string;
  titleMn: string;
  description: string;
  descriptionMn: string;
  url: string;
  thumbnailUrl: string;
  sortOrder: number;
  isPublished: boolean;
};

const emptyForm = (): FormState => ({
  type: "photo",
  title: "",
  titleMn: "",
  description: "",
  descriptionMn: "",
  url: "",
  thumbnailUrl: "",
  sortOrder: 0,
  isPublished: true,
});

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  return null;
}

export default function AdminGallery() {
  const utils = trpc.useUtils();
  const { data: items = [], isLoading } = trpc.admin.gallery.list.useQuery();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [translatingId, setTranslatingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = trpc.admin.gallery.create.useMutation({
    onSuccess: () => {
      utils.admin.gallery.list.invalidate();
      setDialogOpen(false);
    },
  });

  const updateMutation = trpc.admin.gallery.update.useMutation({
    onSuccess: () => {
      utils.admin.gallery.list.invalidate();
      setDialogOpen(false);
    },
  });

  const deleteMutation = trpc.admin.gallery.delete.useMutation({
    onSuccess: () => {
      utils.admin.gallery.list.invalidate();
      setDeleteId(null);
    },
  });

  const retranslateMutation = trpc.admin.gallery.retranslate.useMutation({
    onSuccess: (data, variables) => {
      utils.admin.gallery.list.invalidate();
      setTranslatingId(null);
    },
  });

  const uploadImageMutation = trpc.admin.gallery.uploadImage.useMutation();

  function openCreate() {
    setEditItem(null);
    setForm(emptyForm());
    setDialogOpen(true);
  }

  function openEdit(item: MediaItem) {
    setEditItem(item);
    setForm({
      type: item.type,
      title: item.title ?? "",
      titleMn: item.titleMn ?? "",
      description: item.description ?? "",
      descriptionMn: item.descriptionMn ?? "",
      url: item.url,
      thumbnailUrl: item.thumbnailUrl ?? "",
      sortOrder: item.sortOrder,
      isPublished: item.isPublished,
    });
    setDialogOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const result = await uploadImageMutation.mutateAsync({
          base64,
          fileName: file.name,
          contentType: file.type,
        });
        setForm((f) => ({ ...f, url: result.url }));
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingImage(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editItem) {
        await updateMutation.mutateAsync({
          id: editItem.id,
          type: form.type,
          title: form.title || null,
          titleMn: form.titleMn || null,
          description: form.description || null,
          descriptionMn: form.descriptionMn || null,
          url: form.url,
          thumbnailUrl: form.thumbnailUrl || null,
          sortOrder: form.sortOrder,
          isPublished: form.isPublished,
        });
      } else {
        await createMutation.mutateAsync({
          type: form.type,
          title: form.title || undefined,
          titleMn: form.titleMn || undefined,
          description: form.description || undefined,
          descriptionMn: form.descriptionMn || undefined,
          url: form.url,
          thumbnailUrl: form.thumbnailUrl || undefined,
          sortOrder: form.sortOrder,
          isPublished: form.isPublished,
        });
      }
    } finally {
      setSaving(false);
    }
  }

  function handleRetranslate(id: number) {
    setTranslatingId(id);
    retranslateMutation.mutate({ id });
  }

  const thumbnailFor = (item: MediaItem) => {
    if (item.thumbnailUrl) return item.thumbnailUrl;
    if (item.type === "video") return getYouTubeThumbnail(item.url);
    return item.url;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Photos &amp; Videos Gallery
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage gallery items shown on the public Photos &amp; Videos page.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-lotus-green hover:bg-lotus-green/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{items.length} total items</span>
        <span>·</span>
        <span>{items.filter((i) => i.isPublished).length} published</span>
        <span>·</span>
        <span>{items.filter((i) => i.type === "photo").length} photos</span>
        <span>·</span>
        <span>{items.filter((i) => i.type === "video").length} videos</span>
      </div>

      {/* Gallery grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
          <Image className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            No gallery items yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Add Item" to upload photos or add YouTube videos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => {
            const thumb = thumbnailFor(item);
            return (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-muted relative">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={item.title ?? ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {item.type === "video" ? (
                        <Video className="w-10 h-10" />
                      ) : (
                        <Image className="w-10 h-10" />
                      )}
                    </div>
                  )}
                  {/* Type badge */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="text-xs gap-1 bg-black/60 text-white border-0"
                    >
                      {item.type === "video" ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <Image className="w-3 h-3" />
                      )}
                      {item.type}
                    </Badge>
                  </div>
                  {/* Published badge */}
                  {!item.isPublished && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive" className="text-xs">
                        Hidden
                      </Badge>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => openEdit(item as MediaItem)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRetranslate(item.id)}
                      disabled={translatingId === item.id}
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${translatingId === item.id ? "animate-spin" : ""}`}
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-2">
                  <p className="text-xs font-medium truncate">
                    {item.title || (
                      <span className="text-muted-foreground italic">
                        No title
                      </span>
                    )}
                  </p>
                  {item.titleMn && (
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                      <Globe className="w-2.5 h-2.5" />
                      {item.titleMn}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Gallery Item" : "Add Gallery Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Type selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: "photo" }))}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  form.type === "photo"
                    ? "border-lotus-green bg-lotus-green/5 text-lotus-green"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                <Image className="w-5 h-5" />
                <span className="font-medium">Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: "video" }))}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  form.type === "video"
                    ? "border-lotus-green bg-lotus-green/5 text-lotus-green"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                <Video className="w-5 h-5" />
                <span className="font-medium">Video (YouTube)</span>
              </button>
            </div>

            {/* URL / Upload */}
            {form.type === "photo" ? (
              <div className="space-y-2">
                <Label>Photo URL or Upload</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, url: e.target.value }))
                    }
                    placeholder="https://... or upload below"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-1.5 shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? "Uploading…" : "Upload"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                {form.url && (
                  <img
                    src={form.url}
                    alt="Preview"
                    className="mt-2 rounded-lg max-h-40 object-cover border"
                  />
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input
                  value={form.url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, url: e.target.value }))
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {form.url && getYouTubeThumbnail(form.url) && (
                  <img
                    src={getYouTubeThumbnail(form.url)!}
                    alt="YouTube thumbnail"
                    className="mt-2 rounded-lg max-h-40 object-cover border"
                  />
                )}
              </div>
            )}

            {/* Title EN + MN */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Title (English)</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Enter title…"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  Title (Mongolian)
                </Label>
                <Input
                  value={form.titleMn}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleMn: e.target.value }))
                  }
                  placeholder="Auto-translated on save…"
                  className="bg-amber-50/50 border-amber-200 focus-visible:ring-amber-300"
                />
              </div>
            </div>

            {/* Description EN + MN */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Description (English)</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Optional description…"
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  Description (Mongolian)
                </Label>
                <Textarea
                  value={form.descriptionMn}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, descriptionMn: e.target.value }))
                  }
                  placeholder="Auto-translated on save…"
                  rows={3}
                  className="bg-amber-50/50 border-amber-200 focus-visible:ring-amber-300"
                />
              </div>
            </div>

            {/* Sort order + Published */}
            <div className="flex items-center gap-6">
              <div className="space-y-1.5 flex-1">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sortOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-32"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Switch
                  id="published"
                  checked={form.isPublished}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isPublished: v }))
                  }
                />
                <Label htmlFor="published" className="cursor-pointer">
                  {form.isPublished ? (
                    <span className="flex items-center gap-1 text-green-700">
                      <Eye className="w-4 h-4" /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <EyeOff className="w-4 h-4" /> Hidden
                    </span>
                  )}
                </Label>
              </div>
            </div>

            <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-md p-2">
              Mongolian fields will be auto-translated from English when you
              save. You can also edit them manually. Use the{" "}
              <RefreshCw className="inline w-3 h-3" /> Re-translate button on
              any card to regenerate.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.url || saving}
              className="bg-lotus-green hover:bg-lotus-green/90"
            >
              {saving ? "Saving…" : editItem ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gallery Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The item will be permanently
              removed from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
