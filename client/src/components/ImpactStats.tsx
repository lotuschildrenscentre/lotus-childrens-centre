/*
 * Design: "Warm Embrace" — Organic Warmth
 * Impact Stats: 3 columns with animated counters, icons, and descriptions
 * Warm cream background with lotus-colored accents
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation, useCountUp } from "@/hooks/useScrollAnimation";
import { Home, Calendar, Sparkles } from "lucide-react";

const stats = [
  {
    labelKey: "stats.children.label",
    descKey: "stats.children.desc",
    icon: Home,
    countTo: 75,
    suffix: "+",
    color: "text-lotus-green",
    bgColor: "bg-lotus-green/10",
  },
  {
    labelKey: "stats.years.label",
    descKey: "stats.years.desc",
    icon: Calendar,
    countTo: 20,
    suffix: "+",
    color: "text-lotus-orange",
    bgColor: "bg-lotus-orange/10",
  },
  {
    labelKey: "stats.impact.label",
    descKey: "stats.impact.desc",
    icon: Sparkles,
    countTo: 500,
    suffix: "+",
    color: "text-lotus-purple",
    bgColor: "bg-lotus-purple/10",
  },
];

function StatCard({
  stat,
  index,
  isVisible,
}: {
  stat: (typeof stats)[0];
  index: number;
  isVisible: boolean;
}) {
  const { t } = useLanguage();
  const count = useCountUp(stat.countTo, 2500, isVisible);
  const Icon = stat.icon;

  return (
    <div
      className={`text-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Icon */}
      <div className={`w-20 h-20 rounded-2xl ${stat.bgColor} flex items-center justify-center mx-auto mb-6`}>
        <Icon className={`w-10 h-10 ${stat.color}`} />
      </div>

      {/* Description */}
      <p
        className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto leading-relaxed"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {t(stat.descKey)}
      </p>

      {/* Number */}
      <div className={`text-5xl lg:text-6xl font-bold ${stat.color} mb-2`}>
        {count}{stat.suffix}
      </div>

      {/* Label */}
      <p
        className="text-sm font-semibold uppercase tracking-wider text-foreground/70"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {t(stat.labelKey)}
      </p>
    </div>
  );
}

export default function ImpactStats() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-20 lg:py-28 bg-lotus-cream" ref={ref}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.labelKey}
              stat={stat}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
