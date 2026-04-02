/*
 * Design: "Warm Embrace" — Organic Warmth
 * About: Split layout with image (left) and text (right)
 * Includes stat overlay on image and bullet points with lotus-colored dots
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { CheckCircle, Flower2 } from "lucide-react";

const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/about-section-4aLVCU3JgHnUwUPHwF3mg6.webp";

export default function AboutSection() {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const points = [
    "about.point1",
    "about.point2",
    "about.point3",
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-background" ref={ref}>
      <div className="container">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Flower2 className="w-5 h-5 text-lotus-orange" />
            <span
              className="text-sm font-semibold uppercase tracking-widest text-lotus-orange"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("about.subtitle")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight max-w-3xl mx-auto">
            {t("about.title")}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className={`relative transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={ABOUT_IMG}
                alt="Children playing outdoors in Mongolia"
                className="w-full h-auto object-cover aspect-[4/3]"
              />
              {/* Stat overlay */}
              <div className="absolute bottom-6 left-6 bg-lotus-green text-white px-6 py-4 rounded-2xl shadow-lg">
                <p className="text-sm font-medium opacity-90" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("about.stat")}
                </p>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-lotus-yellow/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-lotus-green/20 rounded-full blur-3xl" />
          </div>

          {/* Text Side */}
          <div className={`transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <p
              className="text-lg text-muted-foreground leading-relaxed mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("about.description")}
            </p>

            {/* Points */}
            <div className="space-y-4 mb-8">
              {points.map((pointKey) => (
                <div key={pointKey} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-lotus-green mt-0.5 shrink-0" />
                  <p
                    className="text-foreground/80"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t(pointKey)}
                  </p>
                </div>
              ))}
            </div>

            {/* Learn More Button */}
            <a
              href="/about"
              className="inline-flex items-center px-7 py-3 rounded-full bg-lotus-green text-white font-semibold hover:bg-lotus-green-dark transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("about.learnMore")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
