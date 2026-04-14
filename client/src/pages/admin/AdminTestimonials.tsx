import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, User, GripVertical, RefreshCw, CheckCircle2 } from "lucide-react";

type TestimonialForm = {
  name: string;
  nameMn: string;
  duration: string;
  durationMn: string;
  quote: string;
  quoteMn: string;
  isPublished: boolean;
  sortOrder: number;
};

const emptyForm: TestimonialForm = {
  name: "",
  nameMn: "",
  duration: "",
  durationMn: "",
  quote: "",
  quoteMn: "",
  isPublished: true,
  sortOrder: 0,
};

/** Orange-tinted read-only MN field shown below each EN input */
function MnField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="mt-1">
      <div className="flex items-center gap-1 mb-1">
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 border-orange-400 text-orange-600 bg-orange-50"
        >
          МН
        </Badge>
        <span className="text-xs text-muted-foreground">{label}</span>
        {value && (
          <span className="text-xs text-green-600 flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" /> Translated
          </span>
        )}
      </div>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Mongolian translation will appear here after saving…"
          rows={3}
          className="bg-orange-50/60 border-orange-200 text-sm"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Mongolian translation will appear here after saving…"
          className="bg-orange-50/60 border-orange-200 text-sm"
        />
      )}
    </div>
  );
}

export default function AdminTestimonials() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [retranslatingId, setRetranslatingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: testimonials, isLoading } = trpc.admin.testimonials.list.useQuery();

  const createMutation = trpc.admin.testimonials.create.useMutation({
    onSuccess: () => {
      utils.admin.testimonials.list.invalidate();
      utils.admin.stats.invalidate();
      setShowForm(false);
      setForm(emptyForm);
      toast.success("Testimonial created with Mongolian translation");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.testimonials.update.useMutation({
    onSuccess: () => {
      utils.admin.testimonials.list.invalidate();
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      toast.success("Testimonial updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.testimonials.delete.useMutation({
    onSuccess: () => {
      utils.admin.testimonials.list.invalidate();
      utils.admin.stats.invalidate();
      setDeleteId(null);
      toast.success("Testimonial deleted");
    },
  });

  const retranslateMutation = trpc.admin.testimonials.retranslate.useMutation({
    onSuccess: () => {
      utils.admin.testimonials.list.invalidate();
      setRetranslatingId(null);
      toast.success("Mongolian translation regenerated");
    },
    onError: (err) => {
      setRetranslatingId(null);
      toast.error(err.message);
    },
  });

  const handleSubmit = () => {
    if (!form.name || !form.duration || !form.quote) {
      toast.error("Please fill in all required fields");
      return;
    }
    // Pass explicit MN values so the server uses them instead of re-translating
    const payload = {
      name: form.name,
      nameMn: form.nameMn || undefined,
      duration: form.duration,
      durationMn: form.durationMn || undefined,
      quote: form.quote,
      quoteMn: form.quoteMn || undefined,
      isPublished: form.isPublished,
      sortOrder: form.sortOrder,
      // Skip auto-translate only if admin has manually filled all MN fields
      skipAutoTranslate: !!(form.nameMn && form.durationMn && form.quoteMn),
    };
    if (editId) {
      updateMutation.mutate({ id: editId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (t: {
    id: number;
    name: string;
    nameMn?: string | null;
    duration: string;
    durationMn?: string | null;
    quote: string;
    quoteMn?: string | null;
    isPublished: boolean;
    sortOrder: number;
  }) => {
    setEditId(t.id);
    setForm({
      name: t.name,
      nameMn: t.nameMn ?? "",
      duration: t.duration,
      durationMn: t.durationMn ?? "",
      quote: t.quote,
      quoteMn: t.quoteMn ?? "",
      isPublished: t.isPublished,
      sortOrder: t.sortOrder,
    });
    setShowForm(true);
  };

  const handleRetranslate = (id: number) => {
    setRetranslatingId(id);
    retranslateMutation.mutate({ id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Volunteer Testimonials
          </h1>
          <p
            className="text-muted-foreground mt-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Manage stories from volunteers. Mongolian translations are auto-generated on save.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="bg-lotus-green hover:bg-lotus-green/90 gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : !testimonials?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No testimonials yet. Add your first volunteer story!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => {
            const hasMn = !!(t.nameMn && t.durationMn && t.quoteMn);
            return (
              <Card key={t.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 pt-1 text-muted-foreground">
                      <GripVertical className="h-4 w-4" />
                      <div className="w-10 h-10 rounded-full bg-lotus-purple/10 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-lotus-purple" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{t.name}</h3>
                        {t.nameMn && (
                          <span className="text-sm text-orange-600">/ {t.nameMn}</span>
                        )}
                        <span className="text-sm text-muted-foreground">· {t.duration}</span>
                        {!t.isPublished && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                        {hasMn ? (
                          <Badge variant="outline" className="text-[10px] border-green-400 text-green-700 bg-green-50">
                            МН ✓
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] border-orange-300 text-orange-600 bg-orange-50">
                            МН missing
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground italic mt-1 line-clamp-2 text-sm">
                        "{t.quote}"
                      </p>
                      {t.quoteMn && (
                        <p className="text-orange-700/70 italic mt-0.5 line-clamp-2 text-xs">
                          "{t.quoteMn}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        title="Re-translate to Mongolian"
                        disabled={retranslatingId === t.id}
                        onClick={() => handleRetranslate(t.id)}
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${retranslatingId === t.id ? "animate-spin" : ""}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(t)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(t.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Mongolian translations are auto-generated when you save. You can review and correct them in the МН fields below.
            </p>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            {/* Name */}
            <div>
              <Label>
                Volunteer Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Antoine"
              />
              <MnField
                label="Mongolian translation"
                value={form.nameMn}
                onChange={(v) => setForm({ ...form, nameMn: v })}
              />
            </div>

            {/* Duration */}
            <div>
              <Label>
                Duration <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 2 weeks, Summer 2017"
              />
              <MnField
                label="Mongolian translation"
                value={form.durationMn}
                onChange={(v) => setForm({ ...form, durationMn: v })}
              />
            </div>

            {/* Quote */}
            <div>
              <Label>
                Quote / Story <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                placeholder="Their experience at Lotus…"
                rows={4}
              />
              <MnField
                label="Mongolian translation"
                value={form.quoteMn}
                onChange={(v) => setForm({ ...form, quoteMn: v })}
                multiline
              />
            </div>

            {/* Sort order + published */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>
              <div className="flex items-end gap-3 pb-1">
                <Switch
                  checked={form.isPublished}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isPublished: checked })
                  }
                />
                <Label>Published</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-lotus-green hover:bg-lotus-green/90"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving & translating…"
                  : editId
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this testimonial? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
