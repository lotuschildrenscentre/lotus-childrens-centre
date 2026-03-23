import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "mn";

interface Translations {
  [key: string]: {
    en: string;
    mn: string;
  };
}

const translations: Translations = {
  // Navigation
  "nav.home": { en: "Home", mn: "Нүүр" },
  "nav.about": { en: "About", mn: "Бидний тухай" },
  "nav.news": { en: "News & Updates", mn: "Мэдээ & Шинэчлэл" },
  "nav.photos": { en: "Photos & Videos", mn: "Зураг & Видео" },
  "nav.getInvolved": { en: "Get Involved", mn: "Оролцох" },
  "nav.contact": { en: "Contact Us", mn: "Холбоо барих" },
  "nav.donate": { en: "Donate", mn: "Хандив өгөх" },

  // Hero
  "hero.subtitle": { en: "A Loving Home", mn: "Хайр дүүрэн гэр" },
  "hero.title": { en: "For Vulnerable Mongolian Children", mn: "Монголын эмзэг хүүхдүүдэд зориулав" },
  "hero.description": {
    en: "Building strength, stability, and self-reliance through shelter, education, and love.",
    mn: "Хамгаалалт, боловсрол, хайраар дамжуулан хүч чадал, тогтвортой байдал, бие даасан байдлыг бий болгоно."
  },
  "hero.donateNow": { en: "Donate Now", mn: "Одоо хандив өгөх" },

  // Service Cards
  "services.volunteer.title": { en: "Volunteer", mn: "Сайн дурын ажил" },
  "services.volunteer.desc": {
    en: "On-site or from further away, volunteers are always welcome at Lotus.",
    mn: "Газар дээр нь эсвэл алсаас, сайн дурын ажилтнуудыг Лотус үргэлж хүлээн авдаг."
  },
  "services.volunteer.cta": { en: "Register Now", mn: "Бүртгүүлэх" },
  "services.donation.title": { en: "Donation", mn: "Хандив" },
  "services.donation.desc": {
    en: "Through money or objects, donations help with the running of Lotus.",
    mn: "Мөнгө эсвэл эд зүйлсээр дамжуулан хандив нь Лотусын үйл ажиллагаанд тусалдаг."
  },
  "services.donation.cta": { en: "Donate Now", mn: "Хандив өгөх" },
  "services.fundraise.title": { en: "Fundraise", mn: "Хөрөнгө босгох" },
  "services.fundraise.desc": {
    en: "Take a look at the different events organised for Lotus Children's Centre.",
    mn: "Лотус хүүхдийн төвд зориулан зохион байгуулсан янз бүрийн арга хэмжээг үзнэ үү."
  },
  "services.fundraise.cta": { en: "Read More", mn: "Дэлгэрэнгүй" },

  // About Section
  "about.subtitle": { en: "Welcome to Lotus Children's Centre", mn: "Лотус хүүхдийн төвд тавтай морил" },
  "about.title": { en: "We Help Vulnerable Children Get a Better Life", mn: "Бид эмзэг хүүхдүүдэд илүү сайн амьдрал олоход тусалдаг" },
  "about.description": {
    en: "The Lotus Children's Centre is an official Mongolian non-governmental organisation (NGO) that currently acts as a home for around 75 vulnerable and abused Mongolian children and also takes part in community out-reach projects. Located in Gachuurt in the suburbs of Ulaanbaatar, it is not only a home but also a centre for development for abandoned and vulnerable children.",
    mn: "Лотус хүүхдийн төв нь Монголын албан ёсны төрийн бус байгууллага (ТББ) бөгөөд одоогоор 75 орчим эмзэг, хүчирхийлэлд өртсөн Монгол хүүхдүүдийн гэр болж, нийгмийн хүрээнд хүрэх төслүүдэд оролцдог. Улаанбаатарын захын Гачууртад байрладаг энэ төв нь зөвхөн гэр бүл төдийгүй орхигдсон, эмзэг хүүхдүүдийн хөгжлийн төв юм."
  },
  "about.stat": { en: "We help more than 75 children every year", mn: "Бид жил бүр 75-аас дээш хүүхдэд тусалдаг" },
  "about.point1": { en: "Providing primary care including food, healthcare, and accommodation", mn: "Хоол, эрүүл мэнд, байр зэрэг анхан шатны тусламж үзүүлэх" },
  "about.point2": { en: "Quality education and counselling for every child", mn: "Хүүхэд бүрт чанартай боловсрол, зөвлөгөө" },
  "about.point3": { en: "Building self-esteem and life skills for the future", mn: "Ирээдүйд зориулсан өөртөө итгэх итгэл, амьдралын ур чадвар" },
  "about.learnMore": { en: "Learn More", mn: "Дэлгэрэнгүй" },

  // Impact Stats
  "stats.children.number": { en: "75+", mn: "75+" },
  "stats.children.label": { en: "Children Each Year", mn: "Хүүхэд жил бүр" },
  "stats.children.desc": { en: "Lotus provides a loving home and education to children", mn: "Лотус хүүхдүүдэд хайр дүүрэн гэр, боловсрол олгодог" },
  "stats.years.number": { en: "20+", mn: "20+" },
  "stats.years.label": { en: "Years of Service", mn: "Жилийн үйлчилгээ" },
  "stats.years.desc": { en: "Serving vulnerable children since the early 2000s", mn: "2000-аад оны эхнээс эмзэг хүүхдүүдэд үйлчилж байна" },
  "stats.impact.number": { en: "500+", mn: "500+" },
  "stats.impact.label": { en: "Lives Changed", mn: "Амьдрал өөрчлөгдсөн" },
  "stats.impact.desc": { en: "Children supported through education and care", mn: "Боловсрол, асрамжаар дэмжигдсэн хүүхдүүд" },

  // Causes Section
  "causes.subtitle": { en: "How You Can Help", mn: "Та хэрхэн тусалж чадах вэ" },
  "causes.title": { en: "Current Needs", mn: "Одоогийн хэрэгцээ" },
  "causes.education.title": { en: "Education & School Supplies", mn: "Боловсрол & Сургуулийн хэрэгсэл" },
  "causes.education.desc": {
    en: "Help provide quality education, school supplies, and tutoring for the children at Lotus.",
    mn: "Лотусын хүүхдүүдэд чанартай боловсрол, сургуулийн хэрэгсэл, хичээлийн тусламж үзүүлэхэд тусалаарай."
  },
  "causes.healthcare.title": { en: "Healthcare & Nutrition", mn: "Эрүүл мэнд & Хоол тэжээл" },
  "causes.healthcare.desc": {
    en: "Support the health and nutrition needs of 75 children living at the centre.",
    mn: "Төвд амьдарч буй 75 хүүхдийн эрүүл мэнд, хоол тэжээлийн хэрэгцээг дэмжинэ."
  },
  "causes.facilities.title": { en: "Facility Improvements", mn: "Байгууламжийн сайжруулалт" },
  "causes.facilities.desc": {
    en: "Help maintain and improve the living spaces for the children in Gachuurt.",
    mn: "Гачуурт дахь хүүхдүүдийн амьдрах орон зайг засварлах, сайжруулахад тусалаарай."
  },

  // Sponsors Section
  "sponsors.subtitle": { en: "Our Partners", mn: "Манай түншүүд" },
  "sponsors.title": { en: "Our Sponsors Help Us Care for the Children", mn: "Манай ивээн тэтгэгчид хүүхдүүдийг халамжлахад тусалдаг" },

  // CTA Section
  "cta.subtitle": { en: "Make a Difference Today", mn: "Өнөөдөр өөрчлөлт хийгээрэй" },
  "cta.title": { en: "Every Child Deserves a Loving Home", mn: "Хүүхэд бүр хайр дүүрэн гэр бүлийг хүртэх ёстой" },
  "cta.description": {
    en: "Your support helps us provide shelter, education, and hope to vulnerable children in Mongolia. Join us in making a lasting impact.",
    mn: "Таны дэмжлэг бидэнд Монголын эмзэг хүүхдүүдэд хамгаалалт, боловсрол, найдвар өгөхөд тусалдаг. Удаан хугацааны нөлөө үзүүлэхэд бидэнтэй нэгдээрэй."
  },
  "cta.donate": { en: "Donate Now", mn: "Одоо хандив өгөх" },
  "cta.volunteer": { en: "Volunteer", mn: "Сайн дурын ажил" },

  // Contact Section
  "contact.subtitle": { en: "Get in Touch", mn: "Холбоо барих" },
  "contact.title": { en: "Contact Us", mn: "Бидэнтэй холбогдох" },
  "contact.name": { en: "Name", mn: "Нэр" },
  "contact.email": { en: "Email", mn: "Имэйл" },
  "contact.subject": { en: "Subject", mn: "Гарчиг" },
  "contact.message": { en: "Message", mn: "Мессеж" },
  "contact.submit": { en: "Submit", mn: "Илгээх" },
  "contact.address": { en: "Gachuurt, Ulaanbaatar, Mongolia", mn: "Гачуурт, Улаанбаатар, Монгол" },

  // Footer
  "footer.rights": { en: "All rights reserved.", mn: "Бүх эрх хуулиар хамгаалагдсан." },
  "footer.description": {
    en: "A loving home for vulnerable Mongolian children since the early 2000s.",
    mn: "2000-аад оны эхнээс Монголын эмзэг хүүхдүүдийн хайр дүүрэн гэр."
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
