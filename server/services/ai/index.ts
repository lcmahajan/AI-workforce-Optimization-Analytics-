import { NLPService, nlpService } from "./nlp-service";
import { EmbeddingService, embeddingService } from "./embedding-service";
import { FitmentEngine } from "./fitment-engine";
import type { AIServiceConfig } from "./types";

export class AIServiceManager {
  private services: Map<string, any> = new Map();

  constructor() {
    this.services.set("nlp", nlpService);
    this.services.set("embedding", embeddingService);
  }

  async initializeService(name: string, config: AIServiceConfig): Promise<boolean> {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Unknown AI service: ${name}`);
    }

    return await service.initialize(config);
  }

  async initializeAll(config: AIServiceConfig): Promise<void> {
    console.log("[AI Service Manager] Initializing all AI services...");
    
    for (const [name, service] of this.services.entries()) {
      try {
        const success = await service.initialize(config);
        console.log(`[AI Service Manager] ${name}: ${success ? 'initialized' : 'disabled/failed'}`);
      } catch (error) {
        console.error(`[AI Service Manager] Failed to initialize ${name}:`, error);
      }
    }
  }

  getService(name: string): any {
    return this.services.get(name);
  }

  listServices(): string[] {
    return Array.from(this.services.keys());
  }
}

export const aiServiceManager = new AIServiceManager();

export * from "./types";
export { NLPService, nlpService } from "./nlp-service";
export { EmbeddingService, embeddingService } from "./embedding-service";
export { FitmentEngine } from "./fitment-engine";
