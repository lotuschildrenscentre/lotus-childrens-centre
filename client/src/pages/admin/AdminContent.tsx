import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, FileText } from "lucide-react";

const PAGE_OPTIONS = [
  { value: "home", label: "Home Page" },
  { value: "about", label: "About Page" },
  { value: "get-involved", label: "Get Involved Page" },
  { value: "blog", label: "News & Updates" },
  { value: "contact", label: "Contact Section" },
];

type ContentForm = {
  pageKey: string;
  sectionKey: string;
  title: string;
  content: string;
};

const emptyForm: ContentForm = {
  pageKey: "home",
  sectionKey: "",
  title: "",
  content: "",
};

export default function AdminContent() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ContentForm>(emptyForm);
  const [filterPage, setFilterPage] = useState<string>("all");

  const utils = trpc.useUtils();
  const { data: allContent, isLoading } = trpc.admin.content.list.useQuery();

  const upsertMutation = trpc.admin.content.upsert.useMutation({
    onSuccess: () => {
      utils.admin.content.list.invalidate();
      setShowForm(false);
      setForm(emptyForm);
      toast.success("Content saved");
    },
  });

  const filteredContent = useMemo(() => {
    if (!allContent) return [];
    if (filterPage === "all") return allContent;
    return allContent.filter((c) => c.pageKey === filterPage);
  }, [allContent, filterPage]);

  const handleSubmit = () => {
    if (!form.pageKey || !form.sectionKey) {
      toast.error("Page and section key are required");
      return;
    }
    upsertMutation.mutate(form);
  };

  const handleEdit = (item: {
    pageKey: string;
    sectionKey: string;
    title: string | null;
    content: string | null;
  }) => {
    setForm({
      pageKey: item.pageKey,
      sectionKey: item.sectionKey,
      title: item.title || "",
      content: item.content || "",
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Page Content
          </h1>
          <p
            className="text-muted-foreground mt-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Manage editable content sections across the website
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterPage} onValueChange={setFilterPage}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              {PAGE_OPTIONS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setForm(emptyForm);
              setShowForm(true);
            }}
            className="bg-lotus-green hover:bg-lotus-green/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Content
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : !filteredContent.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No content entries yet. Add your first content block!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContent.map((item) => {
            const pageLabel =
              PAGE_OPTIONS.find((p) => p.value === item.pageKey)?.label || item.pageKey;
            return (
              <Card key={`${item.pageKey}-${item.sectionKey}`} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {pageLabel}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-base">{item.sectionKey}</CardTitle>
                </CardHeader>
                <CardContent>
                  {item.title && (
                    <p className="font-medium text-sm mb-1">{item.title}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.content || "No content"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated: {new Date(item.updatedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {form.sectionKey ? "Edit Content" : "Add New Content"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Page *</Label>
              <Select
                value={form.pageKey}
                onValueChange={(value) => setForm({ ...form, pageKey: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_OPTIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Section Key *</Label>
              <Input
                value={form.sectionKey}
                onChange={(e) => setForm({ ...form, sectionKey: e.target.value })}
                placeholder="e.g. hero-title, about-description"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unique identifier for this content block within the page
              </p>
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Section title"
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Section content..."
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-lotus-green hover:bg-lotus-green/90"
                disabled={upsertMutation.isPending}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
