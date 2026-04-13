/*
 * Design: "Warm Embrace" — Organic Warmth
 * Hero: Full-width hero with warm background image, overlay, heading, and CTA
 * Dark background image -> white/light text
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/hero-bg-VoVTJLkkPAnrB6FadEp2TK.webp";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt="Mongolian children reading together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container pt-28 pb-20 lg:pt-32 lg:pb-28">
        <div className="max-w-2xl">
          {/* Subtitle badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Heart className="w-4 h-4 text-lotus-orange" fill="currentColor" />
            <span className="text-sm font-medium text-white/90" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {t("hero.subtitle")}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            {t("hero.title")}
          </h1>

          {/* Description */}
          <p
            className="text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t("hero.description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <a
              href="https://www.justgiving.com/charity/lotuschildren-centre"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-lotus-orange text-white font-semibold text-lg hover:bg-lotus-orange/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Heart className="w-5 h-5" />
              {t("hero.donateNow")}
            </a>
            <a
              href="#about"
              className="inline-flex items-center px-8 py-4 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold text-lg hover:bg-white/25 transition-all duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("about.learnMore")}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,80 C360,120 720,40 1080,80 C1260,100 1380,60 1440,80 L1440,120 L0,120 Z" fill="oklch(0.995 0.002 85)" />
        </svg>
      </div>
    </section>
  );
}
