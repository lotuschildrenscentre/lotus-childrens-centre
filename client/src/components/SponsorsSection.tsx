/*
 * Design: "Warm Embrace" — Organic Warmth
 * Sponsors: Horizontal auto-scrolling logo marquee
 * Partners are now fully dynamic — managed via Admin → Page Content → Our Partners
 * Falls back to hardcoded defaults when no DB partners exist yet.
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsContent } from "@/hooks/useCmsContent";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { trpc } from "@/lib/trpc";
import { Flower2 } from "lucide-react";

const defaultSponsors = [
  {
    name: "Ulaanbaatar Elite International School",
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/elite-international-school_1cc7eabc.webp",
    websiteUrl: null,
  },
  {
    name: "Hobby School",
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/hobby-school_35883076.jpg",
    websiteUrl: null,
  },
  {
    name: "The English School of Mongolia",
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/english-school-mongolia_b49b001f.png",
    websiteUrl: null,
  },
  {
    name: "Gulf for Good",
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/gulf-for-good_3c9f8719.jpg",
    websiteUrl: null,
  },
  {
    name: "Holiday Inn Ulaanbaatar",
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/holiday-inn_c355577f.jpg",
    websiteUrl: null,
  },
  {
    name: "Алтан Тариа (Altan Taria)",
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/altan-taria_671e2c1c.jpg",
    websiteUrl: null,
  },
  {
    name: "IVCO Joint Venture Company",
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/ivco_e526e4c8.jpg",
    websiteUrl: null,
  },
  {
    name: "AMURT",
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/amurt_dad6328d.png",
    websiteUrl: null,
  },
  {
    name: "Misheel Kids Foundation",
    logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/misheel-kids-foundation_79a57fcd.jpg",
    websiteUrl: null,
  },
];

export default function SponsorsSection() {
  const { t } = useLanguage();
  const cms = useCmsContent("home");
  const { ref, isVisible } = useScrollAnimation(0.1);

  // Load partners from DB
  const { data: dbPartners } = trpc.partners.list.useQuery();

  // Use DB partners if available, otherwise fall back to hardcoded defaults
  const displaySponsors =
    dbPartners && dbPartners.length > 0
      ? dbPartners.map((p) => ({ name: p.name, logo: p.logoUrl, websiteUrl: p.websiteUrl ?? null }))
      : defaultSponsors;

  // Duplicate the sponsors array for seamless infinite scroll
  const duplicatedSponsors = [...displaySponsors, ...displaySponsors];

  return (
    <section className="py-20 lg:py-28 bg-background overflow-hidden" ref={ref}>
      <div className="container">
        {/* Section Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Flower2 className="w-5 h-5 text-lotus-orange" />
            <span
              className="text-sm font-semibold uppercase tracking-widest text-lotus-orange"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {cms.get("sponsors", "title", t("sponsors.subtitle"))}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight max-w-3xl mx-auto">
            {cms.get("sponsors", "content", t("sponsors.title"))}
          </h2>
        </div>
      </div>

      {/* Auto-scrolling logo marquee */}
      <div
        className={`relative transition-all duration-700 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {duplicatedSponsors.map((sponsor, index) => {
            const card = (
              <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-2xl shadow-md border border-border/50 flex items-center justify-center p-5 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
              </div>
            );
            return (
              <div
                key={`${sponsor.name}-${index}`}
                className="flex-shrink-0 mx-6 sm:mx-10"
              >
                {sponsor.websiteUrl ? (
                  <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer">
                    {card}
                  </a>
                ) : (
                  card
                )}
                <p
                  className="text-xs text-muted-foreground text-center mt-3 max-w-36 sm:max-w-44 mx-auto leading-tight"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {sponsor.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inline keyframes for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}
