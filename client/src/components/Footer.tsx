/*
 * Design: "Warm Embrace" — Organic Warmth
 * Footer: Dark background with logo, links, social, and copyright
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Facebook, Twitter, Mail } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/lotus-logo_b560f626.png";

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { key: "nav.home", href: "#home" },
    { key: "nav.about", href: "#about" },
    { key: "nav.getInvolved", href: "/get-involved" },
    { key: "nav.contact", href: "#contact" },
  ];

  return (
    <footer className="bg-lotus-dark text-white/80">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={LOGO_URL}
                alt="Lotus Children's Centre"
                className="h-14 w-auto"
              />
              <div>
                <span className="block text-lg font-semibold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Lotus Children's Centre
                </span>
                <span className="block text-xs text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Ulaanbaatar, Mongolia
                </span>
              </div>
            </div>
            <p
              className="text-white/60 leading-relaxed max-w-md mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("footer.description")}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-lotus-green transition-colors duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-lotus-green transition-colors duration-200"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:lotuschildrenscentre@gmail.com"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-lotus-green transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-lotus-orange transition-colors duration-200 text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {t("nav.contact")}
            </h4>
            <ul className="space-y-3 text-sm text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <li>{t("contact.address")}</li>
              <li>
                <a href="mailto:lotuschildrenscentre@gmail.com" className="hover:text-lotus-orange transition-colors">
                  lotuschildrenscentre@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            &copy; {new Date().getFullYear()} Lotus Children's Centre. {t("footer.rights")}
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Made with <Heart className="w-3 h-3 text-lotus-red" fill="currentColor" /> for the children
          </p>
        </div>
      </div>
    </footer>
  );
}
