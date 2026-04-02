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

  // About Section (Home Page)
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

  // About Page
  "about.pageTitle": { en: "Our Story", mn: "Манай түүх" },
  "about.pageSubtitle": { en: "Building a loving home for vulnerable children since the early 2000s", mn: "2000-аад оны эхнээс эмзэг хүүхдүүдийн хайр дүүрэн гэр бий болгож байна" },
  "about.subtitle": { en: "Who We Are", mn: "Бид хэн бэ" },
  "about.title": { en: "We Help Vulnerable Children Get a Better Life", mn: "Бид эмзэг хүүхдүүдэд илүү сайн амьдрал олоход тусалдаг" },
  "about.description": { en: "The Lotus Children's Centre is an official Mongolian non-governmental organisation (NGO) that currently acts as a home for around 75 vulnerable and abused Mongolian children and also takes part in community out-reach projects.", mn: "Лотус хүүхдийн төв нь Монголын албан ёсны төрийн бус байгууллага (ТББ) бөгөөд одоогоор 75 орчим эмзэг, хүчирхийлэлд өртсөн Монгол хүүхдүүдийн гэр болж, нийгмийн хүрээнд хүрэх төслүүдэд оролцдог." },
  "about.locationDesc": { en: "Located in Gachuurt in the suburbs of Ulaanbaatar, it is not only a home but also a centre for development for abandoned and vulnerable children.", mn: "Улаанбаатарын захын Гачууртад байрладаг энэ төв нь зөвхөн гэр бүл төдийгүй орхигдсон, эмзэг хүүхдүүдийн хөгжлийн төв юм." },
  "about.aimsSubtitle": { en: "Our Values", mn: "Манай үнэ цэнэ" },
  "about.aimsTitle": { en: "Aims and Beliefs", mn: "Зорилго ба итгэл" },
  "about.aimsIntro": { en: "Whilst Lotus is not a religious organisation, many of the beliefs of the founder help the children to overcome their backgrounds through loving care and belief in their potential.", mn: "Лотус нь шашны байгууллага биш боловч үүсгэгчийн итгэл нь хүүхдүүдэд хайр дүүрэн асрамж, тэдний чадавхийн итгэлээр дамжуулан өнгөрсөн үйл явдлыг даван туулахад тусалдаг." },
  "about.aim1Title": { en: "Primary Care", mn: "Анхан шатны асрамж" },
  "about.aim1Desc": { en: "Provide food, healthcare, clothing and suitable accommodation", mn: "Хоол, эрүүл мэнд, хувцас, тохиромжтой байр зэргийг үзүүлэх" },
  "about.aim2Title": { en: "Development", mn: "Хөгжил" },
  "about.aim2Desc": { en: "Quality education, counselling, and life skills for breaking poverty cycles", mn: "Ядуурлын мөчлөгөөс гарахын тулд чанартай боловсрол, зөвлөгөө, амьдралын ур чадвар" },
  "about.aim3Title": { en: "Family Support", mn: "Гэр бүлийн дэмжлэг" },
  "about.aim3Desc": { en: "Love, attention, and family group support for every child", mn: "Хүүхэд бүрт хайр, анхаарал, гэр бүлийн бүлгийн дэмжлэг" },
  "about.historyTab": { en: "History", mn: "Түүх" },
  "about.staffTab": { en: "Daily Staff", mn: "Өдөр тутмын ажилтан" },
  "about.volunteersTab": { en: "Volunteers", mn: "Сайн дурын ажилтнууд" },
  "about.sponsorsTab": { en: "Sponsors", mn: "Ивээгчид" },
  "about.historyTitle": { en: "Our Journey", mn: "Манай аялал" },
  "about.historyDesc": { en: "Over two decades of dedicated service to vulnerable children in Mongolia", mn: "Монголын эмзэг хүүхдүүдэд хоёр аравт жилийн нэрэгдэлтэй үйлчилгээ" },
  "about.teamTitle": { en: "Meet Our Dedicated Team", mn: "Манай нэрэгдэлтэй багийг танилцуулъя" },
  "about.teamDesc": { en: "Compassionate professionals committed to changing children's lives", mn: "Хүүхдүүдийн амьдралыг өөрчлөхөд үүрэгтэй сочирхолтой мэргэжилтнүүд" },
  "about.ctaTitle": { en: "Join Us in Making a Difference", mn: "Өөрчлөлт хийхөд бидэнтэй нэгдээрэй" },
  "about.ctaDesc": { en: "There are many ways to support Lotus Children's Centre and help vulnerable children", mn: "Лотус хүүхдийн төвийг дэмжих, эмзэг хүүхдүүдэд туслах олн арга байдаг" },
  "about.volunteersTitle": { en: "Volunteers from Around the World", mn: "Дэлхийн төрөл бүрийн сайн дурын ажилтнууд" },
  "about.volunteersDesc": { en: "International and local volunteers dedicate their time to support our mission", mn: "Олон улсын болон орон нутгийн сайн дурын ажилтнууд манай үзэл баримтлалыг дэмжихэд цагаа зориулдаг" },
  "about.volunteersContent": { en: "Volunteers from all over the world are always welcome at Lotus. Whether you can visit in person or contribute remotely, your support makes a real difference in the lives of vulnerable children.", mn: "Дэлхийн төрөл бүрээс ирсэн сайн дурын ажилтнуудыг Лотус үргэлж хүлээн авдаг. Та шууд ирэх эсвэл алсаас оролцох боломжтой бол, таны дэмжлэг эмзэг хүүхдүүдийн амьдралд жинхэнэ өөрчлөлт авчирдаг." },
  "about.volunteersRegister": { en: "Register as a Volunteer", mn: "Сайн дурын ажилтан болгон бүртгүүлэх" },
  "about.sponsorsTitle": { en: "Our Generous Sponsors", mn: "Манай сайн сэтгэлтэй ивээгчид" },
  "about.sponsorsDesc": { en: "Priceless help from organizations that believe in our mission", mn: "Манай үзэл баримтлалд итгэдэг байгууллагуудын үнэлшгүй тусламж" },
  "about.sponsorsContent": { en: "Our sponsors play a vital role in supporting Lotus Children's Centre. Through their generosity and commitment, we are able to provide quality care, education, and opportunities for vulnerable children in Mongolia.", mn: "Манай ивээгчид Лотус хүүхдийн төвийг дэмжихэд чухал үүрэг гүйцэтгэдэг. Тэдний сайн сэтгэл, үүрэгтэйгээр дамжуулан бид Монголын эмзэг хүүхдүүдэд чанартай асрамж, боловсрол, боломжийг олгож чаддаг." },
  "about.sponsorsPartner": { en: "Become a Sponsor", mn: "Ивээгч болох" },

  // Get Involved Page
  "getInvolved.hero.title": { en: "Get Involved!", mn: "Оролцох!" },
  "getInvolved.hero.desc": { en: "Have you gotten just as excited about Lotus as we are? Good news! There are multiple ways that you can help out.", mn: "Та Лотусын талаар бидэнтэй адил сонирхолтой болсон уу? Сайн мэдээ! Та туслах олн арга байдаг." },
  "getInvolved.volunteer.title": { en: "Volunteer Opportunities", mn: "Сайн дурын ажлын боломжууд" },
  "getInvolved.volunteer.desc": { en: "On-site or from further away, volunteers are always welcome at Lotus.", mn: "Газар дээр нь эсвэл алсаас, сайн дурын ажилтнуудыг Лотус үргэлж хүлээн авдаг." },
  "getInvolved.volunteer.button": { en: "Register as a Volunteer", mn: "Сайн дурын ажилтан болгон бүртгүүлэх" },
  "getInvolved.fundraise.title": { en: "Fundraising Opportunities", mn: "Хөрөнгө босгох боломжууд" },
  "getInvolved.fundraise.desc": { en: "Take a look at the different events organised for Lotus.", mn: "Лотусын төлөө зохион байгуулсан янз бүрийн арга хэмжээг үзнэ үү." },
  "getInvolved.fundraise.button": { en: "Explore Events", mn: "Арга хэмжээг үзэх" },
  "getInvolved.donate.title": { en: "Make a Donation", mn: "Хандив өгөх" },
  "getInvolved.donate.desc": { en: "Through money or objects, donations help with the running of Lotus.", mn: "Мөнгө эсвэл эд зүйлсээр дамжуулан хандив нь Лотусын үйл ажиллагаанд тусалдаг." },
  "getInvolved.donate.button": { en: "Donate Now", mn: "Одоо хандив өгөх" },
  "getInvolved.contact.title": { en: "Questions? Get in Touch", mn: "Асуулт байна уу? Холбоо барих" },
  "getInvolved.contact.desc": { en: "If you have any questions, please feel free to reach out to us.", mn: "Асуулт байвал манай руу холбогдоно уу." },
  "getInvolved.contact.email": { en: "Contact Us", mn: "Бидэнтэй холбогдох" },

  // Blog Page
  "blog.subtitle": { en: "Lotus Children's Centre", mn: "Лотус хүүхдийн төв" },
  "blog.title": { en: "News & Updates", mn: "Мэдээ & Шинэчлэл" },
  "blog.description": { en: "Stories, projects, and updates from the Lotus Children's Centre in Ulaanbaatar, Mongolia.", mn: "Улаанбаатар дахь Лотус хүүхдийн төвийн түүхүүд, төслүүд, шинэчлэлүүд." },
  "blog.readMore": { en: "Read More", mn: "Дэлгэрэнгүй" },

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
