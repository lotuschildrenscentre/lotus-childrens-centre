/*
 * Design: "Warm Embrace" — Organic Warmth
 * Login Page: Clean, centered login with Manus OAuth
 * Colors: Cream bg, green/orange accents from lotus logo
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Heart, LogIn, ArrowLeft, Shield, Users, Sparkles } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/lotus-logo_b560f626.png";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/hero-bg-VoVTJLkkPAnrB6FadEp2TK.webp";

export default function Login() {
  const { t } = useLanguage();
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, loading, setLocation]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={HERO_BG}
          alt="Children at Lotus Centre"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-lotus-green/80 via-lotus-green/60 to-lotus-dark/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <ArrowLeft className="w-4 h-4" />
              {t("auth.backToHome")}
            </button>
            <img
              src={LOGO_URL}
              alt="Lotus Children's Centre"
              className="h-16 w-auto mb-6"
            />
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Lotus Children's Centre
            </h2>
            <p
              className="text-white/80 text-lg leading-relaxed max-w-md"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("footer.description")}
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Secure authentication
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Stay connected with the community
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Support our mission
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-lotus-cream px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile back button */}
          <button
            onClick={() => setLocation("/")}
            className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("auth.backToHome")}
          </button>

          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <img
              src={LOGO_URL}
              alt="Lotus Children's Centre"
              className="h-16 w-auto"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1
              className="text-3xl font-bold text-foreground mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("auth.loginTitle")}
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("auth.loginSubtitle")}
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8">
            {/* Description */}
            <p
              className="text-sm text-muted-foreground text-center mb-8 leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {t("auth.loginDesc")}
            </p>

            {/* Manus Login Button */}
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-lotus-green text-white font-semibold text-base hover:bg-lotus-green-dark transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <LogIn className="w-5 h-5" />
              {t("auth.loginWithManus")}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                or
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Donate CTA */}
            <a
              href="https://www.justgiving.com/charity/lotuschildren-centre"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-lotus-orange/30 text-lotus-orange font-semibold hover:bg-lotus-orange/5 transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Heart className="w-4 h-4" />
              {t("cta.donate")}
            </a>
          </div>

          {/* Sign up link */}
          <p
            className="text-center mt-6 text-sm text-muted-foreground"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {t("auth.noAccount")}{" "}
            <button
              onClick={handleLogin}
              className="text-lotus-green font-semibold hover:underline"
            >
              {t("auth.signup")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
