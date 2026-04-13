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
      {
        sectionKey: "about",
        label: "About Section",
        description: "The 'Who We Are' section with image and text",
        fields: [
          { key: "subtitle", label: "Section Subtitle", type: "text", storageKey: "title", placeholder: "e.g. Who We Are" },
          { key: "heading", label: "Section Heading", type: "text", storageKey: "content", placeholder: "e.g. We Help Vulnerable Children..." },
          { key: "description", label: "Description Paragraph", type: "textarea", storageKey: "metadata.description", placeholder: "Main description text" },
          { key: "image", label: "Section Image", type: "image", storageKey: "imageUrl" },
          { key: "stat", label: "Stat Overlay Text", type: "text", storageKey: "metadata.stat", placeholder: "e.g. We help more than 75 children every year" },
        ],
      },
      {
        sectionKey: "impact",
        label: "Impact Stats",
        description: "The statistics section (children, years, lives changed)",
        fields: [
          { key: "stat1Value", label: "Stat 1 Value", type: "text", storageKey: "metadata.stat1Value", placeholder: "e.g. 75" },
          { key: "stat1Label", label: "Stat 1 Label", type: "text", storageKey: "metadata.stat1Label", placeholder: "e.g. Children Each Year" },
          { key: "stat2Value", label: "Stat 2 Value", type: "text", storageKey: "metadata.stat2Value", placeholder: "e.g. 20" },
          { key: "stat2Label", label: "Stat 2 Label", type: "text", storageKey: "metadata.stat2Label", placeholder: "e.g. Years of Service" },
          { key: "stat3Value", label: "Stat 3 Value", type: "text", storageKey: "metadata.stat3Value", placeholder: "e.g. 500" },
          { key: "stat3Label", label: "Stat 3 Label", type: "text", storageKey: "metadata.stat3Label", placeholder: "e.g. Lives Changed" },
        ],
      },
      {
        sectionKey: "cta",
        label: "Call to Action Section",
        description: "The 'Make a Difference Today' section",
        fields: [
          { key: "subtitle", label: "Subtitle", type: "text", storageKey: "title", placeholder: "e.g. Make a Difference Today" },
          { key: "heading", label: "Heading", type: "text", storageKey: "content", placeholder: "e.g. Every Child Deserves a Loving Home" },
          { key: "description", label: "Description", type: "textarea", storageKey: "metadata.description", placeholder: "Supporting text" },
          { key: "backgroundImage", label: "Background Image", type: "image", storageKey: "imageUrl" },
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
  {
    pageKey: "contact",
    label: "Contact Section",
    sections: [
      {
        sectionKey: "info",
        label: "Contact Information",
        description: "Address, email, and phone details",
        fields: [
          { key: "title", label: "Section Title", type: "text", storageKey: "title", placeholder: "e.g. Get in Touch" },
          { key: "address", label: "Postal Address", type: "textarea", storageKey: "content", placeholder: "Full postal address" },
          { key: "email", label: "Email Address", type: "text", storageKey: "metadata.email", placeholder: "e.g. lotuschildrenscentre@gmail.com" },
          { key: "phone1", label: "Phone 1 (Name & Number)", type: "text", storageKey: "metadata.phone1", placeholder: "e.g. Didi Ananda Kalika: (+976) 99132100" },
          { key: "phone2", label: "Phone 2 (Name & Number)", type: "text", storageKey: "metadata.phone2", placeholder: "e.g. Bolormaa: (+976) 99789750" },
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
