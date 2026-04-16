/*
 * Design: "Warm Embrace" — Organic Warmth
 * Login Page: Staff email/password login
 * Colors: Cream bg, green/orange accents from lotus logo
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Heart, LogIn, ArrowLeft, Shield, Users, Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/lotus-logo_b560f626.png";
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/hero-bg-VoVTJLkkPAnrB6FadEp2TK.webp";

export default function Login() {
  const { t } = useLanguage();
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const utils = trpc.useUtils();

  const staffLogin = trpc.auth.staffLogin.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      setLocation("/admin");
    },
    onError: (err) => {
      setErrorMsg(err.message || "Invalid email or password");
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/admin");
    }
  }, [isAuthenticated, loading, setLocation]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    staffLogin.mutate({ email, password });
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
                Secure staff authentication
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Manage centre operations
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
              Staff Login
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign in to access the admin panel
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@lotuschildren.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-border/60 focus:border-lotus-green"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-border/60 focus:border-lotus-green pr-10"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <p
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {errorMsg}
                </p>
              )}

              <Button
                type="submit"
                disabled={staffLogin.isPending}
                className="w-full h-11 bg-lotus-green hover:bg-lotus-green-dark text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {staffLogin.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

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

          <p
            className="text-center mt-6 text-xs text-muted-foreground"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Staff access only. Contact the administrator if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
