import type { IFitmentEngine, AIServiceConfig, FitmentScore } from "./types";
import { embeddingService } from "./embedding-service";
import type { IStorage } from "../../storage";

export class FitmentEngine implements IFitmentEngine {
  private initialized: boolean = false;
  private config?: AIServiceConfig;
  private storage?: IStorage;

  constructor(storage?: IStorage) {
    this.storage = storage;
  }

  async initialize(config: AIServiceConfig): Promise<boolean> {
    this.config = config;

    if (!config.enabled) {
      console.log("[Fitment Engine] Disabled in config");
      return false;
    }

    console.log(`[Fitment Engine] Stub: Would initialize AI-powered fitment engine using ${config.provider}`);
    
    if (config.provider === "openai") {
      console.log("[Fitment Engine] Stub: Would use GPT-4 for reasoning about candidate fit");
    } else if (config.provider === "custom") {
      console.log(`[Fitment Engine] Stub: Would connect to custom ML model at ${config.apiUrl}`);
    }

    await embeddingService.initialize(config);

    this.initialized = true;
    return true;
  }

  async calculateFitment(employeeId: string, jobDescriptionId: string): Promise<FitmentScore> {
    if (!this.initialized) {
      console.log("[Fitment Engine] Using fallback heuristic scoring (AI not initialized)");
      return this.fallbackFitmentCalculation(employeeId, jobDescriptionId);
    }

    console.log(`[Fitment Engine] Stub: Would use AI to calculate fitment between employee ${employeeId} and JD ${jobDescriptionId}`);
    console.log("[Fitment Engine] Stub: This would:");
    console.log("  - Generate embeddings for employee skills and JD requirements");
    console.log("  - Use semantic similarity for skill matching");
    console.log("  - Apply ML model to predict cultural fit");
    console.log("  - Generate natural language reasoning with LLM");
    
    return this.fallbackFitmentCalculation(employeeId, jobDescriptionId);
  }

  async batchCalculateFitment(employeeIds: string[], jobDescriptionId: string): Promise<FitmentScore[]> {
    console.log(`[Fitment Engine] Stub: Would batch process ${employeeIds.length} employees for JD ${jobDescriptionId}`);
    
    const scores = await Promise.all(
      employeeIds.map(id => this.calculateFitment(id, jobDescriptionId))
    );
    
    return scores.sort((a, b) => b.overallScore - a.overallScore);
  }

  async recommendCandidates(jobDescriptionId: string, limit: number = 10): Promise<FitmentScore[]> {
    console.log(`[Fitment Engine] Stub: Would recommend top ${limit} candidates for JD ${jobDescriptionId}`);
    console.log("[Fitment Engine] Stub: This would query all employees and rank by fitment score");
    
    return [];
  }

  async recommendRoles(employeeId: string, limit: number = 10): Promise<FitmentScore[]> {
    console.log(`[Fitment Engine] Stub: Would recommend top ${limit} roles for employee ${employeeId}`);
    console.log("[Fitment Engine] Stub: This would query all JDs and rank by fitment score");
    
    return [];
  }

  async explainScore(fitmentScore: FitmentScore): Promise<string> {
    if (!this.initialized) {
      return this.fallbackExplanation(fitmentScore);
    }

    console.log(`[Fitment Engine] Stub: Would use ${this.config?.provider} to generate natural language explanation`);
    console.log("[Fitment Engine] Stub: This would provide detailed reasoning about the fitment score");
    
    return this.fallbackExplanation(fitmentScore);
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  private fallbackFitmentCalculation(employeeId: string, jobDescriptionId: string): FitmentScore {
    const skillMatch = Math.random() * 40 + 50;
    const experienceMatch = Math.random() * 30 + 60;
    const culturalFit = Math.random() * 30 + 60;
    const potentialGrowth = Math.random() * 40 + 50;

    const overallScore = (
      skillMatch * 0.4 +
      experienceMatch * 0.3 +
      culturalFit * 0.2 +
      potentialGrowth * 0.1
    );

    return {
      employeeId,
      jobDescriptionId,
      overallScore: Math.round(overallScore * 10) / 10,
      skillMatch: Math.round(skillMatch * 10) / 10,
      experienceMatch: Math.round(experienceMatch * 10) / 10,
      culturalFit: Math.round(culturalFit * 10) / 10,
      potentialGrowth: Math.round(potentialGrowth * 10) / 10,
      reasoning: "Heuristic-based scoring using basic keyword matching and experience level comparison.",
      recommendations: [
        "Consider upskilling in key technical areas",
        "Align experience with role requirements",
        "Explore cross-functional opportunities"
      ],
    };
  }

  private fallbackExplanation(score: FitmentScore): string {
    return `The candidate received an overall fitment score of ${score.overallScore}%. ` +
           `This score is based on skill match (${score.skillMatch}%), ` +
           `experience alignment (${score.experienceMatch}%), ` +
           `cultural fit (${score.culturalFit}%), and growth potential (${score.potentialGrowth}%). ` +
           `${score.reasoning}`;
  }
}
