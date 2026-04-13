/*
 * Design: "Warm Embrace" — Organic Warmth
 * Causes: "Current Needs" section with cause cards showing progress bars
 * Matches the reference template's "Recent Causes" section
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Flower2, BookOpen, Stethoscope, Building } from "lucide-react";

const CAUSES_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/causes-section-SgvswqkB7Qa7zznaG2cWpR.webp";
const VOLUNTEER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/volunteer-section-CAm5pkJEC6fgK8AV9MZukV.webp";

const causes = [
  {
    titleKey: "causes.education.title",
    descKey: "causes.education.desc",
    icon: BookOpen,
    goal: 15000,
    raised: 8500,
    image: CAUSES_IMG,
    iconBg: "bg-lotus-green/15",
    iconColor: "text-lotus-green",
    barColor: "bg-lotus-green",
  },
  {
    titleKey: "causes.healthcare.title",
    descKey: "causes.healthcare.desc",
    icon: Stethoscope,
    goal: 20000,
    raised: 12000,
    image: VOLUNTEER_IMG,
    iconBg: "bg-lotus-orange/15",
    iconColor: "text-lotus-orange",
    barColor: "bg-lotus-orange",
  },
  {
    titleKey: "causes.facilities.title",
    descKey: "causes.facilities.desc",
    icon: Building,
    goal: 30000,
    raised: 9000,
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=400&fit=crop",
    iconBg: "bg-lotus-purple/15",
    iconColor: "text-lotus-purple",
    barColor: "bg-lotus-purple",
  },
];

export default function CausesSection() {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="causes" className="py-20 lg:py-28 bg-background" ref={ref}>
      <div className="container">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Flower2 className="w-5 h-5 text-lotus-orange" />
            <span
              className="text-sm font-semibold uppercase tracking-widest text-lotus-orange"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("causes.subtitle")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {t("causes.title")}
          </h2>
        </div>

        {/* Causes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause, index) => {
            const Icon = cause.icon;
            const progress = Math.round((cause.raised / cause.goal) * 100);

            return (
              <div
                key={cause.titleKey}
                className={`bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={cause.image}
                    alt={t(cause.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${cause.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${cause.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {t(cause.titleKey)}
                    </h3>
                  </div>

                  <p
                    className="text-muted-foreground text-sm leading-relaxed mb-5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t(cause.descKey)}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <span className="text-muted-foreground">Goal: <strong className="text-foreground">${cause.goal.toLocaleString()}</strong></span>
                      <span className="text-muted-foreground">Raised: <strong className="text-foreground">${cause.raised.toLocaleString()}</strong></span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cause.barColor} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: isVisible ? `${progress}%` : "0%" }}
                      />
                    </div>
                  </div>

                  {/* Donate Button */}
                  <a
                    href="https://www.justgiving.com/charity/lotuschildren-centre"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 rounded-full border-2 border-lotus-green text-lotus-green font-semibold text-sm hover:bg-lotus-green hover:text-white transition-all duration-300"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t("hero.donateNow")}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
