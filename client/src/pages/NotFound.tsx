import { useLanguage } from "@/contexts/LanguageContext";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-lotus-cream px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-lotus-green mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          {language === "en" ? "Page Not Found" : "Хуудас олдсонгүй"}
        </h1>
        <p
          className="text-muted-foreground mb-8 leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {language === "en"
            ? "The page you're looking for doesn't exist or has been moved."
            : "Таны хайж буй хуудас олдсонгүй эсвэл зөөгдсөн байна."}
        </p>
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lotus-green text-white font-semibold hover:bg-lotus-green-dark transition-all duration-300 shadow-md"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <Home className="w-4 h-4" />
          {language === "en" ? "Go Home" : "Нүүр хуудас"}
        </button>
      </div>
    </div>
  );
}
