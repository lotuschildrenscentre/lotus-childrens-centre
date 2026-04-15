/*
 * Photos & Videos Gallery page
 * Masonry/mosaic grid layout — click to open modal with full image/video + description
 * Bilingual: serves MN fields when language switcher is set to Mongolian
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { X, Play, ChevronLeft, ChevronRight, Camera, Video } from "lucide-react";

type MediaItem = {
  id: number;
  type: "photo" | "video";
  title: string | null;
  titleMn: string | null;
  description: string | null;
  descriptionMn: string | null;
  url: string;
  thumbnailUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function getYouTubeEmbed(url: string): string | null {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
}

// Assign a span class to create visual variety in the masonry grid
function getSpanClass(index: number): string {
  const patterns = [
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
  ];
  return patterns[index % patterns.length];
}

export default function Gallery() {
  const { language, t } = useLanguage();
  const { data: items = [], isLoading } = trpc.gallery.list.useQuery();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");

  const filteredItems = items.filter(
    (item) => filter === "all" || item.type === filter
  );

  const selectedItem =
    selectedIndex !== null ? filteredItems[selectedIndex] : null;

  function openItem(index: number) {
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setSelectedIndex(null);
    document.body.style.overflow = "";
  }

  function prevItem() {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (selectedIndex - 1 + filteredItems.length) % filteredItems.length
    );
  }

  function nextItem() {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filteredItems.length);
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevItem();
      if (e.key === "ArrowRight") nextItem();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, filteredItems.length]);

  const getTitle = (item: MediaItem) =>
    language === "mn" && item.titleMn ? item.titleMn : item.title;

  const getDescription = (item: MediaItem) =>
    language === "mn" && item.descriptionMn
      ? item.descriptionMn
      : item.description;

  const thumbnailFor = (item: MediaItem): string | null => {
    if (item.thumbnailUrl) return item.thumbnailUrl;
    if (item.type === "video") return getYouTubeThumbnail(item.url);
    return item.url;
  };

  return (
    <div className="min-h-screen flex flex-col bg-lotus-cream">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-lotus-green/10 to-lotus-cream">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 bg-lotus-green/10 text-lotus-green text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Camera className="w-4 h-4" />
            {language === "mn" ? "Зураг & Видео" : "Photos & Videos"}
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {language === "mn" ? "Манай Галерей" : "Our Gallery"}
          </h1>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {language === "mn"
              ? "Лотус хүүхдийн төвийн амьдрал, үйл ажиллагааны зургууд болон видеонууд"
              : "A window into life at Lotus Children's Centre — moments of joy, learning, and community."}
          </p>

          {/* Filter tabs */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {(["all", "photo", "video"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-lotus-green text-white shadow-md"
                    : "bg-white text-muted-foreground hover:bg-lotus-green/10 hover:text-lotus-green border border-border"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {f === "all"
                  ? language === "mn"
                    ? "Бүгд"
                    : "All"
                  : f === "photo"
                  ? language === "mn"
                    ? "Зураг"
                    : "Photos"
                  : language === "mn"
                  ? "Видео"
                  : "Videos"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Camera className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p
                className="text-xl font-medium text-muted-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {language === "mn"
                  ? "Одоогоор зураг байхгүй байна"
                  : "No gallery items yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {language === "mn"
                  ? "Удахгүй шинэ зургууд нэмэгдэх болно"
                  : "Check back soon for photos and videos from our centre."}
              </p>
            </div>
          ) : (
            /* Masonry-style CSS grid */
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gridAutoRows: "220px",
                gridAutoFlow: "dense",
              }}
            >
              {filteredItems.map((item, index) => {
                const thumb = thumbnailFor(item);
                const title = getTitle(item);
                const spanClass = getSpanClass(index);

                return (
                  <div
                    key={item.id}
                    className={`${spanClass} group relative rounded-xl overflow-hidden cursor-pointer bg-muted shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}
                    onClick={() => openItem(index)}
                  >
                    {/* Thumbnail */}
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={title ?? ""}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-lotus-green/10">
                        {item.type === "video" ? (
                          <Video className="w-12 h-12 text-lotus-green/40" />
                        ) : (
                          <Camera className="w-12 h-12 text-lotus-green/40" />
                        )}
                      </div>
                    )}

                    {/* Video play overlay */}
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-lotus-green transition-colors duration-200">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Hover overlay with title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        {title && (
                          <p className="text-white text-sm font-medium line-clamp-2">
                            {title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={closeModal}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev / Next */}
          {filteredItems.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  prevItem();
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  nextItem();
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Modal content */}
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row gap-4 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              {selectedItem.type === "video" ? (
                <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                  {getYouTubeEmbed(selectedItem.url) ? (
                    <iframe
                      src={getYouTubeEmbed(selectedItem.url)!}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={getTitle(selectedItem) ?? "Video"}
                    />
                  ) : (
                    <video
                      src={selectedItem.url}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              ) : (
                <img
                  src={selectedItem.url}
                  alt={getTitle(selectedItem) ?? ""}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>

            {/* Info panel */}
            {(getTitle(selectedItem) || getDescription(selectedItem)) && (
              <div className="md:w-72 shrink-0 bg-white/10 backdrop-blur-sm rounded-xl p-5 text-white space-y-3">
                {getTitle(selectedItem) && (
                  <h2
                    className="text-xl font-bold leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {getTitle(selectedItem)}
                  </h2>
                )}
                {getDescription(selectedItem) && (
                  <p
                    className="text-sm text-white/80 leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {getDescription(selectedItem)}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  {selectedItem.type === "video" ? (
                    <Video className="w-3.5 h-3.5" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                  <span className="capitalize">{selectedItem.type}</span>
                  {filteredItems.length > 1 && (
                    <>
                      <span>·</span>
                      <span>
                        {selectedIndex! + 1} / {filteredItems.length}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Counter when no info panel */}
            {!getTitle(selectedItem) && !getDescription(selectedItem) && filteredItems.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/60 text-xs">
                {selectedIndex! + 1} / {filteredItems.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
