import type { ProjectId } from "./projects";

export type SkillCategory =
  | "Languages"
  | "AI & Vision"
  | "Web & Apps"
  | "Backend & Data"
  | "Tools";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  mark: string;
  icon?: string;
  note: string;
  usedIn: ProjectId[];
};

export const skillCategories: SkillCategory[] = [
  "Languages",
  "AI & Vision",
  "Web & Apps",
  "Backend & Data",
  "Tools",
];

export const skills: Skill[] = [
  {
    id: "html-css",
    name: "HTML & CSS",
    category: "Languages",
    mark: "</>",
    icon: "html-css",
    note:
      "I use semantic markup and responsive CSS to shape clear interfaces that adapt to different screens.",
    usedIn: ["api-atlas", "book-search", "api-lab", "observatory"],
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Languages",
    mark: "JS",
    icon: "javascript",
    note:
      "I use browser JavaScript to respond to form input, update the page, and work with asynchronous API results.",
    usedIn: ["api-atlas", "book-search", "api-lab"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Languages",
    mark: "TS",
    icon: "typescript",
    note:
      "I’m using TypeScript in this portfolio to give its project, skill, and profile data explicit, reusable types.",
    usedIn: ["observatory"],
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Web & Apps",
    mark: "N",
    icon: "nextjs",
    note:
      "I’m building this portfolio with the Next.js App Router and React components.",
    usedIn: ["observatory"],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Web & Apps",
    mark: "TW",
    icon: "tailwind",
    note:
      "I’m using Tailwind CSS as the styling foundation for this portfolio, with a custom set of Observatory design tokens.",
    usedIn: ["observatory"],
  },
  {
    id: "accessible-ui",
    name: "Accessible UI",
    category: "Web & Apps",
    mark: "A11Y",
    note:
      "I use semantic elements, keyboard-friendly controls, live status text, and visible focus states in my interfaces.",
    usedIn: ["book-search", "observatory"],
  },
  {
    id: "responsive-ui",
    name: "Responsive design",
    category: "Web & Apps",
    mark: "↔",
    note:
      "I build layouts that reflow for mobile and desktop instead of shrinking a desktop-only design.",
    usedIn: ["api-atlas", "book-search", "api-lab", "observatory"],
  },
  {
    id: "rest-apis",
    name: "REST APIs & Fetch",
    category: "Backend & Data",
    mark: "{ }",
    note:
      "I connect browser interfaces to public services, check responses, and turn returned data into useful UI.",
    usedIn: ["api-atlas", "book-search", "api-lab"],
  },
  {
    id: "es-modules",
    name: "ES modules",
    category: "Backend & Data",
    mark: "ES",
    note:
      "I’ve worked with modular JavaScript in the API Atlas tools to keep application code organized.",
    usedIn: ["api-atlas"],
  },
  {
    id: "github-pages",
    name: "Git & GitHub Pages",
    category: "Tools",
    mark: "GH",
    icon: "github",
    note:
      "I publish static browser projects with GitHub Pages and verify both the working route and custom error page.",
    usedIn: ["book-search", "api-lab"],
  },
];
