export interface CVParseResult {
  candidateName: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: string;
  education: string;
  certifications?: string[];
  summary?: string;
  confidence: number;
}

export interface JDParseResult {
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  education: string;
  department: string;
  confidence: number;
}

export interface FitmentScore {
  employeeId: string;
  jobDescriptionId: string;
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  culturalFit: number;
  potentialGrowth: number;
  reasoning: string;
  recommendations: string[];
}

export interface SkillEmbedding {
  skill: string;
  embedding: number[];
  category?: string;
}

export interface AIServiceConfig {
  provider: "openai" | "anthropic" | "custom" | "local";
  apiKey?: string;
  apiUrl?: string;
  model?: string;
  enabled: boolean;
}

export interface INLPService {
  initialize(config: AIServiceConfig): Promise<boolean>;
  parseCV(fileContent: string): Promise<CVParseResult>;
  parseJD(fileContent: string): Promise<JDParseResult>;
  extractSkills(text: string): Promise<string[]>;
  categorizeText(text: string, categories: string[]): Promise<string>;
  isInitialized(): boolean;
}

export interface IEmbeddingService {
  initialize(config: AIServiceConfig): Promise<boolean>;
  generateEmbedding(text: string): Promise<number[]>;
  generateSkillEmbeddings(skills: string[]): Promise<SkillEmbedding[]>;
  calculateSimilarity(embedding1: number[], embedding2: number[]): number;
  isInitialized(): boolean;
}

export interface IFitmentEngine {
  initialize(config: AIServiceConfig): Promise<boolean>;
  calculateFitment(employeeId: string, jobDescriptionId: string): Promise<FitmentScore>;
  batchCalculateFitment(employeeIds: string[], jobDescriptionId: string): Promise<FitmentScore[]>;
  recommendCandidates(jobDescriptionId: string, limit: number): Promise<FitmentScore[]>;
  recommendRoles(employeeId: string, limit: number): Promise<FitmentScore[]>;
  explainScore(fitmentScore: FitmentScore): Promise<string>;
  isInitialized(): boolean;
}
