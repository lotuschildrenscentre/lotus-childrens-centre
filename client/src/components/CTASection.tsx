/*
 * Design: "Warm Embrace" — Organic Warmth
 * CTA: Full-width section with background image, overlay, and call-to-action
 * Dark background image -> white text
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Heart, Users } from "lucide-react";

const CTA_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/cta-bg-GJ9TxHXLq33nRpwT3icCsB.webp";

export default function CTASection() {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="donate" className="relative py-24 lg:py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={CTA_BG}
          alt="Mongolian countryside"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-lotus-dark/80" />
      </div>

      {/* Content */}
      <div className="relative container text-center">
        <div className={`max-w-3xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span
            className="text-sm font-semibold uppercase tracking-widest text-lotus-orange mb-4 block"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t("cta.subtitle")}
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {t("cta.title")}
          </h2>

          <p
            className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t("cta.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.justgiving.com/charity/lotuschildren-centre"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-lotus-orange text-white font-semibold text-lg hover:bg-lotus-orange/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Heart className="w-5 h-5" />
              {t("cta.donate")}
            </a>
            <a
              href="/about?tab=volunteers&view=form"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold text-lg hover:bg-white/25 transition-all duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Users className="w-5 h-5" />
              {t("cta.volunteer")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
