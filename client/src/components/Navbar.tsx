/*
 * Design: "Warm Embrace" — Organic Warmth
 * Navbar: Sticky top nav with logo, nav links, language toggle, and donate CTA
 * Colors: White bg with green accents, warm hover states
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, Globe } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/lotus-logo_b560f626.png";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { key: "nav.home", href: "#home" },
    { key: "nav.about", href: "#about" },
    { key: "nav.getInvolved", href: "#causes" },
    { key: "nav.contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container flex items-center justify-between h-18 lg:h-20">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <img
            src={LOGO_URL}
            alt="Lotus Children's Centre"
            className="h-12 lg:h-14 w-auto"
          />
          <div className="hidden sm:block">
            <span className="block text-sm font-semibold tracking-wide text-lotus-green" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              LOTUS CHILDREN'S CENTRE
            </span>
            <span className="block text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Ulaanbaatar, Mongolia
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-lotus-green transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        {/* Right side: Language + Donate */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "mn" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-lotus-green/40 hover:bg-lotus-green/5 transition-all duration-200 text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Globe className="w-4 h-4 text-lotus-green" />
            <span className="font-medium text-foreground/80">
              {language === "en" ? "MN" : "EN"}
            </span>
          </button>

          {/* Donate Button */}
          <a
            href="#donate"
            className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-lotus-green text-white text-sm font-semibold hover:bg-lotus-green-dark transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t("nav.donate")}
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border animate-in slide-in-from-top-2 duration-200">
          <div className="container py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-foreground/80 hover:bg-lotus-green/5 hover:text-lotus-green transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t(link.key)}
              </a>
            ))}
            <a
              href="#donate"
              onClick={() => setMobileOpen(false)}
              className="block mx-4 mt-3 px-5 py-3 rounded-full bg-lotus-green text-white text-sm font-semibold text-center hover:bg-lotus-green-dark transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("nav.donate")}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
