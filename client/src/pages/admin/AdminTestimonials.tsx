import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, User, GripVertical } from "lucide-react";

type TestimonialForm = {
  name: string;
  duration: string;
  quote: string;
  isPublished: boolean;
  sortOrder: number;
};

const emptyForm: TestimonialForm = {
  name: "",
  duration: "",
  quote: "",
  isPublished: true,
  sortOrder: 0,
};

export default function AdminTestimonials() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: testimonials, isLoading } = trpc.admin.testimonials.list.useQuery();

  const createMutation = trpc.admin.testimonials.create.useMutation({
    onSuccess: () => {
      utils.admin.testimonials.list.invalidate();
      utils.admin.stats.invalidate();
      setShowForm(false);
      setForm(emptyForm);
      toast.success("Testimonial created");
    },
  });

  const updateMutation = trpc.admin.testimonials.update.useMutation({
    onSuccess: () => {
      utils.admin.testimonials.list.invalidate();
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      toast.success("Testimonial updated");
    },
  });

  const deleteMutation = trpc.admin.testimonials.delete.useMutation({
    onSuccess: () => {
      utils.admin.testimonials.list.invalidate();
      utils.admin.stats.invalidate();
      setDeleteId(null);
      toast.success("Testimonial deleted");
    },
  });

  const handleSubmit = () => {
    if (!form.name || !form.duration || !form.quote) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (editId) {
      updateMutation.mutate({ id: editId, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (t: {
    id: number;
    name: string;
    duration: string;
    quote: string;
    isPublished: boolean;
    sortOrder: number;
  }) => {
    setEditId(t.id);
    setForm({
      name: t.name,
      duration: t.duration,
      quote: t.quote,
      isPublished: t.isPublished,
      sortOrder: t.sortOrder,
    });
    setShowForm(true);
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
            Manage stories from volunteers displayed on the About page
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
          {testimonials.map((t) => (
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{t.name}</h3>
                      <span className="text-sm text-muted-foreground">· {t.duration}</span>
                      {!t.isPublished && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground italic mt-1 line-clamp-2">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
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
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Volunteer Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Antoine"
              />
            </div>
            <div>
              <Label>Duration *</Label>
              <Input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 2 weeks, Summer 2017"
              />
            </div>
            <div>
              <Label>Quote / Story *</Label>
              <Textarea
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                placeholder="Their experience at Lotus..."
                rows={4}
              />
            </div>
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
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isPublished: checked })
                }
              />
              <Label>Published (visible on website)</Label>
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
                {editId ? "Update" : "Create"}
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
