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
import {
  Heart,
  Users,
  Lightbulb,
  ArrowRight,
  FileText,
  HelpCircle,
  ChevronDown,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Daily Staff Data ── */
const dailyStaff = [
  { name: "Didi Ananda Kalika", role: "Director", initials: "DK", color: "bg-lotus-orange" },
  { name: "Bolormaa", role: "Centre Manager", initials: "B", color: "bg-lotus-green" },
  { name: "Suugi", role: "Administration", initials: "S", color: "bg-lotus-purple" },
  { name: "Otara", role: "House Mother", initials: "O", color: "bg-lotus-yellow" },
  { name: "Delgermaa", role: "House Mother", initials: "D", color: "bg-lotus-orange" },
  { name: "Narantuya", role: "House Mother", initials: "N", color: "bg-lotus-green" },
  { name: "Enkhtuvshin", role: "House Mother", initials: "E", color: "bg-lotus-purple" },
  { name: "Udval", role: "House Mother", initials: "U", color: "bg-lotus-yellow" },
  { name: "Batbileg", role: "Cook", initials: "BB", color: "bg-lotus-orange" },
  { name: "Sainbuyan", role: "Doctor", initials: "SB", color: "bg-lotus-green" },
  { name: "Ganbat", role: "Driver", initials: "G", color: "bg-lotus-purple" },
  { name: "Bold", role: "Maintenance", initials: "B", color: "bg-lotus-yellow" },
  { name: "Bold", role: "Maintenance", initials: "B", color: "bg-lotus-orange" },
  { name: "Batmunkh", role: "Boiler House", initials: "BM", color: "bg-lotus-green" },
  { name: "Batjargal", role: "Boiler House", initials: "BJ", color: "bg-lotus-purple" },
];

/* ── Application Form Questions ── */
const applicationQuestions = [
  { id: "fullName", label: "Full name", type: "text" },
  { id: "dob", label: "Date of Birth", type: "date" },
  { id: "nationality", label: "Nationality", type: "text" },
  { id: "languages", label: "Languages and level (beginner, intermediate, advanced)", type: "textarea" },
  { id: "email", label: "Email address", type: "email" },
  { id: "dates", label: "Intended volunteering dates", type: "text" },
  { id: "howHelp", label: "How do you feel you can best help Lotus?", type: "textarea" },
  { id: "experience", label: "What relevant experience and/or qualifications do you have for volunteering at Lotus? (Please provide reference)", type: "textarea" },
  { id: "whyVolunteer", label: "Why do you want to volunteer at Lotus?", type: "textarea" },
  { id: "criminalRecord", label: "Do you have a criminal record?", type: "text" },
  { id: "convictions", label: "Do you have any previous convictions, warnings or court rulings that prevented you from working with children?", type: "text" },
  { id: "codeOfConduct", label: "Have you read and understood the Lotus Children's Centre Code of Conduct?", type: "text" },
  { id: "hearAbout", label: "How did you hear about Lotus?", type: "text" },
];

/* ── FAQ Data ── */
const faqData = [
  {
    q: "Can I volunteer if I haven't volunteered before?",
    a: "Obviously it is advantageous if you have experience of volunteering and working with children, but a lack of such experience does not mean you are ineligible to volunteer. The most important thing is your attitude towards taking on this new experience and learning as you go. If you do not have experience you should show that you are enthusiastic and proactive in organising your project.",
  },
  {
    q: "Can you help me obtain a visa?",
    a: "To volunteer you just need to apply for a standard tourist visa which, depending on your nationality, is usually valid for 30 days. This can be extended by a further 30 days if you register at the immigration office within 7 days of your arrival. You will not need an invitation letter from us for a standard tourist visa. As an NGO we are unable to provide support for longer-term visas.",
  },
  {
    q: "What happens when I arrive in Mongolia?",
    a: "It is strongly recommended that you spend at least one night in Ulaanbaatar when you arrive in Mongolia before coming out to Lotus. This gives you a chance to acclimatise, catch up on sleep, change money, buy a SIM card and register at immigration if necessary. If you would like to reserve a stay at the Lotus Guesthouse then contact lotusguest@gmail.com.",
  },
  {
    q: "What happens when I arrive at Lotus?",
    a: "When you arrive at Lotus you will usually be greeted by the volunteer coordinator (and lots of children!) You will be shown to your accommodation and introduced to your new volunteer colleagues. Your orientation will involve a tour of the centre covering bathroom facilities, where to collect drinking water, the kitchen and dining area, and also anything relevant to your project.",
  },
  {
    q: "How will I be managed as a volunteer?",
    a: "Our volunteer coordinator is on-site at least 5 days a week during the summer volunteer season, and is always contactable by phone and email. They will offer guidance for your project, and ideas for other things you can work on. However, you are expected to be proactive and self-motivated in your approach to work.",
  },
  {
    q: "Do I need a specific project to work on at Lotus?",
    a: "Our volunteers work on a variety of projects, usually depending on their own skills or interests. It is very important that you have a specific project that will be your main focus during your volunteering period. Spare time from your main project can be used helping out with daily tasks.",
  },
  {
    q: "Am I expected to work every day?",
    a: "You are expected to complete the full term of volunteering that is agreed at the application stage. However, you are welcome to take some days off during this time if you wish, but it should be arranged with the volunteer coordinator so it can be put into the schedule.",
  },
  {
    q: "What provisions are there for medical care?",
    a: "Lotus employs a dedicated doctor that works normal office hours from Monday-Friday. Outside of this time we have 24 hour access to our medical room, and all of our staff are first-aid trained. There is a small hospital and pharmacy in the village, and there is access for an ambulance from the city if necessary.",
  },
  {
    q: "Why should I have to pay to volunteer?",
    a: "At Lotus, regrettably we simply cannot afford to host volunteers without a financial contribution. Volunteers are provided with traditional ger accommodation with separate toilet and shower facilities, and three meals per day. Your contribution covers the cost of providing and upkeeping these facilities.",
  },
  {
    q: "How can I overcome the language barrier?",
    a: "Many of the Lotus children speak English at varying levels, and most of them understand basic English. The children help each other with languages and communicating with volunteers so if you find you cannot communicate clearly directly with a specific child then another child or staff member will be able to translate.",
  },
  {
    q: "What items can I bring to donate?",
    a: "Please see our wishlist for items that we are in need of. You can also contact the volunteer coordinator for advice on anything that there is an immediate need for. It may be that the most helpful thing would be to donate money towards a larger item that we need to buy.",
  },
];

/* ── Sponsors Data (same as front page) ── */
const sponsors = [
  { name: "Ulaanbaatar Elite International School", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/elite-international-school_1cc7eabc.webp" },
  { name: "Hobby School", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/hobby-school_35883076.jpg" },
  { name: "The English School of Mongolia", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/english-school-mongolia_b49b001f.png" },
  { name: "Gulf for Good", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/gulf-for-good_3c9f8719.jpg" },
  { name: "Holiday Inn Ulaanbaatar", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/holiday-inn_c355577f.jpg" },
  { name: "Алтан Тариа (Altan Taria)", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/altan-taria_671e2c1c.jpg" },
  { name: "IVCO Joint Venture Company", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/ivco_e526e4c8.jpg" },
  { name: "AMURT", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/amurt_dad6328d.png" },
  { name: "Misheel Kids Foundation", logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/misheel-kids-foundation_79a57fcd.jpg" },
];

const historyTimeline = [
  {
    year: "1995",
    title: "Founded",
    description:
      "Founded by Didi Ananda Kalika, Lotus Children's Centre begins with a single apartment, driven by compassion for vulnerable children on the streets of Ulaanbaatar",
  },
  {
    year: "1990s-2000s",
    title: "Growth",
    description:
      "Lotus grows to house, feed, care for and educate hundreds of children. At one stage, caring for around 150 children including many abandoned babies",
  },
  {
    year: "Present",
    title: "Today",
    description:
      "Caring for 65+ children directly, mostly young teenagers. Providing primary care, quality education, independence and life skills training, supporting children into young adulthood",
  },
];

export default function About() {
  const { t } = useLanguage();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { ref: aimsRef, isVisible: aimsVisible } = useScrollAnimation(0.1);
  const { ref: historyRef, isVisible: historyVisible } = useScrollAnimation(0.1);
  // teamVisible is always true since tab content renders conditionally
  const teamVisible = true;
  const [activeTab, setActiveTab] = useState<"history" | "staff" | "volunteers" | "sponsors">("history");

  /* Volunteers sub-view state */
  const [volunteerView, setVolunteerView] = useState<"main" | "form" | "faq">("main");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const duplicatedSponsors = [...sponsors, ...sponsors];

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
              <h1
                className="text-4xl lg:text-6xl font-bold mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("about.pageTitle") || "Our Story"}
              </h1>
              <p
                className="text-lg lg:text-xl max-w-2xl mx-auto px-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("about.pageSubtitle") ||
                  "Building a loving home for vulnerable children since the early 2000s"}
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
                <h2
                  className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t("about.title") || "We Help Vulnerable Children Get a Better Life"}
                </h2>
                <p
                  className="text-lg text-muted-foreground mb-6 leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {t("about.description") ||
                    "The Lotus Children's Centre is an official Mongolian non-governmental organisation (NGO) that currently acts as a home for around 75 vulnerable and abused Mongolian children and also takes part in community out-reach projects."}
                </p>
                <p
                  className="text-lg text-muted-foreground leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
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
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("about.aimsTitle") || "Aims and Beliefs"}
              </h2>
              <p
                className="text-lg text-muted-foreground max-w-3xl mx-auto"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("about.aimsIntro") ||
                  "Whilst Lotus is not a religious organisation, many of the beliefs of the founder help the children to overcome their backgrounds through loving care and belief in their potential."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: t("about.aim1Title") || "Primary Care",
                  desc:
                    t("about.aim1Desc") ||
                    "Provide food, healthcare, clothing and suitable accommodation",
                },
                {
                  icon: Users,
                  title: t("about.aim2Title") || "Development",
                  desc:
                    t("about.aim2Desc") ||
                    "Quality education, counselling, and life skills for breaking poverty cycles",
                },
                {
                  icon: Lightbulb,
                  title: t("about.aim3Title") || "Family Support",
                  desc:
                    t("about.aim3Desc") ||
                    "Love, attention, and family group support for every child",
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
                    <h3
                      className="text-xl font-bold text-foreground mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
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
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-14 justify-center">
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 sm:px-8 py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
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
                className={`px-6 sm:px-8 py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                  activeTab === "staff"
                    ? "bg-lotus-green text-white shadow-lg"
                    : "bg-lotus-cream text-foreground hover:bg-lotus-cream/80"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("about.staffTab") || "Daily Staff"}
              </button>
              <button
                onClick={() => {
                  setActiveTab("volunteers");
                  setVolunteerView("main");
                }}
                className={`px-6 sm:px-8 py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
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
                className={`px-6 sm:px-8 py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                  activeTab === "sponsors"
                    ? "bg-lotus-orange text-white shadow-lg"
                    : "bg-lotus-cream text-foreground hover:bg-lotus-cream/80"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("about.sponsorsTab") || "Sponsors"}
              </button>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* History Tab Content (unchanged) */}
            {/* ═══════════════════════════════════════════════ */}
            {activeTab === "history" && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <h3
                    className="text-3xl font-bold text-foreground mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t("about.historyTitle") || "Our Journey"}
                  </h3>
                  <p
                    className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t("about.historyDesc") ||
                      "Over two decades of dedicated service to vulnerable children in Mongolia"}
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
                      <div
                        className="text-3xl font-bold text-lotus-orange mb-3"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.year}
                      </div>
                      <h4
                        className="text-xl font-bold text-foreground mb-3"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
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

            {/* ═══════════════════════════════════════════════ */}
            {/* Daily Staff Tab Content — UPDATED */}
            {/* ═══════════════════════════════════════════════ */}
            {activeTab === "staff" && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <h3
                    className="text-3xl font-bold text-foreground mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t("about.teamTitle") || "Meet Our Dedicated Team"}
                  </h3>
                  <p
                    className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t("about.teamDesc") ||
                      "Compassionate professionals committed to changing children's lives"}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {dailyStaff.map((member, idx) => (
                    <div
                      key={idx}
                      className={`bg-white rounded-2xl p-6 shadow-md border border-border/50 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${
                        teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${Math.min(idx * 80, 800)}ms` }}
                    >
                      {/* Avatar with initials */}
                      <div
                        className={`w-20 h-20 rounded-full ${member.color} flex items-center justify-center mx-auto mb-4 shadow-md`}
                      >
                        <span
                          className="text-white text-xl font-bold"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {member.initials}
                        </span>
                      </div>
                      <h4
                        className="text-base font-bold text-foreground mb-1 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {member.name}
                      </h4>
                      <p
                        className="text-sm text-lotus-green font-semibold"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {member.role}
                      </p>
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

            {/* ═══════════════════════════════════════════════ */}
            {/* Volunteers Tab Content — UPDATED */}
            {/* ═══════════════════════════════════════════════ */}
            {activeTab === "volunteers" && (
              <div className="space-y-10">
                {/* Main volunteer view */}
                {volunteerView === "main" && (
                  <>
                    <div className="text-center mb-8">
                      <h3
                        className="text-3xl font-bold text-foreground mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Volunteering at Lotus
                      </h3>
                    </div>

                    <div className="bg-white rounded-2xl p-8 lg:p-12 border border-border/50 shadow-md">
                      <p
                        className="text-lg text-muted-foreground leading-relaxed mb-8"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        At Lotus we employ a small team of local staff, therefore there are many ways
                        in which volunteers can help us throughout the year. The greatest need for
                        volunteers is in the summer months June-August as this is when the children
                        are on holiday from school. Our volunteers help out with a range of things
                        from organising activities and events for the children, to teaching
                        extra-curricular classes such as sports or languages, to helping with cooking,
                        maintenance, administration and fundraising.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          onClick={() => setVolunteerView("form")}
                          className="bg-lotus-green hover:bg-lotus-green/90 text-white px-8 py-4 rounded-full font-semibold text-base gap-2"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          <FileText className="w-5 h-5" />
                          Application Form
                        </Button>
                        <Button
                          onClick={() => setVolunteerView("faq")}
                          className="bg-lotus-purple hover:bg-lotus-purple/90 text-white px-8 py-4 rounded-full font-semibold text-base gap-2"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          <HelpCircle className="w-5 h-5" />
                          FAQ
                        </Button>
                      </div>
                    </div>

                    {/* Testimonials preview */}
                    <div className="text-center mt-12 mb-6">
                      <span
                        className="text-sm font-semibold uppercase tracking-widest text-lotus-purple"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Testimonials
                      </span>
                      <h4
                        className="text-2xl font-bold text-foreground mt-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Stories from our volunteers
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          name: "Antoine",
                          duration: "2 weeks, Summer 2017",
                          quote: "The best experience comes from the children themselves",
                        },
                        {
                          name: "Sam",
                          duration: "2 months, Summer 2016",
                          quote:
                            "The time I spent out at Lotus and Mongolia was equally both eye-opening and rewarding",
                        },
                        {
                          name: "Max",
                          duration: "2 months, Summer 2015",
                          quote:
                            "I spent my time there to entertain the children and help in the centre as much as I could",
                        },
                        {
                          name: "Erica",
                          duration: "2 months, Summer 2014",
                          quote:
                            "I learned patience and love. The children touched my heart with their positive energy and their affection",
                        },
                      ].map((testimonial, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl p-8 shadow-md border border-border/50 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-lotus-purple/10 flex items-center justify-center">
                              <User className="w-6 h-6 text-lotus-purple" />
                            </div>
                            <div>
                              <h5
                                className="font-bold text-foreground"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                              >
                                {testimonial.name}
                              </h5>
                              <p
                                className="text-sm text-muted-foreground"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                {testimonial.duration}
                              </p>
                            </div>
                          </div>
                          <p
                            className="text-muted-foreground italic"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            "{testimonial.quote}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Application Form View */}
                {volunteerView === "form" && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3
                        className="text-3xl font-bold text-foreground"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Volunteer Application Form
                      </h3>
                      <button
                        onClick={() => setVolunteerView("main")}
                        className="p-2 rounded-full hover:bg-lotus-cream transition-colors"
                      >
                        <X className="w-6 h-6 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-md border border-border/50">
                      <p
                        className="text-muted-foreground mb-8"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Please complete the form below and send it to{" "}
                        <a
                          href="mailto:volunteering@lotuschild.org"
                          className="text-lotus-green font-semibold underline"
                        >
                          volunteering@lotuschild.org
                        </a>
                      </p>

                      <form className="space-y-6">
                        {applicationQuestions.map((q) => (
                          <div key={q.id}>
                            <label
                              className="block text-sm font-semibold text-foreground mb-2"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {q.label}
                            </label>
                            {q.type === "textarea" ? (
                              <textarea
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-lotus-green/50 focus:border-lotus-green transition-colors min-h-[100px] resize-y"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                                placeholder={`Enter your answer...`}
                              />
                            ) : (
                              <input
                                type={q.type}
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-lotus-green/50 focus:border-lotus-green transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                                placeholder={`Enter your answer...`}
                              />
                            )}
                          </div>
                        ))}

                        <div className="flex gap-4 pt-4">
                          <Button
                            type="button"
                            onClick={() => setVolunteerView("main")}
                            variant="outline"
                            className="px-8 py-3 rounded-full font-semibold"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Back
                          </Button>
                          <Button
                            type="button"
                            className="bg-lotus-green hover:bg-lotus-green/90 text-white px-8 py-3 rounded-full font-semibold"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            onClick={() => {
                              window.location.href = "mailto:volunteering@lotuschild.org";
                            }}
                          >
                            Submit Application
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* FAQ View */}
                {volunteerView === "faq" && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h3
                        className="text-3xl font-bold text-foreground"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Common Questions
                      </h3>
                      <button
                        onClick={() => setVolunteerView("main")}
                        className="p-2 rounded-full hover:bg-lotus-cream transition-colors"
                      >
                        <X className="w-6 h-6 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {faqData.map((faq, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl shadow-md border border-border/50 overflow-hidden transition-all duration-300"
                        >
                          <button
                            onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-lotus-cream/30 transition-colors"
                          >
                            <span
                              className="text-base font-semibold text-foreground pr-4"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {faq.q}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-lotus-purple flex-shrink-0 transition-transform duration-300 ${
                                openFaqIndex === idx ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              openFaqIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="px-6 pb-6">
                              <p
                                className="text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                {faq.a}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center mt-8">
                      <p
                        className="text-muted-foreground mb-4"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Is your question not on the F.A.Q. list? Don't hesitate to just send us a
                        message!
                      </p>
                      <Button
                        onClick={() => setVolunteerView("main")}
                        variant="outline"
                        className="px-8 py-3 rounded-full font-semibold"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Back to Volunteers
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* Sponsors Tab Content — UPDATED (same as front page) */}
            {/* ═══════════════════════════════════════════════ */}
            {activeTab === "sponsors" && (
              <div className="space-y-10">
                <div className="text-center mb-8">
                  <h3
                    className="text-3xl font-bold text-foreground mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t("sponsors.title") || "Our Sponsors Help Us Care for the Children"}
                  </h3>
                  <p
                    className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t("about.sponsorsDesc") ||
                      "Priceless help from organizations that believe in our mission"}
                  </p>
                </div>

                {/* Auto-scrolling sponsor logos — same as front page */}
                <div className="relative overflow-hidden">
                  {/* Gradient fade edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                  {/* Scrolling track */}
                  <div className="flex animate-marquee-about hover:[animation-play-state:paused]">
                    {duplicatedSponsors.map((sponsor, index) => (
                      <div key={`${sponsor.name}-${index}`} className="flex-shrink-0 mx-6 sm:mx-10">
                        <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-2xl shadow-md border border-border/50 flex items-center justify-center p-5 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                            loading="lazy"
                          />
                        </div>
                        <p
                          className="text-xs text-muted-foreground text-center mt-3 max-w-36 sm:max-w-44 mx-auto leading-tight"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {sponsor.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inline keyframes for marquee animation */}
                <style>{`
                  @keyframes marqueeAbout {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .animate-marquee-about {
                    animation: marqueeAbout 35s linear infinite;
                  }
                `}</style>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section - Volunteer/Donation/Fundraise */}
        <section className="py-20 lg:py-28 bg-lotus-cream">
          <div className="container">
            <div className="text-center mb-14">
              <h2
                className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("about.ctaTitle") || "Join Us in Making a Difference"}
              </h2>
              <p
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("about.ctaDesc") ||
                  "There are many ways to support Lotus Children's Centre and help vulnerable children"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: t("services.volunteer.title") || "Volunteer",
                  desc:
                    t("services.volunteer.desc") ||
                    "On-site or from further away, volunteers are always welcome at Lotus.",
                  color: "text-lotus-yellow",
                  bgColor: "bg-lotus-yellow/10",
                  buttonColor: "bg-lotus-yellow hover:bg-lotus-yellow/90",
                  cta: t("services.volunteer.cta") || "Register Now",
                },
                {
                  icon: Heart,
                  title: t("services.donation.title") || "Donation",
                  desc:
                    t("services.donation.desc") ||
                    "Through money or objects, donations help with the running of Lotus.",
                  color: "text-lotus-orange",
                  bgColor: "bg-lotus-orange/10",
                  buttonColor: "bg-lotus-orange hover:bg-lotus-orange/90",
                  cta: t("services.donation.cta") || "Donate Now",
                },
                {
                  icon: Lightbulb,
                  title: t("services.fundraise.title") || "Fundraise",
                  desc:
                    t("services.fundraise.desc") ||
                    "Take a look at the different events organised for Lotus Children's Centre.",
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
                    <h3
                      className="text-xl font-bold text-foreground mb-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
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
