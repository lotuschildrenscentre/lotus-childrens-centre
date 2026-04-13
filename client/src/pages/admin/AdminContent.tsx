import { useState, useEffect, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Upload, Image as ImageIcon, FileText, Check, Loader2, X } from "lucide-react";
import { CMS_PAGES, type CmsPage, type CmsSection, type CmsField } from "../../../../shared/cmsConfig";

type SectionData = Record<string, string>;

/**
 * Extract a value from DB row based on storageKey.
 * storageKey can be "title", "content", "imageUrl", or "metadata.xxx"
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
    return meta?.[metaKey] as string || "";
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
  const [data, setData] = useState<SectionData>({});
  const [saved, setSaved] = useState(false);
  const utils = trpc.useUtils();

  const row = dbRows.find((r) => r.sectionKey === section.sectionKey);

  // Initialize data from DB row
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
        {section.fields.map((field) => {
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
