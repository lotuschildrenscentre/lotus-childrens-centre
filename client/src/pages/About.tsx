/*
 * Design: "Warm Embrace" — Organic Warmth
 * About Page: Hero banner, Who We Are, History, Meet the Team, Aims & Beliefs
 * Ends with Volunteer/Donation/Fundraise CTAs
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Heart, Users, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Didi Ananda Kalika",
    role: "Founder & Director",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/about-team-section-eq8z9wm5QEMZPgCxEz9HwH.webp",
    bio: "Founder with deep compassion for vulnerable children",
  },
  {
    name: "Care Team",
    role: "Caregivers & Educators",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/about-team-section-eq8z9wm5QEMZPgCxEz9HwH.webp",
    bio: "Dedicated staff providing daily care and education",
  },
  {
    name: "Support Team",
    role: "Counsellors & Coordinators",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/about-team-section-eq8z9wm5QEMZPgCxEz9HwH.webp",
    bio: "Professionals supporting child development",
  },
];

const historyTimeline = [
  {
    year: "1995",
    title: "Founded",
    description: "Founded by Didi Ananda Kalika, Lotus Children's Centre begins with a single apartment, driven by compassion for vulnerable children on the streets of Ulaanbaatar",
  },
  {
    year: "1990s-2000s",
    title: "Growth",
    description: "Lotus grows to house, feed, care for and educate hundreds of children. At one stage, caring for around 150 children including many abandoned babies",
  },
  {
    year: "Present",
    title: "Today",
    description: "Caring for 65+ children directly, mostly young teenagers. Providing primary care, quality education, independence and life skills training, supporting children into young adulthood",
  },
];

export default function About() {
  const { t } = useLanguage();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { ref: aimsRef, isVisible: aimsVisible } = useScrollAnimation(0.1);
  const { ref: historyRef, isVisible: historyVisible } = useScrollAnimation(0.1);
  const { ref: teamRef, isVisible: teamVisible } = useScrollAnimation(0.1);
  const [activeTab, setActiveTab] = useState<"history" | "staff" | "volunteers" | "sponsors">("history");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative h-96 lg:h-[500px] overflow-hidden bg-gradient-to-b from-lotus-cream to-background"
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/about-hero-banner-bsoBSJVmoGQXo4iEasaaKa.webp"
            alt="Lotus Children's Centre"
            className={`w-full h-full object-cover transition-all duration-700 ${
              heroVisible ? "scale-100 opacity-100" : "scale-105 opacity-75"
            }`}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t("about.pageTitle") || "Our Story"}
              </h1>
              <p className="text-lg lg:text-xl max-w-2xl mx-auto px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {t("about.pageSubtitle") || "Building a loving home for vulnerable children since the early 2000s"}
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div
                className={`transition-all duration-700 ${
                  heroVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                <div className="inline-flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-lotus-orange" />
                  <span
                    className="text-sm font-semibold uppercase tracking-widest text-lotus-orange"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t("about.subtitle") || "Who We Are"}
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t("about.title") || "We Help Vulnerable Children Get a Better Life"}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("about.description") ||
                    "The Lotus Children's Centre is an official Mongolian non-governmental organisation (NGO) that currently acts as a home for around 75 vulnerable and abused Mongolian children and also takes part in community out-reach projects."}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("about.locationDesc") ||
                    "Located in Gachuurt in the suburbs of Ulaanbaatar, it is not only a home but also a centre for development for abandoned and vulnerable children."}
                </p>
              </div>
              <div
                className={`transition-all duration-700 delay-300 ${
                  heroVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
              >
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/about-hero-banner-bsoBSJVmoGQXo4iEasaaKa.webp"
                  alt="Children at Lotus"
                  className="rounded-3xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Aims & Beliefs Section */}
        <section ref={aimsRef} className="py-20 lg:py-28 bg-lotus-cream">
          <div className="container">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-lotus-green" />
                <span
                  className="text-sm font-semibold uppercase tracking-widest text-lotus-green"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("about.aimsSubtitle") || "Our Values"}
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t("about.aimsTitle") || "Aims and Beliefs"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {t("about.aimsIntro") ||
                  "Whilst Lotus is not a religious organisation, many of the beliefs of the founder help the children to overcome their backgrounds through loving care and belief in their potential."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: t("about.aim1Title") || "Primary Care",
                  desc: t("about.aim1Desc") || "Provide food, healthcare, clothing and suitable accommodation",
                },
                {
                  icon: Users,
                  title: t("about.aim2Title") || "Development",
                  desc: t("about.aim2Desc") || "Quality education, counselling, and life skills for breaking poverty cycles",
                },
                {
                  icon: Lightbulb,
                  title: t("about.aim3Title") || "Family Support",
                  desc: t("about.aim3Desc") || "Love, attention, and family group support for every child",
                },
              ].map((aim, idx) => {
                const Icon = aim.icon;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl p-8 shadow-md border border-border/50 transition-all duration-700 ${
                      aimsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${idx * 150}ms` }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-lotus-green/10 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-lotus-green" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {aim.title}
                    </h3>
                    <p className="text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {aim.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* History & Team Tabs Section */}
        <section ref={historyRef} className="py-20 lg:py-28 bg-background">
          <div className="container">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-14 justify-center">
              <button
                onClick={() => setActiveTab("history")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "history"
                    ? "bg-lotus-orange text-white shadow-lg"
                    : "bg-lotus-cream text-foreground hover:bg-lotus-cream/80"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("about.historyTab") || "History"}
              </button>
              <button
                onClick={() => setActiveTab("staff")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "staff"
                    ? "bg-lotus-green text-white shadow-lg"
                    : "bg-lotus-cream text-foreground hover:bg-lotus-cream/80"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("about.staffTab") || "Daily Staff"}
              </button>
              <button
                onClick={() => setActiveTab("volunteers")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "volunteers"
                    ? "bg-lotus-purple text-white shadow-lg"
                    : "bg-lotus-cream text-foreground hover:bg-lotus-cream/80"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("about.volunteersTab") || "Volunteers"}
              </button>
              <button
                onClick={() => setActiveTab("sponsors")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === "sponsors"
                    ? "bg-lotus-orange text-white shadow-lg"
                    : "bg-lotus-cream text-foreground hover:bg-lotus-cream/80"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("about.sponsorsTab") || "Sponsors"}
              </button>
            </div>

            {/* History Tab Content */}
            {activeTab === "history" && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t("about.historyTitle") || "Our Journey"}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t("about.historyDesc") || "Over two decades of dedicated service to vulnerable children in Mongolia"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {historyTimeline.map((item, idx) => (
                    <div
                      key={idx}
                      className={`bg-white rounded-2xl p-8 border-l-4 border-lotus-orange shadow-md transition-all duration-700 ${
                        historyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${idx * 150}ms` }}
                    >
                      <div className="text-3xl font-bold text-lotus-orange mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {item.year}
                      </div>
                      <h4 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/about-history-section-Ndg4AeFggy2uhFzztj4uss.webp"
                    alt="Lotus history timeline"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Daily Staff Tab Content */}
            {activeTab === "staff" && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t("about.teamTitle") || "Meet Our Dedicated Team"}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t("about.teamDesc") || "Compassionate professionals committed to changing children's lives"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {teamMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-700 ${
                        teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${idx * 150}ms` }}
                    >
                      <div className="h-64 overflow-hidden bg-lotus-cream">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {member.name}
                        </h4>
                        <p className="text-lotus-orange font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {member.role}
                        </p>
                        <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/about-team-section-kuWXNUuypJ6Gq8ZC8wTW2K.webp"
                    alt="Lotus team with children"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Volunteers Tab Content */}
            {activeTab === "volunteers" && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t("about.volunteersTitle") || "Volunteers from Around the World"}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t("about.volunteersDesc") || "International and local volunteers dedicate their time to support our mission"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-12 border border-border/50 shadow-md text-center">
                  <p className="text-lg text-muted-foreground mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t("about.volunteersContent") || "Volunteers from all over the world are always welcome at Lotus. Whether you can visit in person or contribute remotely, your support makes a real difference in the lives of vulnerable children."}
                  </p>
                  <Button className="bg-lotus-purple hover:bg-lotus-purple/90 text-white px-8 py-3 rounded-full font-semibold">
                    {t("about.volunteersRegister") || "Register as a Volunteer"}
                  </Button>
                </div>
              </div>
            )}

            {/* Sponsors Tab Content */}
            {activeTab === "sponsors" && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t("about.sponsorsTitle") || "Our Generous Sponsors"}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t("about.sponsorsDesc") || "Priceless help from organizations that believe in our mission"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-12 border border-border/50 shadow-md text-center">
                  <p className="text-lg text-muted-foreground mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t("about.sponsorsContent") || "Our sponsors play a vital role in supporting Lotus Children's Centre. Through their generosity and commitment, we are able to provide quality care, education, and opportunities for vulnerable children in Mongolia."}
                  </p>
                  <Button className="bg-lotus-orange hover:bg-lotus-orange/90 text-white px-8 py-3 rounded-full font-semibold">
                    {t("about.sponsorsPartner") || "Become a Sponsor"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section - Volunteer/Donation/Fundraise */}
        <section className="py-20 lg:py-28 bg-lotus-cream">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t("about.ctaTitle") || "Join Us in Making a Difference"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {t("about.ctaDesc") || "There are many ways to support Lotus Children's Centre and help vulnerable children"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: t("services.volunteer.title") || "Volunteer",
                  desc: t("services.volunteer.desc") || "On-site or from further away, volunteers are always welcome at Lotus.",
                  color: "text-lotus-yellow",
                  bgColor: "bg-lotus-yellow/10",
                  buttonColor: "bg-lotus-yellow hover:bg-lotus-yellow/90",
                  cta: t("services.volunteer.cta") || "Register Now",
                },
                {
                  icon: Heart,
                  title: t("services.donation.title") || "Donation",
                  desc: t("services.donation.desc") || "Through money or objects, donations help with the running of Lotus.",
                  color: "text-lotus-orange",
                  bgColor: "bg-lotus-orange/10",
                  buttonColor: "bg-lotus-orange hover:bg-lotus-orange/90",
                  cta: t("services.donation.cta") || "Donate Now",
                },
                {
                  icon: Lightbulb,
                  title: t("services.fundraise.title") || "Fundraise",
                  desc: t("services.fundraise.desc") || "Take a look at the different events organised for Lotus Children's Centre.",
                  color: "text-lotus-purple",
                  bgColor: "bg-lotus-purple/10",
                  buttonColor: "bg-lotus-purple hover:bg-lotus-purple/90",
                  cta: t("services.fundraise.cta") || "Read More",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl p-8 border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 ${
                      aimsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${idx * 150}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-xl ${item.bgColor} flex items-center justify-center mb-6`}>
                      <Icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.desc}
                    </p>
                    <Button
                      className={`w-full ${item.buttonColor} text-white font-semibold transition-all duration-300`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
