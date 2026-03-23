import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServiceCards from "@/components/ServiceCards";
import AboutSection from "@/components/AboutSection";
import ImpactStats from "@/components/ImpactStats";
import CausesSection from "@/components/CausesSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <HeroSection />
        <ServiceCards />
        <AboutSection />
        <ImpactStats />
        <CausesSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
