/*
 * Design: "Warm Embrace" — Organic Warmth
 * Service Cards: 3 cards (Volunteer, Donation, Fundraise) with logo colors
 * Yellow card, Orange card, Purple card — matching the reference template layout
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Users, Heart, HandHeart } from "lucide-react";

const DONATE_URL = "https://www.justgiving.com/charity/lotuschildren-centre";
const FUNDRAISE_URL = "https://www.justgiving.com/create-page/in-memory?&sessionId=2552b83";

const cards = [
  {
    titleKey: "services.volunteer.title",
    descKey: "services.volunteer.desc",
    ctaKey: "services.volunteer.cta",
    icon: Users,
    bgClass: "bg-lotus-yellow",
    textClass: "text-amber-900",
    ctaClass: "text-amber-900 border-amber-900/30 hover:bg-amber-900/10",
    iconBg: "bg-white/60",
    iconColor: "text-amber-700",
    href: "/about?tab=volunteers&view=form",
    external: false,
  },
  {
    titleKey: "services.donation.title",
    descKey: "services.donation.desc",
    ctaKey: "services.donation.cta",
    icon: Heart,
    bgClass: "bg-lotus-orange",
    textClass: "text-white",
    ctaClass: "text-white border-white/40 hover:bg-white/15",
    iconBg: "bg-white/25",
    iconColor: "text-white",
    href: DONATE_URL,
    external: true,
  },
  {
    titleKey: "services.fundraise.title",
    descKey: "services.fundraise.desc",
    ctaKey: "services.fundraise.cta",
    icon: HandHeart,
    bgClass: "bg-lotus-purple",
    textClass: "text-white",
    ctaClass: "text-white border-white/40 hover:bg-white/15",
    iconBg: "bg-white/25",
    iconColor: "text-white",
    href: FUNDRAISE_URL,
    external: true,
  },
];

export default function ServiceCards() {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="relative -mt-16 z-10 pb-16" ref={ref}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.titleKey}
                className={`${card.bgClass} rounded-2xl p-8 lg:p-10 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 ${card.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-bold ${card.textClass} mb-3`}>
                  {t(card.titleKey)}
                </h3>

                {/* Description */}
                <p
                  className={`${card.textClass} opacity-85 leading-relaxed mb-6`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t(card.descKey)}
                </p>

                {/* CTA */}
                <a
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  className={`inline-flex items-center px-5 py-2 rounded-full border ${card.ctaClass} font-semibold text-sm uppercase tracking-wider transition-all duration-200`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t(card.ctaKey)}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
