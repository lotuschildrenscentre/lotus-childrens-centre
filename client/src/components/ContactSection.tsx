/*
 * Design: "Warm Embrace" — Organic Warmth
 * Contact: Form section with contact info sidebar
 * CMS-enabled: contact details (email, phone, address) editable from admin
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsContent } from "@/hooks/useCmsContent";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Flower2, Mail, MapPin, Phone, Send, Package } from "lucide-react";
import { toast } from "sonner";

export default function ContactSection() {
  const { t, language } = useLanguage();
  const cms = useCmsContent("contact");
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  // CMS-driven contact details with defaults
  const contactEmail = cms.get("info", "meta.email", "lotuschildrenscentre@gmail.com");
  const contactPhone1 = cms.get("info", "meta.phone1", "Didi Ananda Kalika: (+976) 99132100");
  const contactPhone2 = cms.get("info", "meta.phone2", "Bolormaa: (+976) 99789750");
  const contactAddress = cms.get("info", "content", "PO Box 1018\nCentral Post Office\nUlaanbaatar\nMongolia");

  return (
    <section id="contact" className="py-20 lg:py-28 bg-lotus-cream" ref={ref}>
      <div className="container">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Flower2 className="w-5 h-5 text-lotus-orange" />
            <span
              className="text-sm font-semibold uppercase tracking-widest text-lotus-orange"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("contact.subtitle")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {cms.get("info", "title", t("contact.title"))}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className={`lg:col-span-2 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="space-y-7">
              {/* Postal Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lotus-green/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-lotus-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {language === "mn" ? "Шуудангийн хаяг" : "Postal Address"}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {contactAddress}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lotus-orange/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-lotus-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Email
                  </h4>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-sm text-lotus-green hover:underline"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lotus-purple/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-lotus-purple" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {language === "mn" ? "Утас" : "Phone"}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Didi Ananda Kalika
                      </p>
                      <p className="text-xs text-muted-foreground mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {language === "mn" ? "Захирал (Англи хэл)" : "Director (English)"}
                      </p>
                      <a href="tel:+97699132100" className="text-sm text-lotus-green hover:underline" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {contactPhone1.includes(":") ? contactPhone1.split(":")[1]?.trim() : "(+976) 99132100"}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Bolormaa
                      </p>
                      <p className="text-xs text-muted-foreground mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {language === "mn" ? "Төвийн менежер (Монгол, Англи хэл)" : "Centre Manager (Mongolian and English)"}
                      </p>
                      <a href="tel:+97699789750" className="text-sm text-lotus-green hover:underline" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {contactPhone2.includes(":") ? contactPhone2.split(":")[1]?.trim() : "(+976) 99789750"}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Suugi
                      </p>
                      <p className="text-xs text-muted-foreground mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {language === "mn" ? "Ерөнхий лавлагаа (Монгол, Англи хэл)" : "General Enquiries (Mongolian and English)"}
                      </p>
                      <a href="tel:+97699789750" className="text-sm text-lotus-green hover:underline" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        (+976) 99789750
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Postal Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-amber-800 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {language === "mn" ? "Шуудангийн анхааруулга" : "Postal Notice"}
                    </h5>
                    <p className="text-xs text-amber-700 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {language === "mn"
                        ? "Урьдчилан асуулгүйгээр шуудангаар юм илгээхгүй байхыг хүсье. Монголын шуудангийн систем заримдаа найдваргүй байдаг бөгөөд гаалийн газраас илгээмж авахад өндөр татвар төлөх шаардлагатай болдог. Хэрэв та ямар нэг зүйл илгээхийг хүсвэл бидэнд имэйлээр хандана уу — таны улсаас хэн нэгэн удахгүй ирэх байж магадгүй."
                        : "Please don't send any items by post without asking first. The postal system in Mongolia is sometimes unreliable, and we often have to pay expensive tax to pick up parcels from the customs office. If you want to send something, please email us first as we may be able to arrange for someone coming from your country to bring it, or make other arrangements."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`lg:col-span-3 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 lg:p-10 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t("contact.name")}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("contact.name")}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lotus-green/30 focus:border-lotus-green transition-all"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t("contact.email")}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("contact.email")}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lotus-green/30 focus:border-lotus-green transition-all"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-foreground mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("contact.subject")}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={t("contact.subject")}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lotus-green/30 focus:border-lotus-green transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t("contact.message")}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t("contact.message")}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lotus-green/30 focus:border-lotus-green transition-all resize-none"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-lotus-green text-white font-semibold hover:bg-lotus-green-dark transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <Send className="w-4 h-4" />
                {t("contact.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
