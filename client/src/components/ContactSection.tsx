/*
 * Design: "Warm Embrace" — Organic Warmth
 * Contact: Form section with contact info sidebar
 * Light background, green accents
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Flower2, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactSection() {
  const { t } = useLanguage();
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
            {t("contact.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className={`lg:col-span-2 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lotus-green/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-lotus-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t("contact.address")}
                  </h4>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Lotus Children's Centre
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lotus-orange/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-lotus-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Email
                  </h4>
                  <a
                    href="mailto:lotuschildrenscentre@gmail.com"
                    className="text-sm text-lotus-green hover:underline"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    lotuschildrenscentre@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lotus-purple/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-lotus-purple" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Social Media
                  </h4>
                  <div className="flex gap-3">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-sm text-lotus-green hover:underline" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Facebook
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-lotus-green hover:underline" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Twitter
                    </a>
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
