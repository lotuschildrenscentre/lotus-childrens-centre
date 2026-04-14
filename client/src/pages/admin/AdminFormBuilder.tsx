import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  RefreshCw,
  CheckCircle2,
  Eye,
  Settings,
  ChevronUp,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

type FieldType = "text" | "email" | "textarea" | "select" | "date" | "tel";

type FieldForm = {
  fieldKey: string;
  fieldType: FieldType;
  label: string;
  labelMn: string;
  placeholder: string;
  placeholderMn: string;
  isRequired: boolean;
  isActive: boolean;
  sortOrder: number;
};

const emptyField: FieldForm = {
  fieldKey: "",
  fieldType: "text",
  label: "",
  labelMn: "",
  placeholder: "",
  placeholderMn: "",
  isRequired: false,
  isActive: true,
  sortOrder: 0,
};

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Short text",
  email: "Email address",
  textarea: "Long text",
  select: "Dropdown select",
  date: "Date picker",
  tel: "Phone number",
};

/** Orange-tinted MN field */
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
          rows={2}
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

/** Preview of a single form field */
function FieldPreview({
  label,
  placeholder,
  fieldType,
  isRequired,
}: {
  label: string;
  placeholder: string;
  fieldType: FieldType;
  isRequired: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-foreground">
        {label || "(no label)"}
        {isRequired && <span className="text-destructive ml-1">*</span>}
      </label>
      {fieldType === "textarea" ? (
        <textarea
          disabled
          placeholder={placeholder || "Enter your answer…"}
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground min-h-[80px] resize-none"
        />
      ) : fieldType === "select" ? (
        <select
          disabled
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
        >
          <option>{placeholder || "Select an option…"}</option>
        </select>
      ) : (
        <input
          disabled
          type={fieldType}
          placeholder={placeholder || "Enter your answer…"}
          className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
        />
      )}
    </div>
  );
}

export default function AdminFormBuilder() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FieldForm>(emptyField);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [retranslatingId, setRetranslatingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"builder" | "applications">("builder");

  // Intro text state
  const [introText, setIntroText] = useState("");
  const [introTextMn, setIntroTextMn] = useState("");
  const [introSaved, setIntroSaved] = useState(false);
  const [isRetranslatingIntro, setIsRetranslatingIntro] = useState(false);

  const utils = trpc.useUtils();
  const { data: fields, isLoading } = trpc.admin.form.fields.useQuery();
  const { data: applications, isLoading: appsLoading } = trpc.admin.form.applications.useQuery();
  const { data: settings } = trpc.admin.form.getSettings.useQuery();

  // Populate intro text fields when settings load (only if not dirty)
  const [introInitialized, setIntroInitialized] = useState(false);
  if (settings && !introInitialized) {
    setIntroText(settings.introText);
    setIntroTextMn(settings.introTextMn ?? "");
    setIntroInitialized(true);
  }

  const updateSettingsMutation = trpc.admin.form.updateSettings.useMutation({
    onSuccess: (data) => {
      utils.admin.form.getSettings.invalidate();
      utils.volunteerForm.settings.invalidate();
      if (data.introTextMn) setIntroTextMn(data.introTextMn);
      setIntroSaved(false);
      setIsRetranslatingIntro(false);
      toast.success("Form intro text saved with Mongolian translation");
    },
    onError: (err) => {
      setIsRetranslatingIntro(false);
      toast.error(err.message);
    },
  });

  const createMutation = trpc.admin.form.createField.useMutation({
    onSuccess: () => {
      utils.admin.form.fields.invalidate();
      setShowForm(false);
      setForm(emptyField);
      toast.success("Field created with Mongolian translation");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.form.updateField.useMutation({
    onSuccess: () => {
      utils.admin.form.fields.invalidate();
      setShowForm(false);
      setEditId(null);
      setForm(emptyField);
      toast.success("Field updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.form.deleteField.useMutation({
    onSuccess: () => {
      utils.admin.form.fields.invalidate();
      setDeleteId(null);
      toast.success("Field deleted");
    },
  });

  const reorderMutation = trpc.admin.form.reorderFields.useMutation({
    onSuccess: () => utils.admin.form.fields.invalidate(),
    onError: (err) => toast.error(err.message),
  });

  const retranslateMutation = trpc.admin.form.retranslateField.useMutation({
    onSuccess: () => {
      utils.admin.form.fields.invalidate();
      setRetranslatingId(null);
      toast.success("Mongolian translation regenerated");
    },
    onError: (err) => {
      setRetranslatingId(null);
      toast.error(err.message);
    },
  });

  const toggleActiveMutation = trpc.admin.form.updateField.useMutation({
    onSuccess: () => utils.admin.form.fields.invalidate(),
    onError: (err) => toast.error(err.message),
  });

  const updateStatusMutation = trpc.admin.form.updateApplicationStatus.useMutation({
    onSuccess: () => {
      utils.admin.form.applications.invalidate();
      toast.success("Status updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteAppMutation = trpc.admin.form.deleteApplication.useMutation({
    onSuccess: () => {
      utils.admin.form.applications.invalidate();
      toast.success("Application deleted");
    },
  });

  const handleSubmit = () => {
    if (!form.fieldKey || !form.label) {
      toast.error("Field key and label are required");
      return;
    }
    const payload = {
      fieldKey: form.fieldKey,
      fieldType: form.fieldType,
      label: form.label,
      labelMn: form.labelMn || undefined,
      placeholder: form.placeholder || undefined,
      placeholderMn: form.placeholderMn || undefined,
      isRequired: form.isRequired,
      isActive: form.isActive,
      sortOrder: form.sortOrder,
      skipAutoTranslate: !!(form.labelMn),
    };
    if (editId) {
      updateMutation.mutate({ id: editId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (f: {
    id: number;
    fieldKey: string;
    fieldType: FieldType;
    label: string;
    labelMn?: string | null;
    placeholder?: string | null;
    placeholderMn?: string | null;
    isRequired: boolean;
    isActive: boolean;
    sortOrder: number;
  }) => {
    setEditId(f.id);
    setForm({
      fieldKey: f.fieldKey,
      fieldType: f.fieldType,
      label: f.label,
      labelMn: f.labelMn ?? "",
      placeholder: f.placeholder ?? "",
      placeholderMn: f.placeholderMn ?? "",
      isRequired: f.isRequired,
      isActive: f.isActive,
      sortOrder: f.sortOrder,
    });
    setShowForm(true);
  };

  const handleMove = (id: number, direction: "up" | "down") => {
    if (!fields) return;
    const sorted = [...fields].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((f) => f.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === sorted.length - 1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const newOrder = sorted.map((f) => f.id);
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    reorderMutation.mutate({ orderedIds: newOrder });
  };

  const sortedFields = fields ? [...fields].sort((a, b) => a.sortOrder - b.sortOrder) : [];
  const activeFields = sortedFields.filter((f) => f.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Volunteer Application Form
          </h1>
          <p className="text-muted-foreground mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Configure the fields applicants see. Labels are auto-translated to Mongolian.
          </p>
        </div>
        {activeTab === "builder" && (
          <Button
            onClick={() => {
              setEditId(null);
              setForm({ ...emptyField, sortOrder: sortedFields.length });
              setShowForm(true);
            }}
            className="bg-lotus-green hover:bg-lotus-green/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "builder" | "applications")}>
        <TabsList>
          <TabsTrigger value="builder" className="gap-2">
            <Settings className="h-4 w-4" />
            Form Builder
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-2">
            <Eye className="h-4 w-4" />
            Applications
            {applications && applications.filter((a) => a.status === "pending").length > 0 && (
              <Badge className="ml-1 bg-lotus-orange text-white text-[10px] px-1.5 py-0">
                {applications.filter((a) => a.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Form Builder Tab ── */}
        <TabsContent value="builder" className="mt-4">

          {/* ── Intro Text Editor ── */}
          <Card className="mb-6 border-lotus-green/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                Form Introduction Text
                <span className="text-xs font-normal text-muted-foreground">(shown above the form fields)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">EN</span>
                  English
                </Label>
                <Textarea
                  value={introText}
                  onChange={(e) => { setIntroText(e.target.value); setIntroSaved(true); }}
                  placeholder="Please complete the form below and send it to volunteering@lotuschild.org"
                  className="resize-none text-sm"
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded">МН</span>
                  Mongolian translation
                  {introTextMn && <span className="text-green-600 text-[10px] ml-1">✓ Translated</span>}
                </Label>
                <Textarea
                  value={introTextMn}
                  onChange={(e) => { setIntroTextMn(e.target.value); setIntroSaved(true); }}
                  placeholder="Mongolian translation will appear here after saving..."
                  className="resize-none text-sm bg-orange-50/50 border-orange-200"
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  className="bg-lotus-green hover:bg-lotus-green/90 gap-1.5"
                  disabled={updateSettingsMutation.isPending || !introText.trim()}
                  onClick={() => updateSettingsMutation.mutate({ introText, introTextMn: introTextMn || undefined })}
                >
                  {updateSettingsMutation.isPending && !isRetranslatingIntro ? (
                    <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                  ) : (
                    <><CheckCircle2 className="h-3.5 w-3.5" /> Save Intro Text</>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  disabled={updateSettingsMutation.isPending || !introText.trim()}
                  onClick={() => {
                    setIsRetranslatingIntro(true);
                    updateSettingsMutation.mutate({ introText, skipAutoTranslate: false });
                  }}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRetranslatingIntro ? "animate-spin" : ""}`} />
                  Re-translate
                </Button>
                {introSaved && !updateSettingsMutation.isPending && (
                  <span className="text-xs text-amber-600">Unsaved changes</span>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Field list */}
            <div className="lg:col-span-3 space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Form Fields ({sortedFields.length} total, {activeFields.length} active)
              </h2>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : sortedFields.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">No fields yet. Add your first field to build the form.</p>
                  </CardContent>
                </Card>
              ) : (
                sortedFields.map((f, idx) => (
                  <Card
                    key={f.id}
                    className={`transition-all ${!f.isActive ? "opacity-50 border-dashed" : "hover:shadow-md"}`}
                  >
                    <CardContent className="py-3">
                      <div className="flex items-center gap-3">
                        {/* Reorder */}
                        <div className="flex flex-col gap-0.5 text-muted-foreground shrink-0">
                          <button
                            onClick={() => handleMove(f.id, "up")}
                            disabled={idx === 0}
                            className="hover:text-foreground disabled:opacity-30"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <GripVertical className="h-4 w-4" />
                          <button
                            onClick={() => handleMove(f.id, "down")}
                            disabled={idx === sortedFields.length - 1}
                            className="hover:text-foreground disabled:opacity-30"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground text-sm">{f.label}</span>
                            {f.labelMn && (
                              <span className="text-xs text-orange-600">/ {f.labelMn}</span>
                            )}
                            <Badge variant="outline" className="text-[10px]">
                              {FIELD_TYPE_LABELS[f.fieldType as FieldType]}
                            </Badge>
                            {f.isRequired && (
                              <Badge variant="outline" className="text-[10px] border-red-300 text-red-600">
                                Required
                              </Badge>
                            )}
                            {!f.isActive && (
                              <Badge variant="outline" className="text-[10px] border-muted text-muted-foreground">
                                Hidden
                              </Badge>
                            )}
                            {f.labelMn ? (
                              <Badge variant="outline" className="text-[10px] border-green-400 text-green-700 bg-green-50">
                                МН ✓
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] border-orange-300 text-orange-600 bg-orange-50">
                                МН missing
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            key: <code className="bg-muted px-1 rounded">{f.fieldKey}</code>
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            title={f.isActive ? "Hide field" : "Show field"}
                            onClick={() => toggleActiveMutation.mutate({ id: f.id, isActive: !f.isActive, skipAutoTranslate: true })}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            {f.isActive ? (
                              <ToggleRight className="h-4 w-4 text-lotus-green" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                          </button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Re-translate to Mongolian"
                            disabled={retranslatingId === f.id}
                            onClick={() => {
                              setRetranslatingId(f.id);
                              retranslateMutation.mutate({ id: f.id });
                            }}
                            className="text-orange-600 border-orange-300 hover:bg-orange-50 h-7 w-7 p-0"
                          >
                            <RefreshCw className={`h-3.5 w-3.5 ${retranslatingId === f.id ? "animate-spin" : ""}`} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(f as typeof f & { fieldType: FieldType })}
                            className="h-7 w-7 p-0"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive h-7 w-7 p-0"
                            onClick={() => setDeleteId(f.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Live preview */}
            <div className="lg:col-span-2">
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Live Form Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Intro text preview */}
                  {introText && (
                    <p className="text-sm text-muted-foreground pb-2 border-b border-border/50">
                      {introText}
                    </p>
                  )}
                  {activeFields.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Add active fields to see a preview
                    </p>
                  ) : (
                    activeFields.map((f) => (
                      <FieldPreview
                        key={f.id}
                        label={f.label}
                        placeholder={f.placeholder ?? ""}
                        fieldType={f.fieldType as FieldType}
                        isRequired={f.isRequired}
                      />
                    ))
                  )}
                  {activeFields.length > 0 && (
                    <button
                      disabled
                      className="w-full bg-lotus-green/80 text-white rounded-full py-2.5 text-sm font-semibold mt-2"
                    >
                      Submit Application
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── Applications Tab ── */}
        <TabsContent value="applications" className="mt-4">
          {appsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : !applications?.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No applications received yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const data = app.data as Record<string, string>;
                const nameField = data["fullName"] || data["name"] || Object.values(data)[0] || "Unknown";
                const emailField = data["email"] || "";
                return (
                  <Card key={app.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-semibold text-foreground">{nameField}</span>
                            {emailField && (
                              <span className="text-sm text-muted-foreground">{emailField}</span>
                            )}
                            <Badge
                              variant="outline"
                              className={
                                app.status === "pending"
                                  ? "border-yellow-400 text-yellow-700 bg-yellow-50"
                                  : app.status === "approved"
                                  ? "border-green-400 text-green-700 bg-green-50"
                                  : app.status === "rejected"
                                  ? "border-red-400 text-red-700 bg-red-50"
                                  : "border-blue-400 text-blue-700 bg-blue-50"
                              }
                            >
                              {app.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {/* Show all field values */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                            {Object.entries(data).map(([key, val]) => (
                              <div key={key} className="text-xs">
                                <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}: </span>
                                <span className="text-foreground line-clamp-1">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Select
                            value={app.status}
                            onValueChange={(val) =>
                              updateStatusMutation.mutate({
                                id: app.id,
                                status: val as "pending" | "reviewed" | "approved" | "rejected",
                              })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive h-8 text-xs"
                            onClick={() => deleteAppMutation.mutate({ id: app.id })}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Field Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Field" : "Add New Field"}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Mongolian labels are auto-generated when you save. You can correct them in the МН fields.
            </p>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            {/* Field key */}
            <div>
              <Label>
                Field Key <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.fieldKey}
                onChange={(e) =>
                  setForm({ ...form, fieldKey: e.target.value.replace(/\s+/g, "_").toLowerCase() })
                }
                placeholder="e.g. fullName, whyVolunteer"
                disabled={!!editId}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unique identifier used to store the answer. Cannot be changed after creation.
              </p>
            </div>

            {/* Field type */}
            <div>
              <Label>Field Type</Label>
              <Select
                value={form.fieldType}
                onValueChange={(v) => setForm({ ...form, fieldType: v as FieldType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(FIELD_TYPE_LABELS) as [FieldType, string][]).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Label */}
            <div>
              <Label>
                Label (English) <span className="text-destructive">*</span>
              </Label>
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="e.g. Why do you want to volunteer at Lotus?"
              />
              <MnField
                label="Mongolian label"
                value={form.labelMn}
                onChange={(v) => setForm({ ...form, labelMn: v })}
              />
            </div>

            {/* Placeholder */}
            <div>
              <Label>Placeholder (English)</Label>
              <Input
                value={form.placeholder}
                onChange={(e) => setForm({ ...form, placeholder: e.target.value })}
                placeholder="e.g. Enter your answer…"
              />
              <MnField
                label="Mongolian placeholder"
                value={form.placeholderMn}
                onChange={(v) => setForm({ ...form, placeholderMn: v })}
              />
            </div>

            {/* Required + Active */}
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.isRequired}
                  onCheckedChange={(v) => setForm({ ...form, isRequired: v })}
                />
                <Label>Required field</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
                <Label>Active (visible on form)</Label>
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
            <DialogTitle>Delete Field</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this field? Existing submissions will retain the data but
            the field will no longer appear on the form.
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
