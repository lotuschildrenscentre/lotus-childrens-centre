/**
 * About Page Component
 * Design: "Warm Embrace" — Organic Warmth
 * Features: Hero banner, Who We Are, History, Daily Staff, Volunteers (with Application Form & FAQ), Sponsors
 * Ends with Volunteer/Donation/Fundraise CTAs
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Heart, Users, Lightbulb, ArrowRight, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const staffMembers = [
  { name: "Didi Ananda Kalika", role: "Director" },
  { name: "Bolormaa", role: "Centre Manager" },
  { name: "Suugi", role: "Administration" },
  { name: "Otara, Delgermaa, Narantuya, Enkhtuvshin, Udval", role: "House Mothers" },
  { name: "Batbileg", role: "Cook" },
  { name: "Sainbuyan", role: "Doctor" },
  { name: "Ganbat", role: "Driver" },
  { name: "Bold, Bold, Batmunkh, Batjargal", role: "Maintenance & Boiler House" },
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
  { label: "Do you have a criminal record?", type: "select", options: ["Yes", "No"], required: true },
  { label: "Do you have any previous convictions, warnings or court rulings that prevented you from working with children?", type: "select", options: ["Yes", "No"], required: true },
  { label: "Have you read and understood the Lotus Children's Centre Code of Conduct?", type: "select", options: ["Yes", "No"], required: true },
  { label: "How did you hear about Lotus?", type: "text", required: true },
];

const faqData = [
  {
    question: "Can I volunteer if I haven't volunteered before?",
    answer: "Obviously it is advantageous if you have experience of volunteering and working with children, but a lack of such experience does not mean you are ineligible to volunteer. The most important thing is your attitude towards taking on this new experience and learning as you go."
  },
  {
    question: "Can you help me obtain a visa?",
    answer: "To volunteer you just need to apply for a standard tourist visa which, depending on your nationality, is usually valid for 30 days. This can be extended by a further 30 days if you register at the immigration office within 7 days of your arrival."
  },
  {
    question: "What happens when I arrive in Mongolia?",
    answer: "It is strongly recommended that you spend at least one night in Ulaanbaatar when you arrive in Mongolia before coming out to Lotus. This gives you a chance to acclimatise, catch up on sleep, change money, buy a SIM card and register at immigration if necessary."
  },
  {
    question: "What happens when I arrive at Lotus?",
    answer: "When you arrive at Lotus you will usually be greeted by the volunteer coordinator. You will be shown to your accommodation and introduced to your new volunteer colleagues. Your orientation will involve a tour of the centre."
  },
  {
    question: "How will I be managed as a volunteer?",
    answer: "Our volunteer coordinator is on-site at least 5 days a week during the summer volunteer season, and is always contactable by phone and email. They will offer guidance for your project and ideas for other things you can work on."
  },
  {
    question: "Do I need a specific project to work on at Lotus?",
    answer: "Our volunteers work on a variety of projects, usually depending on their own skills or interests. It is very important that you have a specific project that will be your main focus during your volunteering period."
  },
  {
    question: "Why should I have to pay to volunteer?",
    answer: "At Lotus, we simply cannot afford to host volunteers without a financial contribution. Volunteers are provided with traditional ger accommodation with separate toilet and shower facilities, and three meals per day."
  },
  {
    question: "How can I overcome the language barrier?",
    answer: "Many of the Lotus children speak English at varying levels. The children help each other with languages and communicating with volunteers so if you find you cannot communicate clearly directly with a specific child then another child or staff member will be able to translate."
  },
];

const sponsorLogos = [
  { name: "Elite International School", url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/elite-international-school-3qVXMNFJFxgGpLLwLqKPdS.webp" },
  { name: "Hobby School", url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/hobby-school-2xQvZXKvFrH9LqKPdS.webp" },
  { name: "The English School of Mongolia", url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/english-school-mongolia-1xQvZXKvFrH9LqKPdS.webp" },
  { name: "Gulf for Good", url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/gulf-for-good-2xQvZXKvFrH9LqKPdS.webp" },
  { name: "Holiday Inn", url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/holiday-inn-1xQvZXKvFrH9LqKPdS.webp" },
  { name: "Altan Taria", url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/altan-taria-3xQvZXKvFrH9LqKPdS.webp" },
  { name: "IVCO", url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/ivco-2xQvZXKvFrH9LqKPdS.webp" },
  { name: "AMURT", url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/amurt-1xQvZXKvFrH9LqKPdS.webp" },
  { name: "Misheel Kids Foundation", url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/misheel-kids-foundation-2xQvZXKvFrH9LqKPdS.webp" },
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
  const [activeTab, setActiveTab] = useState<"history" | "staff" | "volunteers" | "sponsors">("history");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleFormChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Volunteer Application Submitted:", formData);
    alert("Thank you for your application! We will contact you soon.");
    setShowApplicationForm(false);
    setFormData({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-orange-500 to-green-600 flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=400&fit=crop" 
            alt="Children" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">{t("about.pageTitle")}</h1>
          <p className="text-xl">{t("about.pageSubtitle")}</p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold text-sm tracking-widest uppercase mb-4">{t("about.whoWeAre")}</p>
          <h2 className="text-4xl font-bold mb-6">{t("about.helpTitle")}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-700 mb-4 leading-relaxed">{t("about.helpDesc1")}</p>
            <p className="text-gray-700 leading-relaxed">{t("about.helpDesc2")}</p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop" 
              alt="Team" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Aims and Beliefs Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-sm tracking-widest uppercase mb-4">{t("about.ourValues")}</p>
            <h2 className="text-4xl font-bold mb-4">{t("about.aimsTitle")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("about.aimsDesc")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Heart className="w-8 h-8" />, title: t("about.primaryCare"), desc: t("about.primaryCareDesc") },
              { icon: <Lightbulb className="w-8 h-8" />, title: t("about.development"), desc: t("about.developmentDesc") },
              { icon: <Users className="w-8 h-8" />, title: t("about.familySupport"), desc: t("about.familySupportDesc") },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md border-t-4 border-orange-400">
                <div className="text-orange-500 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {[
            { id: "history", label: t("about.historyTab"), color: "bg-orange-400" },
            { id: "staff", label: t("about.staffTab"), color: "bg-green-500" },
            { id: "volunteers", label: t("about.volunteersTab"), color: "bg-purple-500" },
            { id: "sponsors", label: t("about.sponsorsTab"), color: "bg-orange-500" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeTab === tab.id
                  ? `${tab.color} text-white shadow-lg`
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-center mb-12">{t("about.historyTitle")}</h2>
            <div className="space-y-8">
              {historyTimeline.map((item, idx) => (
                <div key={idx} className="flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">{item.year}</div>
                    {idx < historyTimeline.length - 1 && <div className="w-1 h-24 bg-orange-200 mt-4"></div>}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Staff Tab */}
        {activeTab === "staff" && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">{t("about.teamTitle")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffMembers.map((member, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-semibold text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteers Tab */}
        {activeTab === "volunteers" && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-4">{t("about.volunteersTitle")}</h2>
            <p className="text-center text-gray-600 mb-12">{t("about.volunteersDesc")}</p>
            <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">{t("about.volunteersContent")}</p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button 
                onClick={() => setShowApplicationForm(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold"
              >
                {t("about.applicationForm")}
              </Button>
              <Button 
                onClick={() => setShowFAQ(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold"
              >
                {t("about.faqButton")}
              </Button>
            </div>
          </div>
        )}

        {/* Sponsors Tab */}
        {activeTab === "sponsors" && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-4">{t("about.sponsorsTitle")}</h2>
            <p className="text-center text-gray-600 mb-12">{t("about.sponsorsDesc")}</p>
            <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">{t("about.sponsorsContent")}</p>
            
            {/* Auto-scrolling sponsors marquee */}
            <div className="relative overflow-hidden bg-white rounded-lg py-8">
              <div className="flex gap-8 animate-scroll">
                {[...sponsorLogos, ...sponsorLogos].map((sponsor, idx) => (
                  <div key={idx} className="flex-shrink-0 w-40 h-24 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <img src={sponsor.url} alt={sponsor.name} className="w-32 h-20 object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-400 to-green-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">{t("about.ctaTitle")}</h2>
          <p className="text-lg mb-8">{t("about.ctaDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-8 py-3 rounded-full font-semibold">
              {t("nav.volunteer")}
            </Button>
            <Button className="bg-white hover:bg-gray-100 text-orange-500 px-8 py-3 rounded-full font-semibold">
              {t("nav.donate")}
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold">
              {t("nav.fundraise")}
            </Button>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("about.volunteerApplicationForm")}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {applicationFormQuestions.map((q, idx) => (
              <div key={idx}>
                <label className="block text-sm font-semibold mb-2">{q.label} {q.required && <span className="text-red-500">*</span>}</label>
                {q.type === "textarea" ? (
                  <textarea
                    value={formData[q.label] || ""}
                    onChange={(e) => handleFormChange(q.label, e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    required={q.required}
                  />
                ) : q.type === "select" ? (
                  <select
                    value={formData[q.label] || ""}
                    onChange={(e) => handleFormChange(q.label, e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required={q.required}
                  >
                    <option value="">Select...</option>
                    {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={q.type}
                    value={formData[q.label] || ""}
                    onChange={(e) => handleFormChange(q.label, e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required={q.required}
                  />
                )}
              </div>
            ))}
            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              {t("common.submit")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* FAQ Modal */}
      <Dialog open={showFAQ} onOpenChange={setShowFAQ}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("about.faqTitle")}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left text-sm">{item.question}</AccordionTrigger>
                <AccordionContent className="text-sm">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
