/*
 * Design: "Warm Embrace" — Organic Warmth
 * Footer: Dark background with logo, links, social, copyright, staff login, and admin panel
 * CMS-enabled: site name, location, description, logo, social links, email, copyright, tagline editable from admin
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsContent } from "@/hooks/useCmsContent";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Heart, Facebook, Instagram, Youtube, Mail, LogIn, LogOut, User, Shield } from "lucide-react";

const DEFAULT_LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/lotus-logo_b560f626.png";

export default function Footer() {
  const { t } = useLanguage();
  const cms = useCmsContent("home");
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  // CMS-driven footer content
  const siteName = cms.get("footer", "title", "Lotus Children's Centre");
  const siteLocation = cms.get("footer", "meta.siteLocation", "Ulaanbaatar, Mongolia");
  const description = cms.get("footer", "content", t("footer.description"));
  const logoUrl = cms.get("footer", "imageUrl", DEFAULT_LOGO_URL);
  const facebookUrl = cms.get("footer", "meta.facebookUrl", "https://www.facebook.com");
  const instagramUrl = cms.get("footer", "meta.instagramUrl", "https://www.instagram.com");
  const youtubeUrl = cms.get("footer", "meta.youtubeUrl", "https://www.youtube.com");
  const contactEmail = cms.get("footer", "meta.email", "lotuschildrenscentre@gmail.com");
  const copyrightText = cms.get("footer", "meta.copyrightText", "Lotus Children's Centre");
  const tagline = cms.get("footer", "meta.tagline", "Made with love for the children");

  const quickLinks = [
    { key: "nav.home", href: "/" },
    { key: "nav.about", href: "/about" },
    { key: "nav.getInvolved", href: "/get-involved" },
    { key: "nav.contact", href: "/#contact" },
  ];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <footer className="bg-lotus-dark text-white/80">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logoUrl}
                alt={siteName}
                className="h-14 w-auto"
              />
              <div>
                <span className="block text-lg font-semibold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {siteName}
                </span>
                <span className="block text-xs text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {siteLocation}
                </span>
              </div>
            </div>
            <p
              className="text-white/60 leading-relaxed max-w-md mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {description}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-lotus-green transition-colors duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-lotus-green transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-lotus-green transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${contactEmail}`}
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

          {/* Contact Info + Auth */}
          <div>
            <h4 className="text-white font-semibold mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {t("nav.contact")}
            </h4>
            <ul className="space-y-3 text-sm text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <li>{t("contact.address")}</li>
              <li>
                <a href={`mailto:${contactEmail}`} className="hover:text-lotus-orange transition-colors">
                  {contactEmail}
                </a>
              </li>
            </ul>

            {/* Auth Section */}
            <div className="mt-6 pt-6 border-t border-white/10">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <User className="w-4 h-4 text-lotus-green" />
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {user.name || user.email || t("auth.myAccount")}
                    </span>
                  </div>
                  {user.role === "admin" && (
                    <button
                      onClick={() => setLocation("/admin")}
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-lotus-green transition-colors duration-200"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-white/50 hover:text-lotus-orange transition-colors duration-200"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t("auth.logout")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setLocation("/login")}
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-lotus-green transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <LogIn className="w-4 h-4" />
                  {t("auth.staffLogin")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            &copy; {new Date().getFullYear()} {copyrightText}. {t("footer.rights")}
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Heart className="w-3 h-3 text-lotus-red" fill="currentColor" /> {tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
