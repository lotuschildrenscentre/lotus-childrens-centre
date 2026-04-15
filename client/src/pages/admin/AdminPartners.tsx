/*
 * Admin: Our Partners
 * Full CRUD for the partners/sponsors shown in the public marquee section.
 * Admin can add unlimited partners, upload logos, set website links, reorder, and toggle visibility.
 */
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Loader2,
  Handshake,
  GripVertical,
  Globe,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

type Partner = {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
};

type PartnerFormData = {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyForm = (): PartnerFormData => ({
  name: "",
  logoUrl: "",
  websiteUrl: "",
  sortOrder: 0,
  isActive: true,
});

function LogoUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadMutation = trpc.admin.partners.uploadLogo.useMutation({
    onSuccess: (data) => {
      onChange(data.url);
      toast.success("Logo uploaded successfully");
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
    onSettled: () => setUploading(false),
  });

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo must be under 5MB");
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
      <Label className="text-sm font-medium">Partner Logo</Label>
      {value && (
        <div className="relative group w-32 h-20 rounded-lg overflow-hidden border bg-white flex items-center justify-center p-2">
          <img src={value} alt="Logo preview" className="max-w-full max-h-full object-contain" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Logo URL or upload a file"
          className="flex-1 text-sm"
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}

function PartnerFormDialog({
  open,
  onClose,
  initialData,
  onSave,
  isSaving,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  initialData: PartnerFormData;
  onSave: (data: PartnerFormData) => void;
  isSaving: boolean;
  title: string;
  description: string;
}) {
  const [form, setForm] = useState<PartnerFormData>(initialData);

  // Reset form when dialog opens with new initialData
  const prevOpen = useRef(false);
  if (open && !prevOpen.current) {
    prevOpen.current = true;
    // Only reset if the form is stale
  }
  if (!open && prevOpen.current) {
    prevOpen.current = false;
  }

  // Sync form when initialData changes (e.g., editing different partner)
  const prevInitialRef = useRef(initialData);
  if (prevInitialRef.current !== initialData) {
    prevInitialRef.current = initialData;
    // We can't call setState here directly, so we'll use a key on the dialog
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Playfair Display', serif" }}>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Partner Name */}
          <div className="space-y-1.5">
            <Label htmlFor="partner-name" className="text-sm font-medium">
              Partner / Organisation Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="partner-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Gulf for Good"
            />
          </div>

          {/* Logo */}
          <LogoUploadField
            value={form.logoUrl}
            onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
          />

          {/* Website URL */}
          <div className="space-y-1.5">
            <Label htmlFor="partner-website" className="text-sm font-medium">
              Website URL <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="partner-website"
                value={form.websiteUrl}
                onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                placeholder="https://example.com"
                className="pl-9"
              />
            </div>
          </div>

          {/* Sort Order */}
          <div className="space-y-1.5">
            <Label htmlFor="partner-order" className="text-sm font-medium">
              Sort Order
            </Label>
            <Input
              id="partner-order"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              className="w-32"
            />
            <p className="text-xs text-muted-foreground">Lower numbers appear first in the marquee.</p>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
            <Switch
              id="partner-active"
              checked={form.isActive}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            />
            <div>
              <Label htmlFor="partner-active" className="text-sm font-medium cursor-pointer">
                Show on website
              </Label>
              <p className="text-xs text-muted-foreground">
                {form.isActive ? "Visible in the partners marquee" : "Hidden from the public website"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(form)}
            disabled={isSaving || !form.name.trim() || !form.logoUrl.trim()}
            className="bg-lotus-green hover:bg-lotus-green/90"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Partner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPartners() {
  const utils = trpc.useUtils();
  const { data: partners, isLoading } = trpc.admin.partners.list.useQuery();

  const [addOpen, setAddOpen] = useState(false);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addFormKey, setAddFormKey] = useState(0);

  const createMutation = trpc.admin.partners.create.useMutation({
    onSuccess: () => {
      utils.admin.partners.list.invalidate();
      utils.partners.list.invalidate();
      setAddOpen(false);
      setAddFormKey((k) => k + 1);
      toast.success("Partner added successfully");
    },
    onError: (e) => toast.error(`Failed to add partner: ${e.message}`),
  });

  const updateMutation = trpc.admin.partners.update.useMutation({
    onSuccess: () => {
      utils.admin.partners.list.invalidate();
      utils.partners.list.invalidate();
      setEditPartner(null);
      toast.success("Partner updated");
    },
    onError: (e) => toast.error(`Failed to update: ${e.message}`),
  });

  const deleteMutation = trpc.admin.partners.delete.useMutation({
    onSuccess: () => {
      utils.admin.partners.list.invalidate();
      utils.partners.list.invalidate();
      setDeleteId(null);
      toast.success("Partner deleted");
    },
    onError: (e) => toast.error(`Failed to delete: ${e.message}`),
  });

  const toggleActiveMutation = trpc.admin.partners.update.useMutation({
    onSuccess: () => {
      utils.admin.partners.list.invalidate();
      utils.partners.list.invalidate();
    },
    onError: (e) => toast.error(`Failed to update: ${e.message}`),
  });

  const handleCreate = (data: PartnerFormData) => {
    createMutation.mutate({
      name: data.name,
      logoUrl: data.logoUrl,
      websiteUrl: data.websiteUrl || null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    });
  };

  const handleUpdate = (data: PartnerFormData) => {
    if (!editPartner) return;
    updateMutation.mutate({
      id: editPartner.id,
      name: data.name,
      logoUrl: data.logoUrl,
      websiteUrl: data.websiteUrl || null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    });
  };

  const handleToggleActive = (partner: Partner) => {
    toggleActiveMutation.mutate({ id: partner.id, isActive: !partner.isActive });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Partners
          </h1>
          <p className="text-muted-foreground mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Manage the partner logos shown in the scrolling marquee on the homepage.
            Add as many partners as you like — they appear in sort order.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-lotus-green hover:bg-lotus-green/90 gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
        <Handshake className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <strong>Dynamic Partners:</strong> Partners added here will appear in the scrolling marquee
          on the homepage. Toggle visibility with the eye icon to show or hide individual partners
          without deleting them. Use Sort Order to control the display sequence.
        </div>
      </div>

      {/* Partners list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : !partners || partners.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Handshake className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3
              className="text-lg font-semibold text-foreground mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No partners yet
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              The homepage currently shows the default partner logos. Add your first partner to
              replace them with your own custom list.
            </p>
            <Button
              onClick={() => setAddOpen(true)}
              className="bg-lotus-green hover:bg-lotus-green/90 gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Partner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {partners.map((partner) => (
            <Card
              key={partner.id}
              className={`transition-all ${!partner.isActive ? "opacity-60" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Drag handle (visual only) */}
                  <GripVertical className="h-5 w-5 text-muted-foreground/40 shrink-0 cursor-grab" />

                  {/* Logo preview */}
                  <div className="w-16 h-12 bg-white rounded-lg border flex items-center justify-center p-1.5 shrink-0">
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Partner info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-semibold text-foreground truncate"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {partner.name}
                      </span>
                      <Badge
                        variant={partner.isActive ? "default" : "secondary"}
                        className={`text-xs ${partner.isActive ? "bg-lotus-green/10 text-lotus-green border-lotus-green/30" : ""}`}
                      >
                        {partner.isActive ? "Visible" : "Hidden"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Order: {partner.sortOrder}
                      </Badge>
                    </div>
                    {partner.websiteUrl && (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-lotus-green hover:underline mt-0.5 block truncate"
                      >
                        {partner.websiteUrl}
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={partner.isActive ? "Hide from website" : "Show on website"}
                      onClick={() => handleToggleActive(partner)}
                      disabled={toggleActiveMutation.isPending}
                    >
                      {partner.isActive ? (
                        <Eye className="h-4 w-4 text-lotus-green" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Edit partner"
                      onClick={() => setEditPartner(partner)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Delete partner"
                      onClick={() => setDeleteId(partner.id)}
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

      {/* Stats footer */}
      {partners && partners.length > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
              <span>
                <strong className="text-foreground">{partners.length}</strong> total partners
              </span>
              <span>
                <strong className="text-foreground">{partners.filter((p) => p.isActive).length}</strong> visible
              </span>
              <span>
                <strong className="text-foreground">{partners.filter((p) => !p.isActive).length}</strong> hidden
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Partner Dialog */}
      <PartnerFormDialog
        key={`add-${addFormKey}`}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        initialData={emptyForm()}
        onSave={handleCreate}
        isSaving={createMutation.isPending}
        title="Add New Partner"
        description="Add a partner or sponsor to the homepage marquee. Upload their logo and optionally link to their website."
      />

      {/* Edit Partner Dialog */}
      {editPartner && (
        <PartnerFormDialog
          key={`edit-${editPartner.id}`}
          open={!!editPartner}
          onClose={() => setEditPartner(null)}
          initialData={{
            name: editPartner.name,
            logoUrl: editPartner.logoUrl,
            websiteUrl: editPartner.websiteUrl ?? "",
            sortOrder: editPartner.sortOrder,
            isActive: editPartner.isActive,
          }}
          onSave={handleUpdate}
          isSaving={updateMutation.isPending}
          title="Edit Partner"
          description="Update the partner's details, logo, or visibility."
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partner?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the partner from the homepage marquee. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId !== null && deleteMutation.mutate({ id: deleteId })}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
