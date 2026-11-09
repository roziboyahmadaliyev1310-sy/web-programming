export type Certification = {
  issuer: string;
  title: string;
  date: string;
  verifyUrl?: string;
  coveredTopics: string[];
};

export const certifications: Certification[] = [];
