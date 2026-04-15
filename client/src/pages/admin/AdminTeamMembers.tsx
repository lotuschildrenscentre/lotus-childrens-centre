import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Plus, Pencil, Trash2, RefreshCw, Users } from "lucide-react";

const COLOR_OPTIONS = [
  { value: "bg-lotus-green", label: "Green" },
  { value: "bg-lotus-gold", label: "Gold" },
  { value: "bg-lotus-terracotta", label: "Terracotta" },
  { value: "bg-lotus-sage", label: "Sage" },
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-purple-500", label: "Purple" },
];

type TeamMember = {
  id: number;
  name: string;
  nameMn: string | null;
  role: string;
  roleMn: string | null;
  photoUrl: string | null;
  color: string;
  sortOrder: number;
  isActive: boolean;
};

type FormState = {
  name: string;
  nameMn: string;
  role: string;
  roleMn: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyForm: FormState = {
  name: "",
  nameMn: "",
  role: "",
  roleMn: "",
  color: "bg-lotus-green",
  sortOrder: 0,
  isActive: true,
};

export default function AdminTeamMembers() {
  const utils = trpc.useUtils();

  const { data: members = [], isLoading } = trpc.admin.team.list.useQuery();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [retranslatingId, setRetranslatingId] = useState<number | null>(null);

  const createMutation = trpc.admin.team.create.useMutation({
    onSuccess: () => {
      utils.admin.team.list.invalidate();
      utils.team.list.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
      toast.success("Team member added — Mongolian translation generated automatically.");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.admin.team.update.useMutation({
    onSuccess: () => {
      utils.admin.team.list.invalidate();
      utils.team.list.invalidate();
      setDialogOpen(false);
      setEditingMember(null);
      setForm(emptyForm);
      toast.success("Team member updated successfully.");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.team.delete.useMutation({
    onSuccess: () => {
      utils.admin.team.list.invalidate();
      utils.team.list.invalidate();
      setDeleteId(null);
      toast.success("Team member deleted.");
    },
    onError: (e) => toast.error(e.message),
  });

  const retranslateMutation = trpc.admin.team.retranslate.useMutation({
    onSuccess: (data, variables) => {
      utils.admin.team.list.invalidate();
      utils.team.list.invalidate();
      setRetranslatingId(null);
      toast.success("Mongolian translation updated.");
    },
    onError: (e) => {
      setRetranslatingId(null);
      toast.error(e.message);
    },
  });

  const openCreate = () => {
    setEditingMember(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      nameMn: member.nameMn ?? "",
      role: member.role,
      roleMn: member.roleMn ?? "",
      color: member.color,
      sortOrder: member.sortOrder,
      isActive: member.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.role.trim()) {
      toast.error("Name and Role are required.");
      return;
    }
    if (editingMember) {
      updateMutation.mutate({
        id: editingMember.id,
        ...form,
        nameMn: form.nameMn || undefined,
        roleMn: form.roleMn || undefined,
        skipAutoTranslate: !!(form.nameMn && form.roleMn),
      });
    } else {
      createMutation.mutate({
        ...form,
        nameMn: form.nameMn || undefined,
        roleMn: form.roleMn || undefined,
        skipAutoTranslate: !!(form.nameMn && form.roleMn),
      });
    }
  };

  const handleRetranslate = (id: number) => {
    setRetranslatingId(id);
    retranslateMutation.mutate({ id });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-lotus-green" />
            Team Members
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage the "Meet Our Dedicated Team" section on the About page. Add as many members as you like.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-lotus-green hover:bg-lotus-green/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {/* Members list */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading team members...</div>
      ) : members.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">No team members yet</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Member" to add your first team member.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <Card key={member.id} className={`border ${!member.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Color swatch / avatar */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${member.color}`}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name & role */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{member.name}</span>
                      {member.nameMn && (
                        <span className="text-sm text-muted-foreground">/ {member.nameMn}</span>
                      )}
                      {!member.isActive && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">Hidden</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {member.role}
                      {member.roleMn && (
                        <span className="ml-2 text-xs">/ {member.roleMn}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {member.nameMn && member.roleMn ? (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-300 bg-green-50">
                          МН ✓
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-orange-600 border-orange-300 bg-orange-50">
                          МН missing
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetranslate(member.id)}
                      disabled={retranslatingId === member.id}
                      title="Re-translate to Mongolian"
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${retranslatingId === member.id ? "animate-spin" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(member)}
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(member.id)}
                      title="Delete"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setDialogOpen(false); setEditingMember(null); setForm(emptyForm); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name EN */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Name
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-300 bg-blue-50">EN</Badge>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Didi Ananda Kalika"
              />
            </div>

            {/* Name MN */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Name — Mongolian translation
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-300 bg-orange-50">МН</Badge>
              </Label>
              <Input
                value={form.nameMn}
                onChange={(e) => setForm((f) => ({ ...f, nameMn: e.target.value }))}
                placeholder="Auto-generated on save if left empty"
                className="bg-orange-50/30 border-orange-200"
              />
            </div>

            {/* Role EN */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Role / Title
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-300 bg-blue-50">EN</Badge>
              </Label>
              <Input
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="e.g. Director"
              />
            </div>

            {/* Role MN */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Role — Mongolian translation
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-300 bg-orange-50">МН</Badge>
              </Label>
              <Input
                value={form.roleMn}
                onChange={(e) => setForm((f) => ({ ...f, roleMn: e.target.value }))}
                placeholder="Auto-generated on save if left empty"
                className="bg-orange-50/30 border-orange-200"
              />
            </div>

            {/* Color */}
            <div className="space-y-1">
              <Label>Avatar Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                    className={`w-8 h-8 rounded-full ${c.value} border-2 transition-all ${
                      form.color === c.value ? "border-foreground scale-110" : "border-transparent"
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Sort order */}
            <div className="space-y-1">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min={0}
              />
              <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
              />
              <Label>Visible on website</Label>
            </div>

            <p className="text-xs text-muted-foreground bg-orange-50 border border-orange-200 rounded p-2">
              If the Mongolian fields are left empty, they will be auto-generated when you save.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); setEditingMember(null); setForm(emptyForm); }}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-lotus-green hover:bg-lotus-green/90 text-white"
            >
              {isSaving ? "Saving..." : editingMember ? "Save Changes" : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this team member from the website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId !== null && deleteMutation.mutate({ id: deleteId })}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
