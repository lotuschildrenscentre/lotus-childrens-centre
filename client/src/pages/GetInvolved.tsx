/*
 * Design: "Warm Embrace" — Organic Warmth
 * Get Involved Page: Three main sections (Volunteer, Donation, Fundraise) with CTAs
 * Colors: Green, orange, purple accents matching logo
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Users, Zap } from "lucide-react";

export default function GetInvolved() {
  const { t, language } = useLanguage();

  const sections = [
    {
      id: "volunteer",
      icon: Users,
      titleKey: "getInvolved.volunteer.title",
      descKey: "getInvolved.volunteer.desc",
      buttonKey: "getInvolved.volunteer.button",
      color: "bg-lotus-green",
      bgColor: "bg-lotus-green/10",
      textColor: "text-lotus-green",
    },
    {
      id: "fundraise",
      icon: Zap,
      titleKey: "getInvolved.fundraise.title",
      descKey: "getInvolved.fundraise.desc",
      buttonKey: "getInvolved.fundraise.button",
      color: "bg-lotus-orange",
      bgColor: "bg-lotus-orange/10",
      textColor: "text-lotus-orange",
    },
    {
      id: "donate",
      icon: Heart,
      titleKey: "getInvolved.donate.title",
      descKey: "getInvolved.donate.desc",
      buttonKey: "getInvolved.donate.button",
      color: "bg-lotus-purple",
      bgColor: "bg-lotus-purple/10",
      textColor: "text-lotus-purple",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Hero Section */}
      <section className="container mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("getInvolved.hero.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("getInvolved.hero.desc")}
          </p>
        </div>

        {/* Three Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className={`${section.bgColor} rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                {/* Icon */}
                <div className={`${section.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white`}>
                  <Icon className="w-8 h-8" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t(section.titleKey)}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {t(section.descKey)}
                </p>

                {/* Button */}
                <button
                  className={`${section.color} text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 w-full`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t(section.buttonKey)}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="container mt-20 pt-12 border-t border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("getInvolved.contact.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {t("getInvolved.contact.desc")}
          </p>
          <a
            href="mailto:lotuschildrenscentre@gmail.com"
            className="inline-flex items-center px-6 py-3 bg-lotus-green text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t("getInvolved.contact.email")}
          </a>
        </div>
      </section>
    </div>
  );
}
