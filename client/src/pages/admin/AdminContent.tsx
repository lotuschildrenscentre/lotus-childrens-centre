import { useState, useEffect, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Upload, X, Check, Loader2, RefreshCw, Languages, FileText } from "lucide-react";
import { CMS_PAGES, type CmsPage, type CmsSection, type CmsField } from "../../../../shared/cmsConfig";

type SectionData = Record<string, string>;

/**
 * Extract a value from DB row based on storageKey.
 * storageKey can be "title", "content", "imageUrl", or "metadata.xxx"
 */
function getValueFromRow(
  row: {
    title: string | null;
    content: string | null;
    imageUrl: string | null;
    metadata: unknown;
    titleMn?: string | null;
    contentMn?: string | null;
    metadataMn?: unknown;
  } | undefined,
  storageKey: string,
  lang: "en" | "mn" = "en"
): string {
  if (!row) return "";

  if (lang === "mn") {
    if (storageKey === "title") return row.titleMn || "";
    if (storageKey === "content") return row.contentMn || "";
    if (storageKey === "imageUrl") return row.imageUrl || ""; // images shared
    if (storageKey.startsWith("metadata.")) {
      const metaKey = storageKey.replace("metadata.", "");
      const meta = row.metadataMn as Record<string, unknown> | null;
      return (meta?.[metaKey] as string) || "";
    }
    return "";
  }

  // EN
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
 * Build the upsert payload from section data (EN + MN).
 */
function buildUpsertPayload(
  pageKey: string,
  sectionKey: string,
  section: CmsSection,
  dataEn: SectionData,
  dataMn: SectionData,
  skipAutoTranslate: boolean
) {
  let title: string | undefined;
  let content: string | undefined;
  let imageUrl: string | undefined;
  const metadata: Record<string, string> = {};

  let titleMn: string | undefined;
  let contentMn: string | undefined;
  const metadataMn: Record<string, string> = {};

  for (const field of section.fields) {
    const enValue = dataEn[field.key] || "";
    const mnValue = dataMn[field.key] || "";

    if (field.storageKey === "title") {
      title = enValue;
      if (skipAutoTranslate) titleMn = mnValue;
    } else if (field.storageKey === "content") {
      content = enValue;
      if (skipAutoTranslate) contentMn = mnValue;
    } else if (field.storageKey === "imageUrl") {
      imageUrl = enValue;
    } else if (field.storageKey.startsWith("metadata.")) {
      const metaKey = field.storageKey.replace("metadata.", "");
      metadata[metaKey] = enValue;
      if (skipAutoTranslate) metadataMn[metaKey] = mnValue;
    }
  }

  return {
    pageKey,
    sectionKey,
    title,
    content,
    imageUrl,
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    titleMn: skipAutoTranslate ? titleMn : undefined,
    contentMn: skipAutoTranslate ? contentMn : undefined,
    metadataMn: skipAutoTranslate && Object.keys(metadataMn).length > 0 ? metadataMn : undefined,
    skipAutoTranslate,
  };
}

function ImageUploadField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadMutation = trpc.admin.content.uploadImage.useMutation({
    onSuccess: (data) => {
      onChange(data.url);
      toast.success("Image uploaded successfully");
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
        uploadMutation.mutate({
          base64,
          fileName: file.name,
          contentType: file.type,
        });
      };
      reader.readAsDataURL(file);
    },
    [uploadMutation]
  );

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

/**
 * Renders a single field with EN input and MN translation below it.
 * Image fields are shared (no MN variant).
 */
function BilingualField({
  field,
  enValue,
  mnValue,
  onEnChange,
  onMnChange,
}: {
  field: CmsField;
  enValue: string;
  mnValue: string;
  onEnChange: (v: string) => void;
  onMnChange: (v: string) => void;
}) {
  if (field.type === "image") {
    return (
      <ImageUploadField
        value={enValue}
        onChange={onEnChange}
        label={field.label}
      />
    );
  }

  const isTextarea = field.type === "textarea";

  return (
    <div className="space-y-2 border border-border/40 rounded-lg p-3 bg-muted/10">
      {/* English */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 font-normal text-blue-600 border-blue-300">EN</Badge>
        </div>
        {isTextarea ? (
          <Textarea
            value={enValue}
            onChange={(e) => onEnChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="text-sm"
          />
        ) : (
          <Input
            value={enValue}
            onChange={(e) => onEnChange(e.target.value)}
            placeholder={field.placeholder}
            className="text-sm"
          />
        )}
      </div>

      {/* Mongolian */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Mongolian translation</Label>
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 font-normal text-orange-600 border-orange-300">МН</Badge>
          <span className="text-xs text-muted-foreground ml-auto">
            {mnValue ? "✓ Translated" : "Auto-translated on save"}
          </span>
        </div>
        {isTextarea ? (
          <Textarea
            value={mnValue}
            onChange={(e) => onMnChange(e.target.value)}
            placeholder="Mongolian translation (auto-generated on save, editable)"
            rows={3}
            className="text-sm bg-orange-50/30 border-orange-200/50 placeholder:text-muted-foreground/50"
          />
        ) : (
          <Input
            value={mnValue}
            onChange={(e) => onMnChange(e.target.value)}
            placeholder="Mongolian translation (auto-generated on save, editable)"
            className="text-sm bg-orange-50/30 border-orange-200/50 placeholder:text-muted-foreground/50"
          />
        )}
      </div>
    </div>
  );
}

type DbRow = {
  sectionKey: string;
  title: string | null;
  content: string | null;
  imageUrl: string | null;
  metadata: unknown;
  titleMn?: string | null;
  contentMn?: string | null;
  metadataMn?: unknown;
};

function SectionEditor({
  pageKey,
  section,
  dbRows,
}: {
  pageKey: string;
  section: CmsSection;
  dbRows: DbRow[];
}) {
  const [dataEn, setDataEn] = useState<SectionData>({});
  const [dataMn, setDataMn] = useState<SectionData>({});
  const [saved, setSaved] = useState(false);
  const [mnEdited, setMnEdited] = useState(false);
  const utils = trpc.useUtils();

  const row = dbRows.find((r) => r.sectionKey === section.sectionKey);

  // Initialize data from DB row
  useEffect(() => {
    const initialEn: SectionData = {};
    const initialMn: SectionData = {};
    for (const field of section.fields) {
      initialEn[field.key] = getValueFromRow(row, field.storageKey, "en");
      initialMn[field.key] = getValueFromRow(row, field.storageKey, "mn");
    }
    setDataEn(initialEn);
    setDataMn(initialMn);
    setMnEdited(false);
  }, [row, section.fields]);

  const upsertMutation = trpc.admin.content.upsert.useMutation({
    onSuccess: () => {
      utils.admin.content.list.invalidate();
      utils.content.getPage.invalidate({ pageKey });
      setSaved(true);
      setMnEdited(false);
      toast.success(`${section.label} saved with translation`);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const retranslateMutation = trpc.admin.content.retranslate.useMutation({
    onSuccess: (result) => {
      // Update MN fields from re-translation result
      const newMn: SectionData = { ...dataMn };
      for (const field of section.fields) {
        if (field.storageKey === "title" && result.titleMn) {
          newMn[field.key] = result.titleMn as string;
        } else if (field.storageKey === "content" && result.contentMn) {
          newMn[field.key] = result.contentMn as string;
        } else if (field.storageKey.startsWith("metadata.") && result.metadataMn) {
          const metaKey = field.storageKey.replace("metadata.", "");
          const meta = result.metadataMn as Record<string, unknown>;
          if (meta[metaKey]) newMn[field.key] = meta[metaKey] as string;
        }
      }
      setDataMn(newMn);
      utils.admin.content.list.invalidate();
      utils.content.getPage.invalidate({ pageKey });
      toast.success("Re-translated successfully");
    },
    onError: (error) => {
      toast.error(`Re-translation failed: ${error.message}`);
    },
  });

  const handleSave = () => {
    const payload = buildUpsertPayload(pageKey, section.sectionKey, section, dataEn, dataMn, mnEdited);
    upsertMutation.mutate(payload);
  };

  const handleRetranslate = () => {
    retranslateMutation.mutate({ pageKey, sectionKey: section.sectionKey });
  };

  const updateEnField = (key: string, value: string) => {
    setDataEn((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateMnField = (key: string, value: string) => {
    setDataMn((prev) => ({ ...prev, [key]: value }));
    setMnEdited(true);
    setSaved(false);
  };

  const hasMnContent = section.fields.some((f) => dataMn[f.key]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              {section.label}
            </CardTitle>
            <CardDescription className="text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {section.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Re-translate button */}
            <Button
              onClick={handleRetranslate}
              disabled={retranslateMutation.isPending || upsertMutation.isPending}
              variant="outline"
              size="sm"
              className="gap-1.5 text-orange-600 border-orange-300 hover:bg-orange-50"
              title="Re-translate English content to Mongolian"
            >
              {retranslateMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Re-translate
            </Button>

            {/* Save button */}
            <Button
              onClick={handleSave}
              disabled={upsertMutation.isPending || retranslateMutation.isPending}
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
              {upsertMutation.isPending ? "Saving & Translating..." : saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* Translation status indicator */}
        <div className="flex items-center gap-2 mt-1">
          <Languages className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {hasMnContent
              ? mnEdited
                ? "Mongolian translation edited manually — will save your edits"
                : "Mongolian translation available — saving will auto-update it"
              : "No Mongolian translation yet — will be auto-generated on save"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {section.fields.map((field) => (
          <BilingualField
            key={field.key}
            field={field}
            enValue={dataEn[field.key] || ""}
            mnValue={dataMn[field.key] || ""}
            onEnChange={(v) => updateEnField(field.key, v)}
            onMnChange={(v) => updateMnField(field.key, v)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function PageEditor({ page }: { page: CmsPage }) {
  const { data: allContent, isLoading } = trpc.admin.content.list.useQuery();

  const pageRows = (allContent || []).filter((c) => c.pageKey === page.pageKey) as DbRow[];

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
            Edit English content and review/correct Mongolian translations for each section
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
          Edit text and images for each section. English content is auto-translated to Mongolian on save.
          You can review and manually correct Mongolian translations.
        </p>
      </div>

      {/* Translation info banner */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
        <Languages className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
        <div className="text-sm text-orange-800">
          <strong>Auto-Translation Active:</strong> When you save content, the English text is automatically
          translated to Mongolian using AI and stored in the database. You can review and manually
          correct any translation using the Mongolian fields below each English input.
          Use the <strong>Re-translate</strong> button to regenerate the Mongolian translation from scratch.
        </div>
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
