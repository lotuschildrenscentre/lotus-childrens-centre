/*
 * Design: "Warm Embrace" — Organic Warmth
 * Blog Page: News & Updates — loads posts from the database.
 * Falls back to static content when no DB posts are published yet.
 * Colors: Cream bg, green/orange accents from lotus logo
 */
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsContent } from "@/hooks/useCmsContent";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { X, Calendar, Clock, User, ChevronRight, Loader2 } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/about-section-4aLVCU3JgHnUwUPHwF3mg6.webp";

// ─── Static fallback posts (shown until DB posts are published) ──────────────

interface StaticPost {
  id: string;
  title: { en: string; mn: string };
  date: string;
  readTime: { en: string; mn: string };
  author: string;
  summary: { en: string; mn: string };
  content: { en: string; mn: string };
  category: { en: string; mn: string };
  color: string;
  imageUrl?: string;
}

const STATIC_POSTS: StaticPost[] = [
  {
    id: "lotus-bakery",
    title: { en: "The Lotus Bakery Project", mn: "Лотус нарийн боовны төсөл" },
    date: "Nov 21, 2021",
    readTime: { en: "3 min read", mn: "3 мин унших" },
    author: "Loes A",
    summary: {
      en: "In 2011, the Hospitality Training Association Inc sent a chef and patisserie trainer to Mongolia to assist the Lotus Children's Centre in baking skills.",
      mn: "2011 онд Зочлох үйлчилгээний сургалтын нийгэмлэг нь Лотус хүүхдийн төвд нарийн боовны ур чадвар олгоход тусалж, тогооч, нарийн боовны сургагч багшийг Монгол руу илгээсэн."
    },
    content: {
      en: "In 2011, the Hospitality Training Association Inc sent me a chef and patisserie trainer to Mongolia to assist the Lotus Children's Centre in baking skills.\n\nThe training commenced in one of the small rooms at the then baby's house at Bayanzurkh with the kneading of dough and rolling of pastry in the dining room and then baking in an oven in one of the old bedrooms. There were about 15 very keen participants including some house mothers, cooks, staff and some of the older children. It was a fun and exciting time with language barriers and different ingredients and a baker who was new to the country and the people.\n\nA year later Hospitality Training Association was no more, I had changed jobs and had commenced working for the Holy Spirit Northside Private Hospital. Within my first year of employment the Children's Health and Education Fund assisted me with funds to return to do follow up training.\n\nMy employer heard of what I was doing and offered to assist me with fund raising. In less than 20 minutes $25,000 was raised.\n\nIt was decided to use these funds to set up a commercial quality bakery at the Lotus Centre. The equipment was sourced in China, paid for from Australia and freighted to Mongolia.\n\nThe plan is to return to assist Lotus in re-opening the café and teaching some special needs children some skills so they can be employed.",
      mn: "2011 онд Зочлох үйлчилгээний сургалтын нийгэмлэг нь Лотус хүүхдийн төвд нарийн боовны ур чадвар олгоход тусалж, тогооч, нарийн боовны сургагч багшийг Монгол руу илгээсэн.\n\nСургалт нь Баянзүрхийн хүүхдийн байрны жижиг өрөөнд зуурмаг зуурч, хоолны өрөөнд гурилан бүтээгдэхүүн хийж, хуучин унтлагын өрөөнд зуух дээр жигнэснээр эхэлсэн. 15 орчим маш идэвхтэй оролцогч байсан.\n\nНэг жилийн дараа Зочлох үйлчилгээний сургалтын нийгэмлэг байхгүй болсон, би ажлаа сольж, Holy Spirit Northside хувийн эмнэлэгт ажиллаж эхэлсэн.\n\nАжил олгогч маань $25,000 босгосон.\n\nЭнэ хөрөнгөөр Лотус төвд мэргэжлийн чанартай нарийн боовны цех байгуулахаар шийдсэн.\n\nЛотусын кафег дахин нээж, тусгай хэрэгцээтэй хүүхдүүдэд ур чадвар заахаар төлөвлөж байна."
    },
    category: { en: "Projects", mn: "Төслүүд" },
    color: "bg-amber-500",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop"
  },
  {
    id: "previous-projects",
    title: { en: "Previous Projects", mn: "Өмнөх төслүүд" },
    date: "Nov 21, 2021",
    readTime: { en: "3 min read", mn: "3 мин унших" },
    author: "Loes A",
    summary: {
      en: "Volunteer Facilities, Website Translation, Horses and Corral, Ger and Platform, Landscaping, Basketball Court, Bakery Project, and Khutul Community Centre.",
      mn: "Сайн дурын ажилтнуудын байгууламж, вэбсайт орчуулга, морь, хашаа, гэр, тавцан, тохижилт, сагсан бөмбөгийн талбай, нарийн боовны төсөл, Хутул нийгмийн төв."
    },
    content: {
      en: "Volunteer Facilities\nIn 2017 we improved and expanded our volunteer facilities at Lotus to include a combined toilet and shower block and also a rest area for volunteers.\n\nWebsite Translation\nIn Spring 2016, Double Check Translation very kindly offered to translate the website free of charge.\n\nHorses and Corral\nDidi has always greatly enjoyed horse riding, and was keen for the children to also experience her joy.\n\nGer and Platform\nIn 2015, a large 12 wall carved ceremonial ger was built for the Lotus' 20th anniversary celebrations.\n\nLandscaping Project\nWhen Lotus moved to Gachuurt, various groups came to plant trees and we now have almost 500 trees planted.\n\nBasketball Court\nThe court was completed in the Autumn of 2014 thanks to NBIK LLC and OchNaran LLC.\n\nBakery Project\n2011 saw the beginning of a very exciting project. A chef, Paul Wilderbeek, arrived to deliver baking training.\n\nKhutul Community Centre\nIn 2006, Lotus collaborated with the local community to open up a new Cafe and Community Centre in Khutul.",
      mn: "Сайн дурын ажилтнуудын байгууламж\n2017 онд бид Лотус дахь сайн дурын ажилтнуудын байгууламжийг сайжруулж, ариун цэврийн өрөө, шүршүүрийн блок, амрах өрөөг нэмсэн.\n\nВэбсайт орчуулга\n2016 оны хаврын улиралд Double Check Translation компани вэбсайтыг үнэ төлбөргүй монгол хэл рүү орчуулахаар санал болгосон.\n\nМорь, хашаа\nДиди үргэлж морь унахад дуртай байсан бөгөөд хүүхдүүд ч бас баярлахыг хүссэн.\n\nГэр, тавцан\n2015 онд Лотусын 20 жилийн ойн баярт зориулж 12 ханатай сийлбэртэй гэр барьсан.\n\nТохижилтын төсөл\n500 гаруй мод тарьсан.\n\nСагсан бөмбөгийн талбай\nНБИК ХХК, ОчНаран ХХК хоёр Монгол компанийн сайн сэтгэлийн ачаар 2014 оны намар дуусгасан.\n\nНарийн боовны төсөл\n2011 онд маш сэтгэл хөдөлгөм төсөл эхэлсэн.\n\nХутул нийгмийн төв\n2006 онд Лотус орон нутгийн нийгэмлэгтэй хамтран Хутулд шинэ кафе, нийгмийн төв нээсэн."
    },
    category: { en: "Projects", mn: "Төслүүд" },
    color: "bg-lotus-green",
    imageUrl: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=600&h=400&fit=crop"
  },
  {
    id: "education",
    title: { en: "Education", mn: "Боловсрол" },
    date: "Nov 21, 2021",
    readTime: { en: "1 min read", mn: "1 мин унших" },
    author: "Loes A",
    summary: {
      en: "Although this is a project that will never be \"completed\", it is one that we made huge progress with in 2017.",
      mn: "Энэ бол хэзээ ч \"дуусахгүй\" төсөл боловч 2017 онд бид маш их ахиц дэвшил гаргасан."
    },
    content: {
      en: "Although this is a project that will never be \"completed\", it is one that we made huge progress with in 2017. At the start of the academic year in September we had 11 children attending new private schools in Ulaanbaatar. This is part of our drive to bring better educational opportunities to our children either through scholarship or sponsorship, or a combination of both.",
      mn: "Энэ бол хэзээ ч \"дуусахгүй\" төсөл боловч 2017 онд бид маш их ахиц дэвшил гаргасан. 9-р сарын хичээлийн жилийн эхэнд 11 хүүхэд Улаанбаатарын шинэ хувийн сургуулиудад суралцаж эхэлсэн."
    },
    category: { en: "Education", mn: "Боловсрол" },
    color: "bg-purple-500",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop"
  },
  {
    id: "renewable-energy",
    title: { en: "Renewable Energy", mn: "Сэргээгдэх эрчим хүч" },
    date: "Nov 14, 2021",
    readTime: { en: "1 min read", mn: "1 мин унших" },
    author: "Loes A",
    summary: {
      en: "With 260 sunny days per year, Mongolia has huge potential for the use of renewable energy from solar power.",
      mn: "Жилд 260 нарлаг өдөртэй Монгол улс нарны эрчим хүчний сэргээгдэх эрчим хүч ашиглах асар их боломжтой."
    },
    content: {
      en: "With 260 sunny days per year, Mongolia has huge potential for the use of renewable energy from solar power. In 2020 we were able to build solar panels with thanks to funding and logistical support from The Rising Sun Cyclists, Harry and Rob. We also installed an electric boiler to replace the existing coal-fired boiler at Lotus. We are continuing with our commitment to become a more sustainable and environmentally-friendly organisation.",
      mn: "Жилд 260 нарлаг өдөртэй Монгол улс нарны эрчим хүчний сэргээгдэх эрчим хүч ашиглах асар их боломжтой. 2020 онд бид The Rising Sun Cyclists, Харри, Роб нарын санхүүжилт, логистикийн дэмжлэгээр нарны зайн самбар байгуулсан. Мөн Лотус дахь нүүрсэн зуухыг цахилгаан зуухаар сольсон."
    },
    category: { en: "Sustainability", mn: "Тогтвортой байдал" },
    color: "bg-emerald-500",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop"
  }
];

// ─── Unified post shape for rendering ───────────────────────

interface DisplayPost {
  id: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  content: string;
  category: string;
  color: string;
  imageUrl: string;
  isFromDb: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Projects: "bg-amber-500",
  Education: "bg-purple-500",
  Skills: "bg-orange-500",
  Sustainability: "bg-emerald-500",
  Facilities: "bg-rose-500",
  "News": "bg-blue-500",
};

function getCategoryColor(category: string | null): string {
  if (!category) return "bg-lotus-green";
  return CATEGORY_COLORS[category] ?? "bg-lotus-green";
}

// ─── Main Component ──────────────────────────────────────────

export default function Blog() {
  const { language, t } = useLanguage();
  const cms = useCmsContent("blog");
  const [selectedPost, setSelectedPost] = useState<DisplayPost | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Load published posts from the database
  const { data: dbPosts, isLoading } = trpc.blog.list.useQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedPost]);

  // Convert DB posts to unified display shape
  const dbDisplayPosts: DisplayPost[] = (dbPosts || []).map((p) => ({
    id: String(p.id),
    title: language === "mn" && p.titleMn ? p.titleMn : p.title,
    date: p.publishedAt
      ? new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    author: p.author || "Lotus Team",
    summary: (language === "mn" && p.summaryMn ? p.summaryMn : p.summary) || "",
    content: (language === "mn" && p.contentMn ? p.contentMn : p.content) || "",
    category: (language === "mn" && p.categoryMn ? p.categoryMn : p.category) || "",
    color: getCategoryColor(p.category),
    imageUrl: p.coverImageUrl || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    isFromDb: true,
  }));

  // Convert static posts to unified display shape
  const staticDisplayPosts: DisplayPost[] = STATIC_POSTS.map((p) => ({
    id: p.id,
    title: p.title[language],
    date: p.date,
    author: p.author,
    summary: p.summary[language],
    content: p.content[language],
    category: p.category[language],
    color: p.color,
    imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    isFromDb: false,
  }));

  // Use DB posts if any exist, otherwise show static posts
  const allPosts: DisplayPost[] = dbDisplayPosts.length > 0 ? dbDisplayPosts : staticDisplayPosts;

  // Collect unique categories from current post set
  const categoryKeys = Array.from(
    new Set(
      allPosts
        .map((p) => {
          // For DB posts, use the English category for filtering
          if (p.isFromDb) {
            const dbPost = (dbPosts || []).find((d) => String(d.id) === p.id);
            return dbPost?.category || p.category;
          }
          // For static posts, use English category key
          const staticPost = STATIC_POSTS.find((s) => s.id === p.id);
          return staticPost?.category.en || p.category;
        })
        .filter(Boolean)
    )
  );

  const filteredPosts =
    filterCategory === "all"
      ? allPosts
      : allPosts.filter((p) => {
          if (p.isFromDb) {
            const dbPost = (dbPosts || []).find((d) => String(d.id) === p.id);
            return dbPost?.category === filterCategory;
          }
          const staticPost = STATIC_POSTS.find((s) => s.id === p.id);
          return staticPost?.category.en === filterCategory;
        });

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFAF5]">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 lg:pt-24">
        <div className="relative h-[280px] lg:h-[360px] overflow-hidden">
          <img
            src={cms.get("hero", "imageUrl", HERO_BG)}
            alt="News & Updates"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <p
                className="text-lotus-orange font-semibold text-sm tracking-widest uppercase mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("blog.subtitle")}
              </p>
              <h1
                className="text-3xl lg:text-5xl font-bold text-white mb-4 max-w-xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {cms.get("hero", "title", t("blog.title"))}
              </h1>
              <p
                className="text-white/80 text-base lg:text-lg max-w-lg"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {cms.get("hero", "content", t("blog.description"))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border/50">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filterCategory === "all"
                  ? "bg-lotus-green text-white shadow-md"
                  : "bg-white text-foreground/70 hover:bg-lotus-green/10 hover:text-lotus-green border border-border/50"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {language === "en" ? "All Posts" : "Бүх нийтлэл"}
            </button>
            {categoryKeys.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  filterCategory === cat
                    ? "bg-lotus-green text-white shadow-md"
                    : "bg-white text-foreground/70 hover:bg-lotus-green/10 hover:text-lotus-green border border-border/50"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {/* For DB posts, show MN category name if language is MN */}
                {(() => {
                  if (language === "mn") {
                    const dbPost = (dbPosts || []).find((d) => d.category === cat);
                    return dbPost?.categoryMn || cat;
                  }
                  return cat;
                })()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 lg:py-16 flex-1">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-lotus-green" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span
                          className={`${post.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div
                      className="flex items-center gap-4 text-xs text-muted-foreground mb-3"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                    </div>

                    <h3
                      className="text-lg font-bold text-foreground mb-3 group-hover:text-lotus-green transition-colors duration-200 line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {post.title}
                    </h3>

                    <p
                      className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {post.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-lotus-green/10 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-lotus-green" />
                        </div>
                        <span
                          className="text-xs font-medium text-foreground/70"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {post.author}
                        </span>
                      </div>
                      <span
                        className="flex items-center gap-1 text-xs font-semibold text-lotus-green group-hover:gap-2 transition-all duration-200"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {t("blog.readMore")}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!isLoading && filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {language === "en" ? "No posts found in this category." : "Энэ ангилалд нийтлэл олдсонгүй."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedPost(null); }}
        >
          <div
            className="relative w-full max-w-3xl mx-4 my-8 lg:my-16 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-56 lg:h-72 overflow-hidden rounded-t-2xl">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                {selectedPost.category && (
                  <span
                    className={`${selectedPost.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-3`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {selectedPost.category}
                  </span>
                )}
                <h2
                  className="text-2xl lg:text-3xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {selectedPost.title}
                </h2>
              </div>
            </div>

            {/* Modal Meta */}
            <div
              className="px-6 lg:px-8 py-4 border-b border-border/50 flex items-center gap-6 text-sm text-muted-foreground"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {selectedPost.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {selectedPost.date}
              </span>
            </div>

            {/* Modal Content */}
            <div className="px-6 lg:px-8 py-8">
              <div className="prose prose-lg max-w-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {selectedPost.content.split("\n\n").map((paragraph, i) => {
                  // Check if paragraph starts with a bold heading pattern
                  const boldMatch = paragraph.match(/^([A-Z][A-Za-z\s&]+)\n([\s\S]+)/);
                  if (boldMatch) {
                    return (
                      <div key={i} className="mb-6">
                        <h3
                          className="text-lg font-bold text-foreground mb-2"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {boldMatch[1]}
                        </h3>
                        <p className="text-foreground/80 leading-relaxed">{boldMatch[2]}</p>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="text-foreground/80 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 lg:px-8 py-5 border-t border-border/50 flex items-center justify-between">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2.5 rounded-full border border-border hover:bg-muted/50 text-sm font-medium transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {language === "en" ? "Close" : "Хаах"}
              </button>
              <a
                href="#donate"
                className="px-6 py-2.5 rounded-full bg-lotus-orange text-white text-sm font-semibold hover:bg-lotus-orange/90 transition-colors shadow-md"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("nav.donate")}
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
