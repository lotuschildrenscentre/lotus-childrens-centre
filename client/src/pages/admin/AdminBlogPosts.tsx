/**
 * Admin Blog Posts Manager
 * Allows admins to create, edit, publish/unpublish, and delete blog posts
 * for the News & Updates page. Supports bilingual EN/MN content with
 * auto-translation via the server-side LLM pipeline.
 */
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  Loader2,
  ArrowLeft,
  Save,
  Calendar,
  User,
  Tag,
  Languages,
  FileText,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  category: string | null;
  author: string | null;
  coverImageUrl: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  titleMn: string | null;
  summaryMn: string | null;
  contentMn: string | null;
  categoryMn: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type PostForm = {
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  coverImageUrl: string;
  isPublished: boolean;
  titleMn: string;
  summaryMn: string;
  contentMn: string;
  categoryMn: string;
};

const emptyForm = (): PostForm => ({
  title: "",
  summary: "",
  content: "",
  category: "",
  author: "",
  coverImageUrl: "",
  isPublished: false,
  titleMn: "",
  summaryMn: "",
  contentMn: "",
  categoryMn: "",
});

// ─── Cover Image Upload ──────────────────────────────────────

function CoverImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadMutation = trpc.admin.blog.uploadCoverImage.useMutation({
    onSuccess: (data) => {
      onChange(data.url);
      toast.success("Cover image uploaded");
    },
    onError: (err) => toast.error(`Upload failed: ${err.message}`),
    onSettled: () => setUploading(false),
  });

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        uploadMutation.mutate({ base64, fileName: file.name, contentType: file.type });
      };
      reader.readAsDataURL(file);
    },
    [uploadMutation]
  );

  return (
    <div className="space-y-2">
      <Label>Cover Image</Label>
      {value && (
        <div className="relative group rounded-lg overflow-hidden border max-w-sm">
          <img src={value} alt="Cover" className="w-full h-40 object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or upload a file"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

// ─── Post Editor (Create / Edit) ────────────────────────────

function PostEditor({
  post,
  onBack,
}: {
  post: BlogPost | null; // null = create new
  onBack: () => void;
}) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState<PostForm>(() =>
    post
      ? {
          title: post.title,
          summary: post.summary || "",
          content: post.content,
          category: post.category || "",
          author: post.author || "",
          coverImageUrl: post.coverImageUrl || "",
          isPublished: post.isPublished,
          titleMn: post.titleMn || "",
          summaryMn: post.summaryMn || "",
          contentMn: post.contentMn || "",
          categoryMn: post.categoryMn || "",
        }
      : emptyForm()
  );
  const [mnEdited, setMnEdited] = useState(false);

  const invalidate = () => {
    utils.admin.blog.list.invalidate();
    utils.blog.list.invalidate();
    utils.admin.stats.invalidate();
  };

  const createMutation = trpc.admin.blog.create.useMutation({
    onSuccess: () => {
      invalidate();
      toast.success("Post created and translated");
      onBack();
    },
    onError: (err) => toast.error(`Failed to create: ${err.message}`),
  });

  const updateMutation = trpc.admin.blog.update.useMutation({
    onSuccess: () => {
      invalidate();
      toast.success("Post updated");
      onBack();
    },
    onError: (err) => toast.error(`Failed to update: ${err.message}`),
  });

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.content.trim()) {
      toast.error("Content is required");
      return;
    }

    const payload = {
      title: form.title,
      summary: form.summary || undefined,
      content: form.content,
      category: form.category || undefined,
      author: form.author || undefined,
      coverImageUrl: form.coverImageUrl || undefined,
      isPublished: form.isPublished,
      // Only pass MN fields if admin manually edited them
      titleMn: mnEdited && form.titleMn ? form.titleMn : undefined,
      summaryMn: mnEdited && form.summaryMn ? form.summaryMn : undefined,
      contentMn: mnEdited && form.contentMn ? form.contentMn : undefined,
      categoryMn: mnEdited && form.categoryMn ? form.categoryMn : undefined,
      skipAutoTranslate: mnEdited,
    };

    if (post) {
      updateMutation.mutate({ id: post.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const setField = (key: keyof PostForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setMnField = (key: keyof PostForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setMnEdited(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            All Posts
          </Button>
          <div>
            <h1
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post ? "Edit Post" : "New Post"}
            </h1>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {post ? `Editing: ${post.title}` : "Write a new News & Updates post"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={form.isPublished}
              onCheckedChange={(v) => setField("isPublished", v)}
              id="publish-toggle"
            />
            <Label htmlFor="publish-toggle" className="text-sm cursor-pointer">
              {form.isPublished ? (
                <span className="text-green-600 font-medium">Published</span>
              ) : (
                <span className="text-muted-foreground">Draft</span>
              )}
            </Label>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-lotus-green hover:bg-lotus-green/90 gap-2"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving & Translating..." : "Save Post"}
          </Button>
        </div>
      </div>

      {/* Translation info */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
        <Languages className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
        <p className="text-sm text-orange-800">
          English content is auto-translated to Mongolian when you save. You can review and edit the Mongolian
          translation in the МН fields below each English field.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="space-y-3 border border-border/40 rounded-lg p-4 bg-muted/10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label>Title</Label>
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 text-blue-600 border-blue-300">EN</Badge>
              </div>
              <Input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Post title"
                className="text-base font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Mongolian title</Label>
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 text-orange-600 border-orange-300">МН</Badge>
              </div>
              <Input
                value={form.titleMn}
                onChange={(e) => setMnField("titleMn", e.target.value)}
                placeholder="Auto-translated on save"
                className="bg-orange-50/30 border-orange-200/50"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-3 border border-border/40 rounded-lg p-4 bg-muted/10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label>Summary</Label>
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 text-blue-600 border-blue-300">EN</Badge>
                <span className="text-xs text-muted-foreground ml-auto">Shown on the blog listing card</span>
              </div>
              <Textarea
                value={form.summary}
                onChange={(e) => setField("summary", e.target.value)}
                placeholder="Brief summary shown on the blog card (1–2 sentences)"
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Mongolian summary</Label>
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 text-orange-600 border-orange-300">МН</Badge>
              </div>
              <Textarea
                value={form.summaryMn}
                onChange={(e) => setMnField("summaryMn", e.target.value)}
                placeholder="Auto-translated on save"
                rows={2}
                className="bg-orange-50/30 border-orange-200/50"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3 border border-border/40 rounded-lg p-4 bg-muted/10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label>Content</Label>
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 text-blue-600 border-blue-300">EN</Badge>
                <span className="text-xs text-muted-foreground ml-auto">Full article body</span>
              </div>
              <Textarea
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
                placeholder="Write the full article here. Use blank lines to separate paragraphs."
                rows={16}
                className="font-mono text-sm leading-relaxed"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Mongolian content</Label>
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 text-orange-600 border-orange-300">МН</Badge>
              </div>
              <Textarea
                value={form.contentMn}
                onChange={(e) => setMnField("contentMn", e.target.value)}
                placeholder="Auto-translated on save — review and correct here"
                rows={16}
                className="font-mono text-sm leading-relaxed bg-orange-50/30 border-orange-200/50"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Cover image */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <CoverImageUpload
                value={form.coverImageUrl}
                onChange={(url) => setField("coverImageUrl", url)}
              />
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Author */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <Label className="text-sm">Author</Label>
                </div>
                <Input
                  value={form.author}
                  onChange={(e) => setField("author", e.target.value)}
                  placeholder="e.g. Loes A"
                />
              </div>

              {/* Category */}
              <div className="space-y-3 border border-border/30 rounded-md p-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    <Label className="text-sm">Category</Label>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 text-blue-600 border-blue-300">EN</Badge>
                  </div>
                  <Input
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                    placeholder="e.g. Projects, Education"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">Mongolian category</Label>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 text-orange-600 border-orange-300">МН</Badge>
                  </div>
                  <Input
                    value={form.categoryMn}
                    onChange={(e) => setMnField("categoryMn", e.target.value)}
                    placeholder="Auto-translated on save"
                    className="bg-orange-50/30 border-orange-200/50"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="pt-1 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <Label className="text-sm">Status</Label>
                  </div>
                  <Badge
                    variant={form.isPublished ? "default" : "secondary"}
                    className={form.isPublished ? "bg-green-600" : ""}
                  >
                    {form.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                {post?.publishedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Published {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Translation note */}
          {mnEdited && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
              <strong>Manual MN edits detected.</strong> Your Mongolian text will be saved as-is without
              auto-translation overwriting it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Post List ───────────────────────────────────────────────

function PostList({ onEdit, onCreate }: { onEdit: (post: BlogPost) => void; onCreate: () => void }) {
  const { data: posts, isLoading } = trpc.admin.blog.list.useQuery();
  const utils = trpc.useUtils();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const toggleMutation = trpc.admin.blog.togglePublish.useMutation({
    onSuccess: () => {
      utils.admin.blog.list.invalidate();
      utils.blog.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.blog.delete.useMutation({
    onSuccess: () => {
      utils.admin.blog.list.invalidate();
      utils.blog.list.invalidate();
      utils.admin.stats.invalidate();
      setDeleteId(null);
      toast.success("Post deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const postList = (posts || []) as BlogPost[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Blog Posts
          </h1>
          <p className="text-sm text-muted-foreground mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Manage News & Updates posts. Published posts appear on the public website.
          </p>
        </div>
        <Button onClick={onCreate} className="bg-lotus-green hover:bg-lotus-green/90 gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-foreground">{postList.length}</div>
            <div className="text-xs text-muted-foreground">Total Posts</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-green-600">
              {postList.filter((p) => p.isPublished).length}
            </div>
            <div className="text-xs text-muted-foreground">Published</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-amber-600">
              {postList.filter((p) => !p.isPublished).length}
            </div>
            <div className="text-xs text-muted-foreground">Drafts</div>
          </CardContent>
        </Card>
      </div>

      {/* Post list */}
      {postList.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-lg">
          <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No posts yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Click "New Post" to write your first News & Updates article
          </p>
          <Button onClick={onCreate} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Create First Post
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {postList.map((post) => (
            <Card key={post.id} className="border-border/50 hover:border-border transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Cover thumbnail */}
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-20 h-16 object-cover rounded-md shrink-0 hidden sm:block"
                    />
                  ) : (
                    <div className="w-20 h-16 bg-muted rounded-md shrink-0 hidden sm:flex items-center justify-center">
                      <FileText className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  )}

                  {/* Post info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="min-w-0">
                        <h3
                          className="font-semibold text-foreground truncate"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {post.title}
                        </h3>
                        {post.summary && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                            {post.summary}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={post.isPublished ? "default" : "secondary"}
                        className={`shrink-0 ${post.isPublished ? "bg-green-600" : ""}`}
                      >
                        {post.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </span>
                      )}
                      {post.category && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {post.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.titleMn && (
                        <span className="flex items-center gap-1 text-orange-600">
                          <Languages className="h-3 w-3" />
                          MN translated
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toggleMutation.mutate({ id: post.id, isPublished: !post.isPublished })
                      }
                      disabled={toggleMutation.isPending}
                      title={post.isPublished ? "Unpublish" : "Publish"}
                      className="h-8 w-8 p-0"
                    >
                      {post.isPublished ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(post)}
                      title="Edit"
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(post.id)}
                      title="Delete"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId !== null && deleteMutation.mutate({ id: deleteId })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export default function AdminBlogPosts() {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setView("edit");
  };

  const handleCreate = () => {
    setEditingPost(null);
    setView("create");
  };

  const handleBack = () => {
    setEditingPost(null);
    setView("list");
  };

  if (view === "list") {
    return <PostList onEdit={handleEdit} onCreate={handleCreate} />;
  }

  return (
    <PostEditor
      post={view === "edit" ? editingPost : null}
      onBack={handleBack}
    />
  );
}
