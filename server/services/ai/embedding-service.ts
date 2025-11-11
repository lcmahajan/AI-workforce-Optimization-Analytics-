import type { IEmbeddingService, AIServiceConfig, SkillEmbedding } from "./types";

export class EmbeddingService implements IEmbeddingService {
  private initialized: boolean = false;
  private config?: AIServiceConfig;

  async initialize(config: AIServiceConfig): Promise<boolean> {
    this.config = config;

    if (!config.enabled) {
      console.log("[Embedding Service] Disabled in config");
      return false;
    }

    console.log(`[Embedding Service] Stub: Would initialize ${config.provider} embedding service`);
    
    if (config.provider === "openai") {
      console.log("[Embedding Service] Stub: Would use OpenAI text-embedding-3-small");
    } else if (config.provider === "custom") {
      console.log(`[Embedding Service] Stub: Would connect to custom embedding API at ${config.apiUrl}`);
    } else if (config.provider === "local") {
      console.log("[Embedding Service] Stub: Would load local sentence-transformers model");
    }

    this.initialized = true;
    return true;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.initialized) {
      console.log("[Embedding Service] Using fallback random embeddings (service not initialized)");
      return this.fallbackEmbedding();
    }

    console.log(`[Embedding Service] Stub: Would generate embedding for text using ${this.config?.provider}`);
    console.log("[Embedding Service] Stub: This would return a 1536-dimensional vector for semantic similarity");
    
    return this.fallbackEmbedding();
  }

  async generateSkillEmbeddings(skills: string[]): Promise<SkillEmbedding[]> {
    if (!this.initialized) {
      console.log("[Embedding Service] Using fallback embeddings");
      return skills.map(skill => ({
        skill,
        embedding: this.fallbackEmbedding(),
      }));
    }

    console.log(`[Embedding Service] Stub: Would generate embeddings for ${skills.length} skills`);
    
    return skills.map(skill => ({
      skill,
      embedding: this.fallbackEmbedding(),
    }));
  }

  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error("Embeddings must have the same dimension");
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return similarity;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  private fallbackEmbedding(): number[] {
    const dimension = 384;
    const embedding = new Array(dimension);
    
    for (let i = 0; i < dimension; i++) {
      embedding[i] = Math.random() * 2 - 1;
    }
    
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / norm);
  }
}

export const embeddingService = new EmbeddingService();
