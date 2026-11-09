export const terminalCommands = {
  whoami: "Ruziboy — Computer Engineering student & curious builder.",
  education: "Computer Engineering · Gachon University",
  languages: "Web foundations · JavaScript · TypeScript in progress",
  interests: "Useful interfaces · public APIs · accessible experiences",
  goals: "Keep learning by building, testing, and sharing real work.",
  "ls projects":
    "api-atlas/  book-search/  api-field-notes/  week10/portfolio/",
} as const;

export type TerminalCommand = keyof typeof terminalCommands;
