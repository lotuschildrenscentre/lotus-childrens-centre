/*
 * Design: "Warm Embrace" — Organic Warmth
 * Get Involved Page: Hero + 3 opportunity cards + why section + contact CTA
 * Colors: Green, orange, purple cards matching the service cards on home
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Users, Zap, Heart, ArrowRight } from "lucide-react";

const VOLUNTEER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/volunteer-section-CAm5pkJEC6fgK8AV9MZukV.webp";

export default function GetInvolved() {
  const { t } = useLanguage();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation(0.1);
  const { ref: detailRef, isVisible: detailVisible } = useScrollAnimation(0.1);

  const opportunities = [
    {
      icon: Users,
      titleKey: "getInvolved.volunteerTitle",
      descKey: "getInvolved.volunteerDesc",
      ctaKey: "getInvolved.volunteerCta",
      color: "bg-lotus-green",
      hoverColor: "hover:bg-lotus-green-dark",
      iconBg: "bg-lotus-green/10",
      iconColor: "text-lotus-green",
      borderColor: "border-lotus-green/20",
      details: [
        "getInvolved.volunteerDetail1",
        "getInvolved.volunteerDetail2",
        "getInvolved.volunteerDetail3",
      ],
      href: "/about?tab=volunteers&view=form",
      external: false,
    },
    {
      icon: Zap,
      titleKey: "getInvolved.fundraiseTitle",
      descKey: "getInvolved.fundraiseDesc",
      ctaKey: "getInvolved.fundraiseCta",
      color: "bg-lotus-orange",
      hoverColor: "hover:bg-lotus-orange/90",
      iconBg: "bg-lotus-orange/10",
      iconColor: "text-lotus-orange",
      borderColor: "border-lotus-orange/20",
      details: [
        "getInvolved.fundraiseDetail1",
        "getInvolved.fundraiseDetail2",
        "getInvolved.fundraiseDetail3",
      ],
      href: "https://www.justgiving.com/create-page/in-memory?&sessionId=2552b83",
      external: true,
    },
    {
      icon: Heart,
      titleKey: "getInvolved.donateTitle",
      descKey: "getInvolved.donateDesc",
      ctaKey: "getInvolved.donateCta",
      color: "bg-lotus-purple",
      hoverColor: "hover:bg-lotus-purple/90",
      iconBg: "bg-lotus-purple/10",
      iconColor: "text-lotus-purple",
      borderColor: "border-lotus-purple/20",
      details: [
        "getInvolved.donateDetail1",
        "getInvolved.donateDetail2",
        "getInvolved.donateDetail3",
      ],
      href: "https://www.justgiving.com/charity/lotuschildren-centre",
      external: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden" ref={heroRef}>
          <div className="absolute inset-0 bg-gradient-to-br from-lotus-cream via-white to-lotus-green/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-lotus-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-lotus-orange/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative container text-center">
            <div className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lotus-green/10 mb-6">
                <Heart className="w-8 h-8 text-lotus-green" />
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-lotus-dark leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("getInvolved.heroTitle")}
              </h1>

              <p
                className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("getInvolved.heroDesc")}
              </p>
            </div>
          </div>
        </section>

        {/* Opportunity Cards */}
        <section className="py-16 lg:py-24 bg-white" ref={cardsRef}>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {opportunities.map((opp, i) => {
                const Icon = opp.icon;
                return (
                  <div
                    key={i}
                    className={`group relative bg-white rounded-2xl border ${opp.borderColor} p-8 shadow-sm hover:shadow-xl transition-all duration-500 ${
                      cardsVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
                    style={{ transitionDelay: `${i * 150}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-xl ${opp.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${opp.iconColor}`} />
                    </div>

                    <h3
                      className="text-xl font-bold text-lotus-dark mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {t(opp.titleKey)}
                    </h3>

                    <p
                      className="text-foreground/60 leading-relaxed mb-6"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {t(opp.descKey)}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {opp.details.map((detailKey, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full ${opp.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <ArrowRight className={`w-3 h-3 ${opp.iconColor}`} />
                          </div>
                          <span
                            className="text-sm text-foreground/70"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {t(detailKey)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={opp.href}
                      target={opp.external ? "_blank" : undefined}
                      rel={opp.external ? "noopener noreferrer" : undefined}
                      className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full ${opp.color} text-white font-semibold text-sm ${opp.hoverColor} transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {t(opp.ctaKey)}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Get Involved Section */}
        <section className="py-16 lg:py-24 bg-lotus-cream/50" ref={detailRef}>
          <div className="container">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${detailVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {/* Image */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={VOLUNTEER_IMG}
                    alt="Volunteers at Lotus Children's Centre"
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-white rounded-xl shadow-xl p-5 border border-lotus-green/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-lotus-green/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-lotus-green" />
                    </div>
                    <div>
                      <span className="block text-2xl font-bold text-lotus-dark" style={{ fontFamily: "'Playfair Display', serif" }}>
                        75+
                      </span>
                      <span className="block text-xs text-foreground/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {t("getInvolved.childrenHelped")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div>
                <span
                  className="text-sm font-semibold uppercase tracking-widest text-lotus-green mb-4 block"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("getInvolved.whyTitle")}
                </span>

                <h2
                  className="text-3xl sm:text-4xl font-bold text-lotus-dark leading-tight mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t("getInvolved.whyHeading")}
                </h2>

                <p
                  className="text-foreground/70 leading-relaxed mb-6"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("getInvolved.whyDesc1")}
                </p>

                <p
                  className="text-foreground/70 leading-relaxed mb-8"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("getInvolved.whyDesc2")}
                </p>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { number: "75+", labelKey: "getInvolved.statChildren" },
                    { number: "20+", labelKey: "getInvolved.statYears" },
                    { number: "500+", labelKey: "getInvolved.statLives" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 rounded-xl bg-white shadow-sm border border-border">
                      <span className="block text-2xl font-bold text-lotus-green" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {stat.number}
                      </span>
                      <span className="block text-xs text-foreground/60 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {t(stat.labelKey)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
