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
import { Heart, Users, Lightbulb, ArrowRight, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const dailyStaff = [
  {
    name: "Didi Ananda Kalika",
    role: "Director",
  },
  {
    name: "Bolormaa",
    role: "Centre Manager",
  },
  {
    name: "Suugi",
    role: "Administration",
  },
  {
    name: "House Mothers",
    role: "Otara, Delgermaa, Narantuya, Enkhtuvshin, Udval",
  },
  {
    name: "Batbileg",
    role: "Cook",
  },
  {
    name: "Sainbuyan",
    role: "Doctor",
  },
  {
    name: "Ganbat",
    role: "Driver",
  },
  {
    name: "Maintenance Team",
    role: "Bold, Bold, Batmunkh, Batjargal",
  },
];

const applicationFormQuestions = [
  { label: "Full name", type: "text", required: true },
  { label: "Date of Birth", type: "date", required: true },
  { label: "Nationality", type: "text", required: true },
  { label: "Languages and level (beginner, intermediate, advanced)", type: "text", required: true },
  { label: "Email address", type: "email", required: true },
  { label: "Intended volunteering dates", type: "text", required: true },
  { label: "How do you feel you can best help Lotus?", type: "textarea", required: true },
  { label: "What relevant experience and/or qualifications do you have for volunteering at Lotus? (Please provide reference)", type: "textarea", required: true },
  { label: "Why do you want to volunteer at Lotus?", type: "textarea", required: true },
  { label: "Do you have a criminal record?", type: "select", options: ["Select...", "Yes", "No"], required: true },
  { label: "Do you have any previous convictions, warnings or court rulings that prevented you from working with children?", type: "select", options: ["Select...", "Yes", "No"], required: true },
  { label: "Have you read and understood the Lotus Children's Centre Code of Conduct?", type: "select", options: ["Select...", "Yes", "No"], required: true },
  { label: "How did you hear about Lotus?", type: "text", required: true },
];

const faqData = [
  {
    question: "Can I volunteer if I haven't volunteered before?",
    answer: "Obviously it is advantageous if you have experience of volunteering and working with children, but a lack of such experience does not mean you are ineligible to volunteer. The most important thing is your attitude towards taking on this new experience and learning as you go.",
  },
  {
    question: "Can you help me obtain a visa?",
    answer: "We can provide you with a letter of support for your visa application, but we cannot help with the visa process itself. You will need to contact the Mongolian embassy in your country for specific visa requirements.",
  },
  {
    question: "What happens when I arrive in Mongolia?",
    answer: "Upon arrival, you will be met at the airport and taken to your accommodation. We will provide you with an orientation to Ulaanbaatar and information about local customs, transportation, and safety.",
  },
  {
    question: "What happens when I arrive at Lotus?",
    answer: "You will receive a full orientation to Lotus Children's Centre, meet the staff and children, and be briefed on your role and responsibilities. We will ensure you feel comfortable and supported from day one.",
  },
  {
    question: "How will I be managed as a volunteer?",
    answer: "You will be assigned a mentor or supervisor who will guide you through your volunteering experience. Regular check-ins and feedback sessions will be conducted to ensure your wellbeing and effectiveness.",
  },
  {
    question: "Do I need a specific project to work on at Lotus?",
    answer: "While we can discuss specific projects, we are flexible and can work with you based on your skills and interests. Whether it's teaching, childcare, or administrative support, we will find the best fit for you.",
  },
  {
    question: "Why should I have to pay to volunteer?",
    answer: "The volunteer fee covers your accommodation, meals, and local transportation during your stay. This helps us sustain our operations and ensure volunteers have a comfortable experience.",
  },
  {
    question: "How can I overcome the language barrier?",
    answer: "While Mongolian is spoken at Lotus, many staff members speak English. We provide language support and encourage volunteers to learn basic Mongolian phrases. Translation tools and staff assistance are available.",
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

const aimsAndBeliefs = [
  {
    icon: Heart,
    title: "about.primaryCare",
    desc: "about.primaryCareDesc",
  },
  {
    icon: Lightbulb,
    title: "about.development",
    desc: "about.developmentDesc",
  },
  {
    icon: Users,
    title: "about.familySupport",
    desc: "about.familySupportDesc",
  },
];

export default function About() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("history");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.1);
  const { ref: aimsRef, isVisible: aimsVisible } = useScrollAnimation(0.1);
  const { ref: historyRef, isVisible: historyVisible } = useScrollAnimation(0.1);
  const { ref: teamRef, isVisible: teamVisible } = useScrollAnimation(0.1);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev: Record<string, string>) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your application! We will contact you soon.");
    setShowApplicationForm(false);
    setFormData({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative py-20 lg:py-32 bg-gradient-to-br from-lotus-cream via-white to-lotus-cream/50 overflow-hidden"
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("about.heroTitle") || "Our Story of Hope and Compassion"}
            </h1>
            <p
              className="text-lg text-muted-foreground mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("about.heroDesc") || "Building a loving home for vulnerable Mongolian children since 1995"}
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("about.whoWeAre") || "Who We Are"}
            </h2>
            <p
              className="text-lg text-muted-foreground mb-6 leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("about.whoWeAreDesc") || "Lotus Children's Centre is a non-profit organization dedicated to providing shelter, care, education, and love to vulnerable children in Ulaanbaatar, Mongolia. Founded in 1995, we have been transforming lives for nearly three decades."}
            </p>
          </div>
        </div>
      </section>

      {/* Aims and Beliefs */}
      <section ref={aimsRef} className="py-20 lg:py-28 bg-lotus-cream">
        <div className="container">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("about.aimsTitle") || "Aims and Beliefs"}
            </h2>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("about.aimsDesc") || "Our core values guide everything we do"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aimsAndBeliefs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl p-8 border border-border/50 shadow-md transition-all duration-700 ${
                    aimsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-lotus-orange/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-lotus-orange" />
                  </div>
                  <h3
                    className="text-xl font-bold text-foreground mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t(item.title) || item.title}
                  </h3>
                  <p
                    className="text-muted-foreground"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t(item.desc) || item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container">
          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
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
                  ? "bg-lotus-yellow text-foreground shadow-lg"
                  : "bg-lotus-cream text-foreground hover:bg-lotus-cream/80"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("about.sponsorsTab") || "Sponsors"}
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {/* History Tab Content */}
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
                      <p
                        className="text-muted-foreground"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Staff Tab Content */}
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
                    {t("about.teamDesc") || "Compassionate professionals committed to changing children's lives"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dailyStaff.map((member, idx) => (
                    <div
                      key={idx}
                      className={`bg-white rounded-2xl p-8 border border-border/50 shadow-md hover:shadow-lg transition-all duration-700 ${
                        teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <div
                        className="w-12 h-12 rounded-full bg-lotus-green/20 flex items-center justify-center mb-4"
                      >
                        <Users className="w-6 h-6 text-lotus-green" />
                      </div>
                      <h4
                        className="text-xl font-bold text-foreground mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {member.name}
                      </h4>
                      <p
                        className="text-lotus-green font-semibold"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteers Tab Content */}
            {activeTab === "volunteers" && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <h3
                    className="text-3xl font-bold text-foreground mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t("about.volunteersTitle") || "Volunteers from Around the World"}
                  </h3>
                  <p
                    className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t("about.volunteersDesc") || "International and local volunteers dedicate their time to support our mission"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-12 border border-border/50 shadow-md">
                  <p
                    className="text-lg text-muted-foreground mb-8 text-center"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t("about.volunteersContent") || "Volunteers from all over the world are always welcome at Lotus. Whether you can visit in person or contribute remotely, your support makes a real difference in the lives of vulnerable children."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setShowApplicationForm(true)}
                      className="bg-lotus-purple hover:bg-lotus-purple/90 text-white px-8 py-3 rounded-full font-semibold"
                    >
                      {t("about.applicationForm") || "Application Form"}
                    </Button>
                    <Button
                      onClick={() => setShowFAQ(true)}
                      className="bg-lotus-orange hover:bg-lotus-orange/90 text-white px-8 py-3 rounded-full font-semibold"
                    >
                      {t("about.faq") || "FAQ"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Sponsors Tab Content */}
            {activeTab === "sponsors" && (
              <div className="space-y-12">
                <div className="text-center mb-12">
                  <h3
                    className="text-3xl font-bold text-foreground mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t("about.sponsorsTitle") || "Our Generous Sponsors"}
                  </h3>
                  <p
                    className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t("about.sponsorsDesc") || "Priceless help from organizations that believe in our mission"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-12 border border-border/50 shadow-md">
                  <p
                    className="text-lg text-muted-foreground mb-8 text-center"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t("about.sponsorsContent") || "Our sponsors play a vital role in supporting Lotus Children's Centre. Through their generosity and commitment, we are able to provide quality care, education, and opportunities for vulnerable children in Mongolia."}
                  </p>
                  <Button className="bg-lotus-orange hover:bg-lotus-orange/90 text-white px-8 py-3 rounded-full font-semibold mx-auto block">
                    {t("about.sponsorsPartner") || "Become a Sponsor"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border/50 p-6 flex justify-between items-center">
              <h2
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("about.volunteerApplicationForm") || "Volunteer Application Form"}
              </h2>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              {applicationFormQuestions.map((q, idx) => (
                <div key={idx}>
                  <label
                    className="block text-sm font-semibold text-foreground mb-2"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {q.label} {q.required && <span className="text-red-500">*</span>}
                  </label>
                  {q.type === "textarea" ? (
                    <textarea
                      value={formData[`q${idx}`] || ""}
                      onChange={(e) => handleFormChange(`q${idx}`, e.target.value)}
                      className="w-full border border-border/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lotus-orange"
                      rows={3}
                      required={q.required}
                    />
                  ) : q.type === "select" ? (
                    <select
                      value={formData[`q${idx}`] || ""}
                      onChange={(e) => handleFormChange(`q${idx}`, e.target.value)}
                      className="w-full border border-border/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lotus-orange"
                      required={q.required}
                    >
                      {q.options?.map((opt, i) => (
                        <option key={i} value={opt === "Select..." ? "" : opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={q.type}
                      value={formData[`q${idx}`] || ""}
                      onChange={(e) => handleFormChange(`q${idx}`, e.target.value)}
                      className="w-full border border-border/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-lotus-orange"
                      required={q.required}
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-lotus-purple hover:bg-lotus-purple/90 text-white py-3 rounded-full font-semibold"
                >
                  {t("about.submit") || "Submit"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-foreground py-3 rounded-full font-semibold"
                >
                  {t("about.cancel") || "Cancel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border/50 p-6 flex justify-between items-center">
              <h2
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("about.frequentlyAskedQuestions") || "Frequently Asked Questions"}
              </h2>
              <button
                onClick={() => setShowFAQ(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <Accordion type="single" collapsible className="space-y-2">
                {faqData.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border border-border/50 rounded-lg px-4">
                    <AccordionTrigger
                      className="text-left font-semibold text-foreground hover:text-lotus-orange py-4"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent
                      className="text-muted-foreground pb-4"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      )}

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
                  <h3
                    className="text-xl font-bold text-foreground mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-muted-foreground mb-6"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.desc}
                  </p>
                  <Button className={`w-full ${item.buttonColor} text-white rounded-full font-semibold`}>
                    {item.cta}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
