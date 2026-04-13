import { useState, useEffect, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Upload, Check, Loader2, X, Plus, Trash2, FileText } from "lucide-react";
import { CMS_PAGES, type CmsPage, type CmsSection } from "../../../../shared/cmsConfig";

type SectionData = Record<string, string>;

/**
 * Extract a value from DB row based on storageKey.
 */
function getValueFromRow(
  row: { title: string | null; content: string | null; imageUrl: string | null; metadata: unknown } | undefined,
  storageKey: string
): string {
  if (!row) return "";
  if (storageKey === "title") return row.title || "";
  if (storageKey === "content") return row.content || "";
  if (storageKey === "imageUrl") return row.imageUrl || "";
  if (storageKey.startsWith("metadata.")) {
    const metaKey = storageKey.replace("metadata.", "");
    const meta = row.metadata as Record<string, unknown> | null;
    return (meta?.[metaKey] as string) || "";
  }
  return "";
}

/**
 * Build the upsert payload from section data.
 */
function buildUpsertPayload(
  pageKey: string,
  sectionKey: string,
  section: CmsSection,
  data: SectionData
) {
  let title: string | undefined;
  let content: string | undefined;
  let imageUrl: string | undefined;
  const metadata: Record<string, string> = {};

  for (const field of section.fields) {
    const value = data[field.key] || "";
    if (field.storageKey === "title") {
      title = value;
    } else if (field.storageKey === "content") {
      content = value;
    } else if (field.storageKey === "imageUrl") {
      imageUrl = value;
    } else if (field.storageKey.startsWith("metadata.")) {
      const metaKey = field.storageKey.replace("metadata.", "");
      metadata[metaKey] = value;
    }
  }

  return {
    pageKey,
    sectionKey,
    title,
    content,
    imageUrl,
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
  };
}

// ─── Image Upload Field ──────────────────────────────────────

function ImageUploadField({
  value,
  onChange,
  label,
  compact = false,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  compact?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadMutation = trpc.admin.content.uploadImage.useMutation({
    onSuccess: (data) => {
      onChange(data.url);
      toast.success("Image uploaded");
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

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {value && (
          <div className="relative group">
            <img src={value} alt={label} className="w-12 h-12 object-contain rounded border bg-white p-1" />
            <button
              onClick={() => onChange("")}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-1 flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Logo URL or upload"
            className="text-xs h-8"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
          </Button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {value && (
        <div className="relative group rounded-lg overflow-hidden border bg-muted/30 max-w-xs">
          <img src={value} alt={label} className="w-full h-40 object-cover" />
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
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>
    </div>
  );
}

// ─── Dynamic Partners Editor ─────────────────────────────────

type Partner = { name: string; logo: string };

function DynamicPartnersEditor({
  pageKey,
  section,
  dbRows,
}: {
  pageKey: string;
  section: CmsSection;
  dbRows: Array<{
    sectionKey: string;
    title: string | null;
    content: string | null;
    imageUrl: string | null;
    metadata: unknown;
  }>;
}) {
  const [subtitle, setSubtitle] = useState("");
  const [heading, setHeading] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [saved, setSaved] = useState(false);
  const utils = trpc.useUtils();

  const row = dbRows.find((r) => r.sectionKey === section.sectionKey);

  // Initialize from DB
  useEffect(() => {
    setSubtitle(row?.title || "");
    setHeading(row?.content || "");
    const meta = row?.metadata as Record<string, unknown> | null;

    // Try new JSON format
    const partnersJson = (meta?.partnersJson as string) || "";
    if (partnersJson) {
      try {
        const parsed = JSON.parse(partnersJson) as Partner[];
        if (Array.isArray(parsed)) {
          setPartners(parsed);
          return;
        }
      } catch {
        // fall through to legacy
      }
    }

    // Legacy: partner1Name / partner1Logo ... partner10Name / partner10Logo
    const legacyPartners: Partner[] = [];
    for (let i = 1; i <= 10; i++) {
      const name = (meta?.[`partner${i}Name`] as string) || "";
      const logo = (meta?.[`partner${i}Logo`] as string) || "";
      if (name || logo) {
        legacyPartners.push({ name, logo });
      }
    }
    if (legacyPartners.length > 0) {
      setPartners(legacyPartners);
    } else {
      setPartners([]);
    }
  }, [row]);

  const upsertMutation = trpc.admin.content.upsert.useMutation({
    onSuccess: () => {
      utils.admin.content.list.invalidate();
      utils.content.getPage.invalidate({ pageKey });
      setSaved(true);
      toast.success("Partners saved");
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const handleSave = () => {
    upsertMutation.mutate({
      pageKey,
      sectionKey: section.sectionKey,
      title: subtitle,
      content: heading,
      metadata: {
        partnersJson: JSON.stringify(partners.filter((p) => p.name || p.logo)),
      },
    });
  };

  const addPartner = () => {
    setPartners((prev) => [...prev, { name: "", logo: "" }]);
    setSaved(false);
  };

  const removePartner = (index: number) => {
    setPartners((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const updatePartner = (index: number, field: "name" | "logo", value: string) => {
    setPartners((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    setSaved(false);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              {section.label}
            </CardTitle>
            <CardDescription className="text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {section.description}
            </CardDescription>
          </div>
          <Button
            onClick={handleSave}
            disabled={upsertMutation.isPending}
            className={saved ? "bg-green-600 hover:bg-green-700 gap-2" : "bg-lotus-green hover:bg-lotus-green/90 gap-2"}
            size="sm"
          >
            {upsertMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Section title & heading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Section Subtitle</Label>
            <Input
              value={subtitle}
              onChange={(e) => { setSubtitle(e.target.value); setSaved(false); }}
              placeholder="e.g. Our Partners"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-medium">Section Heading</Label>
            <Input
              value={heading}
              onChange={(e) => { setHeading(e.target.value); setSaved(false); }}
              placeholder="e.g. Supported By Amazing Partners"
            />
          </div>
        </div>

        {/* Partners list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">
              Partners ({partners.length})
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPartner}
              className="gap-1.5 text-lotus-green border-lotus-green hover:bg-lotus-green/10"
            >
              <Plus className="h-4 w-4" />
              Add Partner
            </Button>
          </div>

          {partners.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg text-muted-foreground text-sm">
              No partners added yet. Click "Add Partner" to get started.
              <br />
              <span className="text-xs mt-1 block">If empty, the default partners will be shown on the website.</span>
            </div>
          )}

          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20 group"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-lotus-green/10 text-lotus-green text-xs font-bold flex items-center justify-center mt-1">
                {index + 1}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={partner.name}
                  onChange={(e) => updatePartner(index, "name", e.target.value)}
                  placeholder="Partner name (e.g. Hobby School)"
                  className="h-8 text-sm"
                />
                <ImageUploadField
                  value={partner.logo}
                  onChange={(url) => updatePartner(index, "logo", url)}
                  label={`Partner ${index + 1} Logo`}
                  compact
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePartner(index)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Section Editor (generic) ────────────────────────────────

function SectionEditor({
  pageKey,
  section,
  dbRows,
}: {
  pageKey: string;
  section: CmsSection;
  dbRows: Array<{
    sectionKey: string;
    title: string | null;
    content: string | null;
    imageUrl: string | null;
    metadata: unknown;
  }>;
}) {
  // Use dynamic partners editor for sponsors section
  if (section.type === "dynamic-partners") {
    return <DynamicPartnersEditor pageKey={pageKey} section={section} dbRows={dbRows} />;
  }

  const [data, setData] = useState<SectionData>({});
  const [saved, setSaved] = useState(false);
  const utils = trpc.useUtils();

  const row = dbRows.find((r) => r.sectionKey === section.sectionKey);

  useEffect(() => {
    const initial: SectionData = {};
    for (const field of section.fields) {
      initial[field.key] = getValueFromRow(row, field.storageKey);
    }
    setData(initial);
  }, [row, section.fields]);

  const upsertMutation = trpc.admin.content.upsert.useMutation({
    onSuccess: () => {
      utils.admin.content.list.invalidate();
      utils.content.getPage.invalidate({ pageKey });
      setSaved(true);
      toast.success(`${section.label} saved`);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const handleSave = () => {
    const payload = buildUpsertPayload(pageKey, section.sectionKey, section, data);
    upsertMutation.mutate(payload);
  };

  const updateField = (key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              {section.label}
            </CardTitle>
            <CardDescription className="text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {section.description}
            </CardDescription>
          </div>
          <Button
            onClick={handleSave}
            disabled={upsertMutation.isPending}
            className={saved ? "bg-green-600 hover:bg-green-700 gap-2" : "bg-lotus-green hover:bg-lotus-green/90 gap-2"}
            size="sm"
          >
            {upsertMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields
          .filter((f) => f.key !== "partnersJson") // hide raw JSON field
          .map((field) => {
            if (field.type === "image") {
              return (
                <ImageUploadField
                  key={field.key}
                  value={data[field.key] || ""}
                  onChange={(url) => updateField(field.key, url)}
                  label={field.label}
                />
              );
            }
            if (field.type === "textarea") {
              return (
                <div key={field.key} className="space-y-1">
                  <Label className="text-sm font-medium">{field.label}</Label>
                  <Textarea
                    value={data[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                  />
                </div>
              );
            }
            return (
              <div key={field.key} className="space-y-1">
                <Label className="text-sm font-medium">{field.label}</Label>
                <Input
                  value={data[field.key] || ""}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}

// ─── Page Editor ─────────────────────────────────────────────

function PageEditor({ page }: { page: CmsPage }) {
  const { data: allContent, isLoading } = trpc.admin.content.list.useQuery();
  const pageRows = (allContent || []).filter((c) => c.pageKey === page.pageKey);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <FileText className="h-5 w-5 text-lotus-green" />
        <div>
          <h2
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {page.label}
          </h2>
          <p className="text-sm text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Edit the text and images for each section of this page
          </p>
        </div>
      </div>

      {page.sections.map((section) => (
        <SectionEditor
          key={section.sectionKey}
          pageKey={page.pageKey}
          section={section}
          dbRows={pageRows}
        />
      ))}
    </div>
  );
}

// ─── Main AdminContent ────────────────────────────────────────

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState(CMS_PAGES[0].pageKey);

  return (
    <div className="space-y-6">
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
          Edit text and images for each section of every page on the website
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {CMS_PAGES.map((page) => (
            <TabsTrigger
              key={page.pageKey}
              value={page.pageKey}
              className="data-[state=active]:bg-lotus-green data-[state=active]:text-white"
            >
              {page.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CMS_PAGES.map((page) => (
          <TabsContent key={page.pageKey} value={page.pageKey} className="mt-6">
            <PageEditor page={page} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
