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
      {
        sectionKey: "hero",
        label: "Page Hero",
        description: "The hero banner at the top of the About page",
        fields: [
          { key: "title", label: "Page Title", type: "text", storageKey: "title", placeholder: "e.g. About Lotus Children's Centre" },
          { key: "description", label: "Page Description", type: "textarea", storageKey: "content", placeholder: "Brief intro paragraph" },
          { key: "backgroundImage", label: "Hero Background Image", type: "image", storageKey: "imageUrl" },
        ],
      },
      {
        sectionKey: "mission",
        label: "Mission Section",
        description: "The mission/vision content area",
        fields: [
          { key: "title", label: "Section Title", type: "text", storageKey: "title", placeholder: "e.g. Our Mission" },
          { key: "content", label: "Mission Text", type: "textarea", storageKey: "content", placeholder: "Describe the mission" },
          { key: "image", label: "Mission Image", type: "image", storageKey: "imageUrl" },
        ],
      },
      {
        sectionKey: "history",
        label: "History Section",
        description: "The history/timeline content",
        fields: [
          { key: "title", label: "Section Title", type: "text", storageKey: "title", placeholder: "e.g. Our History" },
          { key: "content", label: "History Text", type: "textarea", storageKey: "content", placeholder: "Tell the story of Lotus" },
          { key: "image", label: "History Image", type: "image", storageKey: "imageUrl" },
        ],
      },
    ],
  },
  {
    pageKey: "get-involved",
    label: "Get Involved Page",
    sections: [
      {
        sectionKey: "hero",
        label: "Page Hero",
        description: "The hero banner at the top of Get Involved page",
        fields: [
          { key: "title", label: "Page Title", type: "text", storageKey: "title", placeholder: "e.g. Get Involved" },
          { key: "description", label: "Page Description", type: "textarea", storageKey: "content", placeholder: "Brief intro" },
          { key: "backgroundImage", label: "Hero Background Image", type: "image", storageKey: "imageUrl" },
        ],
      },
      {
        sectionKey: "why-involved",
        label: "Why Get Involved",
        description: "The section explaining why to get involved",
        fields: [
          { key: "title", label: "Section Title", type: "text", storageKey: "title", placeholder: "e.g. Why Get Involved?" },
          { key: "content", label: "Description", type: "textarea", storageKey: "content", placeholder: "Explain why" },
          { key: "image", label: "Section Image", type: "image", storageKey: "imageUrl" },
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
