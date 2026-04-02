/*
 * Design: "Warm Embrace" — Organic Warmth
 * Blog Page: News & Updates with blog cards and individual modals
 * Colors: Cream bg, green/orange accents from lotus logo
 */
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { X, Calendar, Clock, User, ChevronRight } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663419187993/ZwYupVgqLLQCNHGqjFQxE2/about-section-4aLVCU3JgHnUwUPHwF3mg6.webp";

interface BlogPost {
  id: string;
  title: { en: string; mn: string };
  date: string;
  readTime: { en: string; mn: string };
  author: string;
  summary: { en: string; mn: string };
  content: { en: string; mn: string };
  category: { en: string; mn: string };
  color: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "lotus-bakery",
    title: {
      en: "The Lotus Bakery Project",
      mn: "Лотус нарийн боовны төсөл"
    },
    date: "Nov 21, 2021",
    readTime: { en: "3 min read", mn: "3 мин унших" },
    author: "Loes A",
    summary: {
      en: "In 2011, the Hospitality Training Association Inc sent a chef and patisserie trainer to Mongolia to assist the Lotus Children's Centre in baking skills.",
      mn: "2011 онд Зочлох үйлчилгээний сургалтын нийгэмлэг нь Лотус хүүхдийн төвд нарийн боовны ур чадвар олгоход тусалж, тогооч, нарийн боовны сургагч багшийг Монгол руу илгээсэн."
    },
    content: {
      en: "In 2011, the Hospitality Training Association Inc sent me a chef and patisserie trainer to Mongolia to assist the Lotus Children's Centre in baking skills.\n\nThe training commenced in one of the small rooms at the then baby's house at Bayanzurkh with the kneading of dough and rolling of pastry in the dining room and then baking in an oven in one of the old bedrooms. There were about 15 very keen participants including some house mothers, cooks, staff and some of the older children. It was a fun and exciting time with language barriers and different ingredients and a baker who was new to the country and the people. We managed in a two week timeframe to set the standard and create some simple bread, pizza, pastry and other baked goods. There was a lot of laughs and fun but some really good results and the students showed a natural affinity with dough.\n\nA year later Hospitality Training Association was no more, I had changed jobs and had commenced working for the Holy Spirit Northside Private Hospital. Within my first year of employment the Children's Health and Education Fund assisted me with funds to return to do follow up training which I took leave without pay and some holidays to complete. By then Lotus has relocated to Gachuurt and the training was conducted in the garage without running water and in low lighting. Unfortunately during the move the oven was quite badly damaged but was still working. I decided that I would go about seeing how I could improve the equipment being used.\n\nMy employer heard of what I was doing and offered to assist me with fund raising. A dinner is held each year to thank the doctors who bring the patients to our hospital and it was decided that it would be a great opportunity to raise some funds to help the cause. I thought it would be great if we raised about $5000 but in less than 20 minutes $25,000 was raised.\n\nIt was decided to use these funds to set up a commercial quality bakery at the Lotus Centre. The equipment was sourced in China, paid for from Australia and freighted to Mongolia and it was quite an effort to achieve. I then arrived to oversee the installation of the equipment. It was Naadam when I unwittingly arrived so work on the bakery and the opportunity to get anything done was very limited. However, after almost having a crane land on the roof of the new bakery and getting bogged in the soft ground, the new bakery was a reality. I had time for about three days training and was training right up until it was time to fly home.\n\nIn 2015 it was decided to see if some assistance could be given to the diet of the children using the bakery to assist the main kitchen creating healthier more balanced meals. A nutritionist and I came to study the diet and look at the food options available.\n\nThen in August I returned with my Sous Chef Craig and this trip co-incided with the 20th Year Anniversary party at Lotus. We set about planning and preparing for this great event.\n\nThe plan is to return to assist Lotus in re-opening the café and teaching some special needs children some skills so they can be employed. Stay tuned!",
      mn: "2011 онд Зочлох үйлчилгээний сургалтын нийгэмлэг нь Лотус хүүхдийн төвд нарийн боовны ур чадвар олгоход тусалж, тогооч, нарийн боовны сургагч багшийг Монгол руу илгээсэн.\n\nСургалт нь Баянзүрхийн хүүхдийн байрны жижиг өрөөнд зуурмаг зуурч, хоолны өрөөнд гурилан бүтээгдэхүүн хийж, хуучин унтлагын өрөөнд зуух дээр жигнэснээр эхэлсэн. Зарим эхчүүд, тогоочид, ажилтнууд болон ахмад хүүхдүүд зэрэг 15 орчим маш идэвхтэй оролцогч байсан. Хэлний саад, өөр бүтээгдэхүүн, улс орон болон хүмүүсийг шинээр мэддэг нарийн боовчин зэрэг нь хөгжилтэй, сэтгэл хөдөлгөм цаг байсан.\n\nНэг жилийн дараа Зочлох үйлчилгээний сургалтын нийгэмлэг байхгүй болсон, би ажлаа сольж, Holy Spirit Northside хувийн эмнэлэгт ажиллаж эхэлсэн. Хүүхдийн эрүүл мэнд, боловсролын сан нь дахин сургалт хийхэд тусалсан. Тэр үед Лотус Гачуурт руу нүүсэн байсан бөгөөд сургалтыг усгүй, гэрэлтүүлэг муутай гаражинд хийсэн.\n\nАжил олгогч маань миний хийж байгаа зүйлийг сонсоод хөрөнгө босгоход тусалахаар санал болгосон. $5000 босгоно гэж бодож байсан ч 20 минутын дотор $25,000 босгосон.\n\nЭнэ хөрөнгөөр Лотус төвд мэргэжлийн чанартай нарийн боовны цех байгуулахаар шийдсэн. Тоног төхөөрөмжийг Хятадаас авч, Австралиас төлж, Монгол руу тээвэрлэсэн.\n\n2015 онд хүүхдүүдийн хоол тэжээлд нарийн боовны цехийг ашиглан эрүүл, тэнцвэртэй хоол бэлтгэхэд тусалж болох эсэхийг шийдсэн.\n\nЛотусын 20 жилийн ойн баярт зориулж бэлтгэл ажил хийсэн. Кафег дахин нээж, тусгай хэрэгцээтэй хүүхдүүдэд ур чадвар заахаар төлөвлөж байна."
    },
    category: { en: "Projects", mn: "Төслүүд" },
    color: "bg-amber-500"
  },
  {
    id: "previous-projects",
    title: {
      en: "Previous Projects",
      mn: "Өмнөх төслүүд"
    },
    date: "Nov 21, 2021",
    readTime: { en: "3 min read", mn: "3 мин унших" },
    author: "Loes A",
    summary: {
      en: "Volunteer Facilities, Website Translation, Horses and Corral, Ger and Platform, Landscaping, Basketball Court, Bakery Project, and Khutul Community Centre.",
      mn: "Сайн дурын ажилтнуудын байгууламж, вэбсайт орчуулга, морь, хашаа, гэр, тавцан, тохижилт, сагсан бөмбөгийн талбай, нарийн боовны төсөл, Хутул нийгмийн төв."
    },
    content: {
      en: "Volunteer Facilities\nIn 2017 we improved and expanded our volunteer facilities at Lotus to include a combined toilet and shower block and also a rest area for volunteers. This was an important investment so that we can continue to attract the level of volunteers we have in the past, which we rely on so heavily.\n\nWebsite Translation\nIn Spring 2016, having looked for a way to have our website translated into Mongolian, as well as English, a locally based translation company, Double Check Translation, very kindly offered to translate the website free of charge. They showed great enthusiasm for helping and we are very thankful for the help that they have given, which allowed us to open up to a wider audience.\n\nHorses and Corral\nDidi has always greatly enjoyed horse riding, and was keen for the children to also experience her joy. As well as being a source of pleasure for the children, Didi was also thinking of the long term and perhaps organizing treks as part of the trips offered by the Lotus Guesthouse. Didi's wish for horses was made possible by a kind Mongolian family currently living overseas.\n\nGer and Platform\nIn 2015, a large 12 wall carved ceremonial ger was built, initially to host the Lotus' 20th anniversary celebrations, but with the long term view of hosting various events such as yoga retreats, Tsagaan Sar and Naadam celebrations, and possibly special events like weddings.\n\nLandscaping Project Phase 1\nWhen Lotus moved to Gachuurt, the grounds of the orphanage were very bare looking, so Didi has made continuous efforts to make the Centre more attractive. Various groups have came to the Centre to plant trees and, amazingly, we now have almost 500 trees planted.\n\nBasketball Court\nThe court was made possible thanks to the generosity of two Mongolian companies, NBIK LLC and OchNaran LLC and was completed in the Autumn of 2014. It is of great benefit to the children as there was previously no even ground for the children to play sports on.\n\nBakery Project\n2011 saw the beginning of a very exciting project that still continues to this day. A chef, Paul Wilderbeek, arrived to deliver baking training to some of the children. Paul works for Holy Spirit Northside Private Hospital and was funded by the Children's Health and Education Fund.\n\nKhutul Community Centre\nIn 2006, Lotus collaborated with the local community to open up a new Cafe and Community Centre, in Khutul. The Centre was focused on providing educational and vocational programs, as well as different social clubs for the community.",
      mn: "Сайн дурын ажилтнуудын байгууламж\n2017 онд бид Лотус дахь сайн дурын ажилтнуудын байгууламжийг сайжруулж, ариун цэврийн өрөө, шүршүүрийн блок, амрах өрөөг нэмсэн.\n\nВэбсайт орчуулга\n2016 оны хаврын улиралд Double Check Translation компани вэбсайтыг үнэ төлбөргүй монгол хэл рүү орчуулахаар санал болгосон.\n\nМорь, хашаа\nДиди үргэлж морь унахад дуртай байсан бөгөөд хүүхдүүд ч бас баярлахыг хүссэн. Гадаадад амьдарч буй нэгэн Монгол гэр бүл морь худалдаж авахаар санал болгосон.\n\nГэр, тавцан\n2015 онд Лотусын 20 жилийн ойн баярт зориулж 12 ханатай сийлбэртэй гэр барьсан.\n\nТохижилтын төсөл\nЛотус Гачуурт руу нүүхэд газар нь маш хоосон харагдаж байсан тул Диди төвийг илүү сайхан болгохоор тасралтгүй хичээсэн. 500 гаруй мод тарьсан.\n\nСагсан бөмбөгийн талбай\nНБИК ХХК, ОчНаран ХХК хоёр Монгол компанийн сайн сэтгэлийн ачаар 2014 оны намар дуусгасан.\n\nНарийн боовны төсөл\n2011 онд маш сэтгэл хөдөлгөм төсөл эхэлсэн. Тогооч Пол Вилдербик хүүхдүүдэд нарийн боовны сургалт хийхээр ирсэн.\n\nХутул нийгмийн төв\n2006 онд Лотус орон нутгийн нийгэмлэгтэй хамтран Хутулд шинэ кафе, нийгмийн төв нээсэн."
    },
    category: { en: "Projects", mn: "Төслүүд" },
    color: "bg-lotus-green"
  },
  {
    id: "education",
    title: {
      en: "Education",
      mn: "Боловсрол"
    },
    date: "Nov 21, 2021",
    readTime: { en: "1 min read", mn: "1 мин унших" },
    author: "Loes A",
    summary: {
      en: "Although this is a project that will never be \"completed\", it is one that we made huge progress with in 2017.",
      mn: "Энэ бол хэзээ ч \"дуусахгүй\" төсөл боловч 2017 онд бид маш их ахиц дэвшил гаргасан."
    },
    content: {
      en: "Although this is a project that will never be \"completed\", it is one that we made huge progress with in 2017. At the start of the academic year in September we had 11 children attending new private schools in Ulaanbaatar. This is part of our drive to bring better educational opportunities to our children either through scholarship or sponsorship, or a combination of both.",
      mn: "Энэ бол хэзээ ч \"дуусахгүй\" төсөл боловч 2017 онд бид маш их ахиц дэвшил гаргасан. 9-р сарын хичээлийн жилийн эхэнд 11 хүүхэд Улаанбаатарын шинэ хувийн сургуулиудад суралцаж эхэлсэн. Энэ нь тэтгэлэг эсвэл ивээн тэтгэх, эсвэл хоёуланг нь хослуулан хүүхдүүддээ илүү сайн боловсролын боломж олгох манай хөтөлбөрийн нэг хэсэг юм."
    },
    category: { en: "Education", mn: "Боловсрол" },
    color: "bg-purple-500"
  },
  {
    id: "ivco-workshop",
    title: {
      en: "IVCO Vocational Training Workshop",
      mn: "IVCO мэргэжлийн сургалтын цех"
    },
    date: "Nov 21, 2021",
    readTime: { en: "1 min read", mn: "1 мин унших" },
    author: "Loes A",
    summary: {
      en: "As our children get older, we have an increased focus on learning new skills that can provide them more opportunities for the future.",
      mn: "Хүүхдүүд маань том болохын хэрээр ирээдүйд илүү олон боломж олгох шинэ ур чадвар суралцахад анхаарлаа хандуулж байна."
    },
    content: {
      en: "As our children get older, we have an increased focus on learning new skills that can provide them will more opportunities for the future. With this in mind in Autumn 2017 we built an extension on to our garages which became a workshop space for the older children to learn new vocational skills, such as mechanics, carpentry, maintenance, and crafts like sewing and felting. The largest single financial sponsor for this project was IVCO. Without their generous support we would not have been able to complete the building and start offering our children such valuable training opportunities.",
      mn: "Хүүхдүүд маань том болохын хэрээр ирээдүйд илүү олон боломж олгох шинэ ур чадвар суралцахад анхаарлаа хандуулж байна. Үүнийг бодолцон 2017 оны намар бид гаражийнхаа өргөтгөлийг барьж, ахмад хүүхдүүдэд механик, мужаан, засвар үйлчилгээ, оёдол, нэхмэл зэрэг мэргэжлийн ур чадвар сурах цехийн орон зай болгосон. Энэ төслийн хамгийн том санхүүгийн ивээн тэтгэгч нь IVCO байсан."
    },
    category: { en: "Skills", mn: "Ур чадвар" },
    color: "bg-orange-500"
  },
  {
    id: "renewable-energy",
    title: {
      en: "Renewable Energy",
      mn: "Сэргээгдэх эрчим хүч"
    },
    date: "Nov 14, 2021",
    readTime: { en: "1 min read", mn: "1 мин унших" },
    author: "Loes A",
    summary: {
      en: "With 260 sunny days per year, Mongolia has huge potential for the use of renewable energy from solar power.",
      mn: "Жилд 260 нарлаг өдөртэй Монгол улс нарны эрчим хүчний сэргээгдэх эрчим хүч ашиглах асар их боломжтой."
    },
    content: {
      en: "With 260 sunny days per year, Mongolia has huge potential for the use of renewable energy from solar power. In 2020 we were able to build solar panels with thanks to funding and logistical support from The Rising Sun Cyclists, Harry and Rob. We also installed an electric boiler to replace the existing coal-fired boiler at Lotus, being very aware of the challenges Mongolia faces with regards to pollution from coal fires. We are continuing with our commitment to become a more sustainable and environmentally-friendly organisation.",
      mn: "Жилд 260 нарлаг өдөртэй Монгол улс нарны эрчим хүчний сэргээгдэх эрчим хүч ашиглах асар их боломжтой. 2020 онд бид The Rising Sun Cyclists, Харри, Роб нарын санхүүжилт, логистикийн дэмжлэгээр нарны зайн самбар байгуулсан. Мөн Лотус дахь нүүрсэн зуухыг цахилгаан зуухаар сольсон. Бид илүү тогтвортой, байгаль орчинд ээлтэй байгууллага болохоор үргэлжлүүлэн ажиллаж байна."
    },
    category: { en: "Sustainability", mn: "Тогтвортой байдал" },
    color: "bg-emerald-500"
  },
  {
    id: "greenhouse",
    title: {
      en: "Greenhouse Lotus",
      mn: "Лотус хүлэмж"
    },
    date: "Nov 21, 2021",
    readTime: { en: "1 min read", mn: "1 мин унших" },
    author: "Loes A",
    summary: {
      en: "After a successful trial last year, in the summer of 2020 we transformed a large area of our land to a dedicated vegetable growing area.",
      mn: "Өнгөрсөн жилийн амжилттай туршилтын дараа 2020 оны зун бид газрынхаа том хэсгийг ногоо тариалах зориулалтын талбай болгон хувиргасан."
    },
    content: {
      en: "After a successful trial last year, in the summer of 2020 we transformed a large area of our land to a dedicated vegetable growing area, with two greenhouses to extend the growing season. The aim is to become more self-sufficient with food, at the same time as giving our children the opportunity to learn about growing food and self-sufficiency. For this project the funding was raised thanks to Gulf4Good and their partners.",
      mn: "Өнгөрсөн жилийн амжилттай туршилтын дараа 2020 оны зун бид газрынхаа том хэсгийг ногоо тариалах зориулалтын талбай болгон хувиргаж, ургац хураах улирлыг уртасгахын тулд хоёр хүлэмж барьсан. Зорилго нь хоол хүнсээр өөрийгөө хангах, хүүхдүүддээ хоол ургуулах, бие даасан байдлын талаар суралцах боломж олгох юм. Энэ төслийн санхүүжилтийг Gulf4Good болон тэдний түншүүдийн ачаар босгосон."
    },
    category: { en: "Sustainability", mn: "Тогтвортой байдал" },
    color: "bg-green-600"
  },
  {
    id: "outdoor-play",
    title: {
      en: "Outdoor Play Area",
      mn: "Гадаа тоглоомын талбай"
    },
    date: "Nov 14, 2021",
    readTime: { en: "1 min read", mn: "1 мин унших" },
    author: "Loes A",
    summary: {
      en: "In 2019, after the arrival of many young children at Lotus, we needed to adapt some of our facilities to suit babies and toddlers.",
      mn: "2019 онд Лотуст олон бага насны хүүхэд ирсний дараа бид зарим байгууламжийг нялхас, бяцхан хүүхдүүдэд тохируулах шаардлагатай болсон."
    },
    content: {
      en: "In 2019, after the arrival of many young children at Lotus, we needed to adapt some of our facilities to suit babies and toddlers. Included in this project was a secure, safe outdoor play area outside the young children's house. We built a veranda joining on to the existing indoor play room, and also brought new life to the old outdoor play area including a new climbing frame, sand pit, and a baby Mongolian ger.",
      mn: "2019 онд Лотуст олон бага насны хүүхэд ирсний дараа бид зарим байгууламжийг нялхас, бяцхан хүүхдүүдэд тохируулах шаардлагатай болсон. Энэ төсөлд бага насны хүүхдүүдийн байрны гадна аюулгүй, найдвартай тоглоомын талбай багтсан. Бид одоо байгаа дотоод тоглоомын өрөөтэй холбогдсон веранда барьж, хуучин гадаа тоглоомын талбайг шинэ авирах хүрээ, элсэн нүх, бяцхан Монгол гэрээр шинэчилсэн."
    },
    category: { en: "Facilities", mn: "Байгууламж" },
    color: "bg-rose-500"
  }
];

// Unsplash images for blog cards (relevant to each topic)
const blogImages: Record<string, string> = {
  "lotus-bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
  "previous-projects": "https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=600&h=400&fit=crop",
  "education": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  "ivco-workshop": "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&h=400&fit=crop",
  "renewable-energy": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
  "greenhouse": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
  "outdoor-play": "https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?w=600&h=400&fit=crop"
};

export default function Blog() {
  const { language, t } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedPost]);

  const categories = [
    { key: "all", en: "All Posts", mn: "Бүх нийтлэл" },
    { key: "Projects", en: "Projects", mn: "Төслүүд" },
    { key: "Education", en: "Education", mn: "Боловсрол" },
    { key: "Skills", en: "Skills", mn: "Ур чадвар" },
    { key: "Sustainability", en: "Sustainability", mn: "Тогтвортой байдал" },
    { key: "Facilities", en: "Facilities", mn: "Байгууламж" }
  ];

  const filteredPosts = filterCategory === "all"
    ? blogPosts
    : blogPosts.filter(p => p.category.en === filterCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFAF5]">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 lg:pt-24">
        <div className="relative h-[280px] lg:h-[360px] overflow-hidden">
          <img
            src={HERO_BG}
            alt="News & Updates"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <p
                className="text-lotus-orange font-semibold text-sm tracking-widest uppercase mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("blog.subtitle")}
              </p>
              <h1
                className="text-3xl lg:text-5xl font-bold text-white mb-4 max-w-xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("blog.title")}
              </h1>
              <p
                className="text-white/80 text-base lg:text-lg max-w-lg"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("blog.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border/50">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilterCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  filterCategory === cat.key
                    ? "bg-lotus-green text-white shadow-md"
                    : "bg-white text-foreground/70 hover:bg-lotus-green/10 hover:text-lotus-green border border-border/50"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {language === "en" ? cat.en : cat.mn}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 lg:py-16 flex-1">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedPost(post)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={blogImages[post.id]}
                    alt={post.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`${post.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {post.category[language]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime[language]}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-bold text-foreground mb-3 group-hover:text-lotus-green transition-colors duration-200 line-clamp-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {post.title[language]}
                  </h3>

                  <p
                    className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {post.summary[language]}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-lotus-green/10 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-lotus-green" />
                      </div>
                      <span className="text-xs font-medium text-foreground/70" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {post.author}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-lotus-green group-hover:gap-2 transition-all duration-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {t("blog.readMore")}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {language === "en" ? "No posts found in this category." : "Энэ ангилалд нийтлэл олдсонгүй."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedPost(null); }}
        >
          <div
            className="relative w-full max-w-3xl mx-4 my-8 lg:my-16 bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-56 lg:h-72 overflow-hidden rounded-t-2xl">
              <img
                src={blogImages[selectedPost.id]}
                alt={selectedPost.title[language]}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <span className={`${selectedPost.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-3`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {selectedPost.category[language]}
                </span>
                <h2
                  className="text-2xl lg:text-3xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {selectedPost.title[language]}
                </h2>
              </div>
            </div>

            {/* Modal Meta */}
            <div className="px-6 lg:px-8 py-4 border-b border-border/50 flex items-center gap-6 text-sm text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {selectedPost.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {selectedPost.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {selectedPost.readTime[language]}
              </span>
            </div>

            {/* Modal Content */}
            <div className="px-6 lg:px-8 py-8">
              <div className="prose prose-lg max-w-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {selectedPost.content[language].split("\n\n").map((paragraph, i) => {
                  // Check if paragraph starts with a bold heading pattern
                  const boldMatch = paragraph.match(/^([A-Z][A-Za-z\s&]+)\n([\s\S]+)/);
                  if (boldMatch) {
                    return (
                      <div key={i} className="mb-6">
                        <h3
                          className="text-lg font-bold text-foreground mb-2"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {boldMatch[1]}
                        </h3>
                        <p className="text-foreground/80 leading-relaxed">
                          {boldMatch[2]}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="text-foreground/80 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 lg:px-8 py-5 border-t border-border/50 flex items-center justify-between">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2.5 rounded-full border border-border hover:bg-muted/50 text-sm font-medium transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {language === "en" ? "Close" : "Хаах"}
              </button>
              <a
                href="#donate"
                className="px-6 py-2.5 rounded-full bg-lotus-orange text-white text-sm font-semibold hover:bg-lotus-orange/90 transition-colors shadow-md"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {t("nav.donate")}
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
