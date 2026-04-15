/**
 * CMS Configuration — defines all editable sections per page.
 * Each section has a key, label, and list of editable fields.
 * Fields can be: text (single line), textarea (multi-line), or image.
 */

export type CmsFieldType = "text" | "textarea" | "image";

export interface CmsField {
  key: string;       // stored in: title, content, imageUrl, or metadata[key]
  label: string;     // human-readable label
  type: CmsFieldType;
  storageKey: "title" | "content" | "imageUrl" | string; // which DB column or metadata key
  placeholder?: string;
}

export interface CmsSection {
  sectionKey: string;
  label: string;
  description: string;
  fields: CmsField[];
}

export interface CmsPage {
  pageKey: string;
  label: string;
  sections: CmsSection[];
}

export const CMS_PAGES: CmsPage[] = [
  {
    pageKey: "home",
    label: "Home Page",
    sections: [
      // ─── Hero Section ───
      {
        sectionKey: "hero",
        label: "Hero Section",
        description: "The main banner at the top of the homepage",
        fields: [
          { key: "subtitle", label: "Subtitle Badge", type: "text", storageKey: "title", placeholder: "e.g. A Loving Home" },
          { key: "title", label: "Main Heading", type: "text", storageKey: "content", placeholder: "e.g. For Vulnerable Mongolian Children" },
          { key: "description", label: "Description", type: "textarea", storageKey: "metadata.description", placeholder: "Short description below the heading" },
          { key: "backgroundImage", label: "Background Image", type: "image", storageKey: "imageUrl" },
        ],
      },
      // ─── Service Cards (Volunteer, Donate, Fundraise) ───
      {
        sectionKey: "serviceCards",
        label: "Service Cards (Volunteer / Donate / Fundraise)",
        description: "The three action cards: Volunteer, Donate, and Fundraise. Edit titles, descriptions, and button links.",
        fields: [
          { key: "volunteerTitle", label: "Volunteer Card — Title", type: "text", storageKey: "metadata.volunteerTitle", placeholder: "e.g. Volunteer" },
          { key: "volunteerDesc", label: "Volunteer Card — Description", type: "textarea", storageKey: "metadata.volunteerDesc", placeholder: "Description for volunteer card" },
          { key: "volunteerBtnText", label: "Volunteer Card — Button Text", type: "text", storageKey: "metadata.volunteerBtnText", placeholder: "e.g. Register Now" },
          { key: "donateTitle", label: "Donate Card — Title", type: "text", storageKey: "metadata.donateTitle", placeholder: "e.g. Donate" },
          { key: "donateDesc", label: "Donate Card — Description", type: "textarea", storageKey: "metadata.donateDesc", placeholder: "Description for donate card" },
          { key: "donateBtnText", label: "Donate Card — Button Text", type: "text", storageKey: "metadata.donateBtnText", placeholder: "e.g. Donate Now" },
          { key: "donateLink", label: "Donate Card — Button Link", type: "text", storageKey: "metadata.donateLink", placeholder: "e.g. https://www.justgiving.com/charity/lotuschildren-centre" },
          { key: "fundraiseTitle", label: "Fundraise Card — Title", type: "text", storageKey: "metadata.fundraiseTitle", placeholder: "e.g. Fundraise" },
          { key: "fundraiseDesc", label: "Fundraise Card — Description", type: "textarea", storageKey: "metadata.fundraiseDesc", placeholder: "Description for fundraise card" },
          { key: "fundraiseBtnText", label: "Fundraise Card — Button Text", type: "text", storageKey: "metadata.fundraiseBtnText", placeholder: "e.g. Start Fundraising" },
          { key: "fundraiseLink", label: "Fundraise Card — Button Link", type: "text", storageKey: "metadata.fundraiseLink", placeholder: "e.g. https://www.justgiving.com/create-page/in-memory" },
        ],
      },
      // ─── About / Who We Are Section ───
      {
        sectionKey: "about",
        label: "Who We Are Section",
        description: "The 'Who We Are' section with image, text, and 3 key points",
        fields: [
          { key: "subtitle", label: "Section Subtitle", type: "text", storageKey: "title", placeholder: "e.g. Who We Are" },
          { key: "heading", label: "Section Heading", type: "text", storageKey: "content", placeholder: "e.g. We Help Vulnerable Children..." },
          { key: "description", label: "Description Paragraph", type: "textarea", storageKey: "metadata.description", placeholder: "Main description text" },
          { key: "point1", label: "Key Point 1", type: "text", storageKey: "metadata.point1", placeholder: "e.g. Providing primary care including food, healthcare, and accommodation" },
          { key: "point2", label: "Key Point 2", type: "text", storageKey: "metadata.point2", placeholder: "e.g. Quality education and counselling for every child" },
          { key: "point3", label: "Key Point 3", type: "text", storageKey: "metadata.point3", placeholder: "e.g. Building self-esteem and life skills for the future" },
          { key: "image", label: "Section Image", type: "image", storageKey: "imageUrl" },
          { key: "stat", label: "Stat Overlay Text", type: "text", storageKey: "metadata.stat", placeholder: "e.g. We help more than 75 children every year" },
        ],
      },
      // ─── Impact Stats ───
      {
        sectionKey: "impact",
        label: "Impact Stats",
        description: "The statistics section with numbers, labels, and descriptions",
        fields: [
          { key: "stat1Value", label: "Stat 1 — Number", type: "text", storageKey: "metadata.stat1Value", placeholder: "e.g. 75" },
          { key: "stat1Label", label: "Stat 1 — Label", type: "text", storageKey: "metadata.stat1Label", placeholder: "e.g. Children Each Year" },
          { key: "stat1Desc", label: "Stat 1 — Description", type: "text", storageKey: "metadata.stat1Desc", placeholder: "e.g. Lotus provides a loving home and education to children" },
          { key: "stat2Value", label: "Stat 2 — Number", type: "text", storageKey: "metadata.stat2Value", placeholder: "e.g. 20" },
          { key: "stat2Label", label: "Stat 2 — Label", type: "text", storageKey: "metadata.stat2Label", placeholder: "e.g. Years of Service" },
          { key: "stat2Desc", label: "Stat 2 — Description", type: "text", storageKey: "metadata.stat2Desc", placeholder: "e.g. Serving vulnerable children since the early 2000s" },
          { key: "stat3Value", label: "Stat 3 — Number", type: "text", storageKey: "metadata.stat3Value", placeholder: "e.g. 500" },
          { key: "stat3Label", label: "Stat 3 — Label", type: "text", storageKey: "metadata.stat3Label", placeholder: "e.g. Lives Changed" },
          { key: "stat3Desc", label: "Stat 3 — Description", type: "text", storageKey: "metadata.stat3Desc", placeholder: "e.g. Children supported through education and care" },
        ],
      },
      // ─── Partners / Sponsors ───
      {
        sectionKey: "sponsors",
        label: "Our Partners Section",
        description: "The partners/sponsors marquee section. Edit section title and up to 10 partner logos.",
        fields: [
          { key: "subtitle", label: "Section Subtitle", type: "text", storageKey: "title", placeholder: "e.g. Our Partners" },
          { key: "heading", label: "Section Heading", type: "text", storageKey: "content", placeholder: "e.g. Supported By Amazing Partners" },
          { key: "partner1Name", label: "Partner 1 — Name", type: "text", storageKey: "metadata.partner1Name", placeholder: "e.g. Ulaanbaatar Elite International School" },
          { key: "partner1Logo", label: "Partner 1 — Logo", type: "image", storageKey: "metadata.partner1Logo" },
          { key: "partner2Name", label: "Partner 2 — Name", type: "text", storageKey: "metadata.partner2Name", placeholder: "e.g. Hobby School" },
          { key: "partner2Logo", label: "Partner 2 — Logo", type: "image", storageKey: "metadata.partner2Logo" },
          { key: "partner3Name", label: "Partner 3 — Name", type: "text", storageKey: "metadata.partner3Name", placeholder: "e.g. The English School of Mongolia" },
          { key: "partner3Logo", label: "Partner 3 — Logo", type: "image", storageKey: "metadata.partner3Logo" },
          { key: "partner4Name", label: "Partner 4 — Name", type: "text", storageKey: "metadata.partner4Name", placeholder: "e.g. Gulf for Good" },
          { key: "partner4Logo", label: "Partner 4 — Logo", type: "image", storageKey: "metadata.partner4Logo" },
          { key: "partner5Name", label: "Partner 5 — Name", type: "text", storageKey: "metadata.partner5Name", placeholder: "e.g. Holiday Inn Ulaanbaatar" },
          { key: "partner5Logo", label: "Partner 5 — Logo", type: "image", storageKey: "metadata.partner5Logo" },
          { key: "partner6Name", label: "Partner 6 — Name", type: "text", storageKey: "metadata.partner6Name", placeholder: "e.g. Алтан Тариа" },
          { key: "partner6Logo", label: "Partner 6 — Logo", type: "image", storageKey: "metadata.partner6Logo" },
          { key: "partner7Name", label: "Partner 7 — Name", type: "text", storageKey: "metadata.partner7Name", placeholder: "e.g. IVCO Joint Venture Company" },
          { key: "partner7Logo", label: "Partner 7 — Logo", type: "image", storageKey: "metadata.partner7Logo" },
          { key: "partner8Name", label: "Partner 8 — Name", type: "text", storageKey: "metadata.partner8Name", placeholder: "e.g. AMURT" },
          { key: "partner8Logo", label: "Partner 8 — Logo", type: "image", storageKey: "metadata.partner8Logo" },
          { key: "partner9Name", label: "Partner 9 — Name", type: "text", storageKey: "metadata.partner9Name", placeholder: "e.g. Misheel Kids Foundation" },
          { key: "partner9Logo", label: "Partner 9 — Logo", type: "image", storageKey: "metadata.partner9Logo" },
          { key: "partner10Name", label: "Partner 10 — Name", type: "text", storageKey: "metadata.partner10Name", placeholder: "Leave empty if not needed" },
          { key: "partner10Logo", label: "Partner 10 — Logo", type: "image", storageKey: "metadata.partner10Logo" },
        ],
      },
      // ─── CTA Section ───
      {
        sectionKey: "cta",
        label: "Call to Action Section",
        description: "The 'Make a Difference Today' section with donate/volunteer buttons",
        fields: [
          { key: "subtitle", label: "Subtitle", type: "text", storageKey: "title", placeholder: "e.g. Make a Difference Today" },
          { key: "heading", label: "Heading", type: "text", storageKey: "content", placeholder: "e.g. Every Child Deserves a Loving Home" },
          { key: "description", label: "Description", type: "textarea", storageKey: "metadata.description", placeholder: "Supporting text" },
          { key: "backgroundImage", label: "Background Image", type: "image", storageKey: "imageUrl" },
          { key: "donateLink", label: "Donate Button Link", type: "text", storageKey: "metadata.donateLink", placeholder: "e.g. https://www.justgiving.com/charity/lotuschildren-centre" },
          { key: "donateBtnText", label: "Donate Button Text", type: "text", storageKey: "metadata.donateBtnText", placeholder: "e.g. Donate Now" },
          { key: "volunteerBtnText", label: "Volunteer Button Text", type: "text", storageKey: "metadata.volunteerBtnText", placeholder: "e.g. Volunteer" },
        ],
      },
      // ─── Contact Section ───
      {
        sectionKey: "contact",
        label: "Contact Us Section",
        description: "Contact information displayed on the homepage",
        fields: [
          { key: "sectionSubtitle", label: "Section Subtitle", type: "text", storageKey: "metadata.sectionSubtitle", placeholder: "e.g. Get In Touch" },
          { key: "sectionTitle", label: "Section Title", type: "text", storageKey: "title", placeholder: "e.g. Contact Us" },
          { key: "address", label: "Postal Address", type: "textarea", storageKey: "content", placeholder: "PO Box 1018\nCentral Post Office\nUlaanbaatar\nMongolia" },
          { key: "email", label: "Email Address", type: "text", storageKey: "metadata.email", placeholder: "e.g. lotuschildrenscentre@gmail.com" },
          { key: "phone1Name", label: "Contact 1 — Name", type: "text", storageKey: "metadata.phone1Name", placeholder: "e.g. Didi Ananda Kalika" },
          { key: "phone1Role", label: "Contact 1 — Role", type: "text", storageKey: "metadata.phone1Role", placeholder: "e.g. Director (English)" },
          { key: "phone1Number", label: "Contact 1 — Phone Number", type: "text", storageKey: "metadata.phone1Number", placeholder: "e.g. (+976) 99132100" },
          { key: "phone2Name", label: "Contact 2 — Name", type: "text", storageKey: "metadata.phone2Name", placeholder: "e.g. Bolormaa" },
          { key: "phone2Role", label: "Contact 2 — Role", type: "text", storageKey: "metadata.phone2Role", placeholder: "e.g. Centre Manager (Mongolian and English)" },
          { key: "phone2Number", label: "Contact 2 — Phone Number", type: "text", storageKey: "metadata.phone2Number", placeholder: "e.g. (+976) 99789750" },
          { key: "phone3Name", label: "Contact 3 — Name", type: "text", storageKey: "metadata.phone3Name", placeholder: "e.g. Suugi" },
          { key: "phone3Role", label: "Contact 3 — Role", type: "text", storageKey: "metadata.phone3Role", placeholder: "e.g. General Enquiries (Mongolian and English)" },
          { key: "phone3Number", label: "Contact 3 — Phone Number", type: "text", storageKey: "metadata.phone3Number", placeholder: "e.g. (+976) 99789750" },
          { key: "postalNotice", label: "Postal Notice Text", type: "textarea", storageKey: "metadata.postalNotice", placeholder: "Warning about sending items by post" },
        ],
      },
      // ─── Footer ───
      {
        sectionKey: "footer",
        label: "Footer",
        description: "Footer content: description, social links, contact email, and tagline",
        fields: [
          { key: "siteName", label: "Site Name", type: "text", storageKey: "title", placeholder: "e.g. Lotus Children's Centre" },
          { key: "siteLocation", label: "Site Location", type: "text", storageKey: "metadata.siteLocation", placeholder: "e.g. Ulaanbaatar, Mongolia" },
          { key: "description", label: "Footer Description", type: "textarea", storageKey: "content", placeholder: "Short description about the organisation" },
          { key: "logo", label: "Footer Logo", type: "image", storageKey: "imageUrl" },
          { key: "facebookUrl", label: "Facebook URL", type: "text", storageKey: "metadata.facebookUrl", placeholder: "e.g. https://www.facebook.com/LotusChildrensCentre" },
          { key: "twitterUrl", label: "Twitter / X URL", type: "text", storageKey: "metadata.twitterUrl", placeholder: "e.g. https://www.twitter.com" },
          { key: "email", label: "Contact Email", type: "text", storageKey: "metadata.email", placeholder: "e.g. lotuschildrenscentre@gmail.com" },
          { key: "copyrightText", label: "Copyright Text", type: "text", storageKey: "metadata.copyrightText", placeholder: "e.g. Lotus Children's Centre" },
          { key: "tagline", label: "Bottom Tagline", type: "text", storageKey: "metadata.tagline", placeholder: "e.g. Made with love for the children" },
        ],
      },
    ],
  },
  {
    pageKey: "about",
    label: "About Page",
    sections: [
      // ─── Hero ───
      {
        sectionKey: "hero",
        label: "Page Hero",
        description: "The hero banner at the top of the About page",
        fields: [
          { key: "title", label: "Page Title", type: "text", storageKey: "title", placeholder: "e.g. Our Story" },
          { key: "subtitle", label: "Page Subtitle", type: "text", storageKey: "content", placeholder: "e.g. Building a loving home for vulnerable children since the early 2000s" },
          { key: "backgroundImage", label: "Hero Background Image", type: "image", storageKey: "imageUrl" },
        ],
      },
      // ─── Who We Are ───
      {
        sectionKey: "whoWeAre",
        label: "Who We Are Section",
        description: "The 'Who We Are' section with two paragraphs and a side image",
        fields: [
          { key: "subtitle", label: "Section Subtitle (badge)", type: "text", storageKey: "title", placeholder: "e.g. Who We Are" },
          { key: "heading", label: "Section Heading", type: "text", storageKey: "content", placeholder: "e.g. We Help Vulnerable Children Get a Better Life" },
          { key: "paragraph1", label: "Paragraph 1", type: "textarea", storageKey: "metadata.paragraph1", placeholder: "e.g. The Lotus Children's Centre is an official Mongolian NGO..." },
          { key: "paragraph2", label: "Paragraph 2", type: "textarea", storageKey: "metadata.paragraph2", placeholder: "e.g. Located in Gachuurt in the suburbs of Ulaanbaatar..." },
          { key: "image", label: "Side Image", type: "image", storageKey: "imageUrl" },
        ],
      },
      // ─── Aims & Beliefs ───
      {
        sectionKey: "aims",
        label: "Aims & Beliefs Section",
        description: "The three belief/value cards and section heading",
        fields: [
          { key: "subtitle", label: "Section Subtitle (badge)", type: "text", storageKey: "title", placeholder: "e.g. Our Values" },
          { key: "heading", label: "Section Heading", type: "text", storageKey: "content", placeholder: "e.g. Aims and Beliefs" },
          { key: "intro", label: "Intro Paragraph", type: "textarea", storageKey: "metadata.intro", placeholder: "e.g. Whilst Lotus is not a religious organisation..." },
          { key: "aim1Title", label: "Aim 1 — Title", type: "text", storageKey: "metadata.aim1Title", placeholder: "e.g. Primary Care" },
          { key: "aim1Desc", label: "Aim 1 — Description", type: "textarea", storageKey: "metadata.aim1Desc", placeholder: "e.g. Provide food, healthcare, clothing and suitable accommodation" },
          { key: "aim2Title", label: "Aim 2 — Title", type: "text", storageKey: "metadata.aim2Title", placeholder: "e.g. Development" },
          { key: "aim2Desc", label: "Aim 2 — Description", type: "textarea", storageKey: "metadata.aim2Desc", placeholder: "e.g. Quality education, counselling, and life skills for breaking poverty cycles" },
          { key: "aim3Title", label: "Aim 3 — Title", type: "text", storageKey: "metadata.aim3Title", placeholder: "e.g. Family Support" },
          { key: "aim3Desc", label: "Aim 3 — Description", type: "textarea", storageKey: "metadata.aim3Desc", placeholder: "e.g. Love, attention, and family group support for every child" },
        ],
      },
      // ─── History Timeline ───
      {
        sectionKey: "historyTimeline",
        label: "History Timeline",
        description: "The three timeline cards and section heading. Also includes the history section image.",
        fields: [
          { key: "sectionTitle", label: "Section Title", type: "text", storageKey: "title", placeholder: "e.g. Our Journey" },
          { key: "sectionDesc", label: "Section Description", type: "textarea", storageKey: "content", placeholder: "e.g. Over two decades of dedicated service..." },
          { key: "entry1Year", label: "Entry 1 — Year", type: "text", storageKey: "metadata.entry1Year", placeholder: "e.g. 1995" },
          { key: "entry1Title", label: "Entry 1 — Title", type: "text", storageKey: "metadata.entry1Title", placeholder: "e.g. Founded" },
          { key: "entry1Desc", label: "Entry 1 — Description", type: "textarea", storageKey: "metadata.entry1Desc", placeholder: "e.g. Founded by Didi Ananda Kalika..." },
          { key: "entry2Year", label: "Entry 2 — Year", type: "text", storageKey: "metadata.entry2Year", placeholder: "e.g. 1990s-2000s" },
          { key: "entry2Title", label: "Entry 2 — Title", type: "text", storageKey: "metadata.entry2Title", placeholder: "e.g. Growth" },
          { key: "entry2Desc", label: "Entry 2 — Description", type: "textarea", storageKey: "metadata.entry2Desc", placeholder: "e.g. Lotus grows to house, feed, care for and educate hundreds of children..." },
          { key: "entry3Year", label: "Entry 3 — Year", type: "text", storageKey: "metadata.entry3Year", placeholder: "e.g. Present" },
          { key: "entry3Title", label: "Entry 3 — Title", type: "text", storageKey: "metadata.entry3Title", placeholder: "e.g. Today" },
          { key: "entry3Desc", label: "Entry 3 — Description", type: "textarea", storageKey: "metadata.entry3Desc", placeholder: "e.g. Caring for 65+ children directly..." },
          { key: "historyImage", label: "History Section Image", type: "image", storageKey: "imageUrl" },
        ],
      },
      // ─── Daily Staff ───
      {
        sectionKey: "staff",
        label: "Daily Staff Section",
        description: "The staff team heading and description. Individual staff members can be added/edited below.",
        fields: [
          { key: "sectionTitle", label: "Section Title", type: "text", storageKey: "title", placeholder: "e.g. Meet Our Dedicated Team" },
          { key: "sectionDesc", label: "Section Description", type: "textarea", storageKey: "content", placeholder: "e.g. Compassionate professionals committed to changing children's lives" },
          { key: "teamImage", label: "Team Section Image", type: "image", storageKey: "imageUrl" },
          // Individual staff members are now managed via Admin → Team Members
        ],
      },
      // ─── Volunteer Section ───
      {
        sectionKey: "volunteerInfo",
        label: "Volunteer Section",
        description: "The volunteer tab content: intro text, fee information, and section headings",
        fields: [
          { key: "sectionTitle", label: "Section Title", type: "text", storageKey: "title", placeholder: "e.g. Volunteering at Lotus" },
          { key: "introText", label: "Intro Paragraph", type: "textarea", storageKey: "content", placeholder: "e.g. At Lotus we employ a small team of local staff..." },
          { key: "testimonialsLabel", label: "Testimonials Label", type: "text", storageKey: "metadata.testimonialsLabel", placeholder: "e.g. Testimonials" },
          { key: "testimonialsHeading", label: "Testimonials Heading", type: "text", storageKey: "metadata.testimonialsHeading", placeholder: "e.g. Stories from our volunteers" },
          { key: "faqHeading", label: "FAQ Section Heading", type: "text", storageKey: "metadata.faqHeading", placeholder: "e.g. Frequently Asked Questions" },
          { key: "volunteeringEmail", label: "Volunteering Email Address", type: "text", storageKey: "metadata.volunteeringEmail", placeholder: "e.g. volunteering@lotuschild.org" },
        ],
      },
      // ─── FAQ ───
      {
        sectionKey: "faq",
        label: "FAQ Section",
        description: "Frequently asked questions for volunteers (up to 11 Q&As)",
        fields: [
          { key: "faq1Q", label: "FAQ 1 — Question", type: "text", storageKey: "metadata.faq1Q", placeholder: "e.g. Can I volunteer if I haven't volunteered before?" },
          { key: "faq1A", label: "FAQ 1 — Answer", type: "textarea", storageKey: "metadata.faq1A", placeholder: "Answer text..." },
          { key: "faq2Q", label: "FAQ 2 — Question", type: "text", storageKey: "metadata.faq2Q", placeholder: "e.g. Can you help me obtain a visa?" },
          { key: "faq2A", label: "FAQ 2 — Answer", type: "textarea", storageKey: "metadata.faq2A", placeholder: "Answer text..." },
          { key: "faq3Q", label: "FAQ 3 — Question", type: "text", storageKey: "metadata.faq3Q", placeholder: "e.g. What happens when I arrive in Mongolia?" },
          { key: "faq3A", label: "FAQ 3 — Answer", type: "textarea", storageKey: "metadata.faq3A", placeholder: "Answer text..." },
          { key: "faq4Q", label: "FAQ 4 — Question", type: "text", storageKey: "metadata.faq4Q", placeholder: "e.g. What happens when I arrive at Lotus?" },
          { key: "faq4A", label: "FAQ 4 — Answer", type: "textarea", storageKey: "metadata.faq4A", placeholder: "Answer text..." },
          { key: "faq5Q", label: "FAQ 5 — Question", type: "text", storageKey: "metadata.faq5Q", placeholder: "e.g. How will I be managed as a volunteer?" },
          { key: "faq5A", label: "FAQ 5 — Answer", type: "textarea", storageKey: "metadata.faq5A", placeholder: "Answer text..." },
          { key: "faq6Q", label: "FAQ 6 — Question", type: "text", storageKey: "metadata.faq6Q", placeholder: "e.g. Do I need a specific project to work on at Lotus?" },
          { key: "faq6A", label: "FAQ 6 — Answer", type: "textarea", storageKey: "metadata.faq6A", placeholder: "Answer text..." },
          { key: "faq7Q", label: "FAQ 7 — Question", type: "text", storageKey: "metadata.faq7Q", placeholder: "e.g. Am I expected to work every day?" },
          { key: "faq7A", label: "FAQ 7 — Answer", type: "textarea", storageKey: "metadata.faq7A", placeholder: "Answer text..." },
          { key: "faq8Q", label: "FAQ 8 — Question", type: "text", storageKey: "metadata.faq8Q", placeholder: "e.g. What provisions are there for medical care?" },
          { key: "faq8A", label: "FAQ 8 — Answer", type: "textarea", storageKey: "metadata.faq8A", placeholder: "Answer text..." },
          { key: "faq9Q", label: "FAQ 9 — Question", type: "text", storageKey: "metadata.faq9Q", placeholder: "e.g. Why should I have to pay to volunteer?" },
          { key: "faq9A", label: "FAQ 9 — Answer", type: "textarea", storageKey: "metadata.faq9A", placeholder: "Answer text..." },
          { key: "faq10Q", label: "FAQ 10 — Question", type: "text", storageKey: "metadata.faq10Q", placeholder: "e.g. How can I overcome the language barrier?" },
          { key: "faq10A", label: "FAQ 10 — Answer", type: "textarea", storageKey: "metadata.faq10A", placeholder: "Answer text..." },
          { key: "faq11Q", label: "FAQ 11 — Question", type: "text", storageKey: "metadata.faq11Q", placeholder: "e.g. What items can I bring to donate?" },
          { key: "faq11A", label: "FAQ 11 — Answer", type: "textarea", storageKey: "metadata.faq11A", placeholder: "Answer text..." },
        ],
      },
      // ─── CTA Cards ───
      {
        sectionKey: "aboutCta",
        label: "CTA Cards (Volunteer / Donate / Fundraise)",
        description: "The three action cards at the bottom of the About page with editable titles, descriptions, button text, and links",
        fields: [
          { key: "sectionTitle", label: "Section Title", type: "text", storageKey: "title", placeholder: "e.g. Join Us in Making a Difference" },
          { key: "sectionDesc", label: "Section Description", type: "textarea", storageKey: "content", placeholder: "e.g. There are many ways to support Lotus Children's Centre..." },
          { key: "volunteerTitle", label: "Volunteer Card — Title", type: "text", storageKey: "metadata.volunteerTitle", placeholder: "e.g. Volunteer" },
          { key: "volunteerDesc", label: "Volunteer Card — Description", type: "textarea", storageKey: "metadata.volunteerDesc", placeholder: "e.g. On-site or from further away, volunteers are always welcome at Lotus." },
          { key: "volunteerBtnText", label: "Volunteer Card — Button Text", type: "text", storageKey: "metadata.volunteerBtnText", placeholder: "e.g. Register Now" },
          { key: "donateTitle", label: "Donate Card — Title", type: "text", storageKey: "metadata.donateTitle", placeholder: "e.g. Donation" },
          { key: "donateDesc", label: "Donate Card — Description", type: "textarea", storageKey: "metadata.donateDesc", placeholder: "e.g. Through money or objects, donations help with the running of Lotus." },
          { key: "donateBtnText", label: "Donate Card — Button Text", type: "text", storageKey: "metadata.donateBtnText", placeholder: "e.g. Donate Now" },
          { key: "donateLink", label: "Donate Card — Button Link", type: "text", storageKey: "metadata.donateLink", placeholder: "e.g. https://www.justgiving.com/charity/lotuschildren-centre" },
          { key: "fundraiseTitle", label: "Fundraise Card — Title", type: "text", storageKey: "metadata.fundraiseTitle", placeholder: "e.g. Fundraise" },
          { key: "fundraiseDesc", label: "Fundraise Card — Description", type: "textarea", storageKey: "metadata.fundraiseDesc", placeholder: "e.g. Take a look at the different events organised for Lotus Children's Centre." },
          { key: "fundraiseBtnText", label: "Fundraise Card — Button Text", type: "text", storageKey: "metadata.fundraiseBtnText", placeholder: "e.g. Read More" },
          { key: "fundraiseLink", label: "Fundraise Card — Button Link", type: "text", storageKey: "metadata.fundraiseLink", placeholder: "e.g. https://www.justgiving.com/create-page/in-memory" },
        ],
      },
    ],
  },
  {
    pageKey: "get-involved",
    label: "Get Involved Page",
    sections: [
      // ─── Hero ───
      {
        sectionKey: "hero",
        label: "Page Hero",
        description: "The hero banner at the top of Get Involved page",
        fields: [
          { key: "title", label: "Page Title", type: "text", storageKey: "title", placeholder: "e.g. Get Involved" },
          { key: "description", label: "Page Description", type: "textarea", storageKey: "content", placeholder: "e.g. Every child deserves a chance..." },
        ],
      },
      // ─── Volunteer Card ───
      {
        sectionKey: "card-volunteer",
        label: "Volunteer Card",
        description: "The Volunteer opportunity card — title, description, 3 bullet points, and button text",
        fields: [
          { key: "title", label: "Card Title", type: "text", storageKey: "title", placeholder: "e.g. Volunteer" },
          { key: "description", label: "Card Description", type: "textarea", storageKey: "content", placeholder: "e.g. Join our team of dedicated volunteers..." },
          { key: "detail1", label: "Bullet Point 1", type: "text", storageKey: "metadata.detail1", placeholder: "e.g. Teach English, art, or music" },
          { key: "detail2", label: "Bullet Point 2", type: "text", storageKey: "metadata.detail2", placeholder: "e.g. Help with childcare and daily activities" },
          { key: "detail3", label: "Bullet Point 3", type: "text", storageKey: "metadata.detail3", placeholder: "e.g. Support fundraising and awareness campaigns" },
          { key: "btnText", label: "Button Text", type: "text", storageKey: "metadata.btnText", placeholder: "e.g. Register Now" },
        ],
      },
      // ─── Fundraise Card ───
      {
        sectionKey: "card-fundraise",
        label: "Fundraise Card",
        description: "The Fundraise opportunity card — title, description, 3 bullet points, button text, and link",
        fields: [
          { key: "title", label: "Card Title", type: "text", storageKey: "title", placeholder: "e.g. Fundraise" },
          { key: "description", label: "Card Description", type: "textarea", storageKey: "content", placeholder: "e.g. Organise a fundraising event..." },
          { key: "detail1", label: "Bullet Point 1", type: "text", storageKey: "metadata.detail1", placeholder: "e.g. Organise a sponsored run or challenge" },
          { key: "detail2", label: "Bullet Point 2", type: "text", storageKey: "metadata.detail2", placeholder: "e.g. Host a charity dinner or auction" },
          { key: "detail3", label: "Bullet Point 3", type: "text", storageKey: "metadata.detail3", placeholder: "e.g. Create an online fundraising page" },
          { key: "btnText", label: "Button Text", type: "text", storageKey: "metadata.btnText", placeholder: "e.g. Start Fundraising" },
          { key: "btnLink", label: "Button Link", type: "text", storageKey: "metadata.btnLink", placeholder: "e.g. https://www.justgiving.com/create-page/in-memory" },
        ],
      },
      // ─── Donate Card ───
      {
        sectionKey: "card-donate",
        label: "Donate Card",
        description: "The Donate opportunity card — title, description, 3 bullet points, button text, and link",
        fields: [
          { key: "title", label: "Card Title", type: "text", storageKey: "title", placeholder: "e.g. Donate" },
          { key: "description", label: "Card Description", type: "textarea", storageKey: "content", placeholder: "e.g. Your donation makes a direct impact..." },
          { key: "detail1", label: "Bullet Point 1", type: "text", storageKey: "metadata.detail1", placeholder: "e.g. Provide food and clothing for a child" },
          { key: "detail2", label: "Bullet Point 2", type: "text", storageKey: "metadata.detail2", placeholder: "e.g. Fund education and school supplies" },
          { key: "detail3", label: "Bullet Point 3", type: "text", storageKey: "metadata.detail3", placeholder: "e.g. Support medical care and wellbeing" },
          { key: "btnText", label: "Button Text", type: "text", storageKey: "metadata.btnText", placeholder: "e.g. Donate Now" },
          { key: "btnLink", label: "Button Link", type: "text", storageKey: "metadata.btnLink", placeholder: "e.g. https://www.justgiving.com/charity/lotuschildren-centre" },
        ],
      },
      // ─── Why Get Involved ───
      {
        sectionKey: "why-involved",
        label: "Why Get Involved Section",
        description: "The section explaining why to get involved — label, heading, two paragraphs, badge text, and photo",
        fields: [
          { key: "sectionLabel", label: "Section Label (small badge text)", type: "text", storageKey: "title", placeholder: "e.g. Why Get Involved?" },
          { key: "heading", label: "Section Heading", type: "text", storageKey: "metadata.heading", placeholder: "e.g. Make a Real Difference in a Child's Life" },
          { key: "paragraph1", label: "Paragraph 1", type: "textarea", storageKey: "content", placeholder: "e.g. When you volunteer or donate..." },
          { key: "paragraph2", label: "Paragraph 2", type: "textarea", storageKey: "metadata.paragraph2", placeholder: "e.g. Your contribution goes directly..." },
          { key: "badgeCount", label: "Badge — Children Count", type: "text", storageKey: "metadata.badgeCount", placeholder: "e.g. 75+" },
          { key: "badgeLabel", label: "Badge — Label Text", type: "text", storageKey: "metadata.badgeLabel", placeholder: "e.g. Children helped every year" },
          { key: "image", label: "Section Image", type: "image", storageKey: "imageUrl" },
        ],
      },
      // ─── Quick Stats ───
      {
        sectionKey: "gi-stats",
        label: "Quick Stats (3 numbers)",
        description: "The three stat boxes at the bottom of the Why section",
        fields: [
          { key: "stat1Number", label: "Stat 1 — Number", type: "text", storageKey: "metadata.stat1Number", placeholder: "e.g. 75+" },
          { key: "stat1Label", label: "Stat 1 — Label", type: "text", storageKey: "metadata.stat1Label", placeholder: "e.g. Children Supported" },
          { key: "stat2Number", label: "Stat 2 — Number", type: "text", storageKey: "metadata.stat2Number", placeholder: "e.g. 20+" },
          { key: "stat2Label", label: "Stat 2 — Label", type: "text", storageKey: "metadata.stat2Label", placeholder: "e.g. Years of Service" },
          { key: "stat3Number", label: "Stat 3 — Number", type: "text", storageKey: "metadata.stat3Number", placeholder: "e.g. 500+" },
          { key: "stat3Label", label: "Stat 3 — Label", type: "text", storageKey: "metadata.stat3Label", placeholder: "e.g. Lives Changed" },
        ],
      },
    ],
  },
  {
    pageKey: "blog",
    label: "News & Updates",
    sections: [
      {
        sectionKey: "hero",
        label: "Page Hero",
        description: "The hero banner at the top of News page",
        fields: [
          { key: "title", label: "Page Title", type: "text", storageKey: "title", placeholder: "e.g. News & Updates" },
          { key: "description", label: "Page Description", type: "textarea", storageKey: "content", placeholder: "Brief intro" },
          { key: "backgroundImage", label: "Hero Background Image", type: "image", storageKey: "imageUrl" },
        ],
      },
    ],
  },
];

/**
 * Helper to get a CMS page config by pageKey.
 */
export function getCmsPage(pageKey: string): CmsPage | undefined {
  return CMS_PAGES.find((p) => p.pageKey === pageKey);
}

/**
 * Helper to get a section config.
 */
export function getCmsSection(pageKey: string, sectionKey: string): CmsSection | undefined {
  const page = getCmsPage(pageKey);
  return page?.sections.find((s) => s.sectionKey === sectionKey);
}
