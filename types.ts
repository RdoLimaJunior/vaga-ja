// Fix: Removed circular self-import of 'CandidateProfile' which was causing an error and was not used.
export interface Criterion {
  id: string;
  name: string;
  weight: number; // 1 to 5
}

export interface CriterionScore {
  criterionName: string;
  score: number; // 0-100
  justification: string;
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  dates: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  dates: string;
}

export interface Candidate {
  // Fix: Corrected the type of `Candidate.id` from the literal `"string"` to the `string` type.
  id: string;
  name: string; // Extracted by AI
  overallScore: number;
  scores: CriterionScore[];
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
}

// This is the direct result from the Gemini API for one candidate
export interface AnalysisResult {
  candidateName: string;
  scores: CriterionScore[];
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
}

// Behavioral Test Types
export type TestType = 'big-five' | 'disc' | 'sjt';

export interface BigFiveQuestion {
  id: string;
  dimensao: string;
  texto: string;
}

export interface DiscQuestion {
    id: string;
    opcoes: { [key: string]: string }; // {D: 'Adventurous', I: 'Enthusiastic', ...}
}

export interface SjtOption {
    id: string;
    texto: string;
    pontos: { [key: string]: number }; // {teamwork: 5, ...}
}

export interface SjtScenario {
    id: string;
    texto: string;
    opcoes: SjtOption[];
}