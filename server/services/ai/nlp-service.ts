import type { INLPService, AIServiceConfig, CVParseResult, JDParseResult } from "./types";

export class NLPService implements INLPService {
  private initialized: boolean = false;
  private config?: AIServiceConfig;

  async initialize(config: AIServiceConfig): Promise<boolean> {
    this.config = config;

    if (!config.enabled) {
      console.log("[NLP Service] Disabled in config");
      return false;
    }

    console.log(`[NLP Service] Stub: Would initialize ${config.provider} NLP service`);
    
    if (config.provider === "openai") {
      console.log("[NLP Service] Stub: Would connect to OpenAI API with key");
    } else if (config.provider === "custom") {
      console.log(`[NLP Service] Stub: Would connect to custom microservice at ${config.apiUrl}`);
    } else if (config.provider === "local") {
      console.log("[NLP Service] Stub: Would load local spaCy/transformers model");
    }

    this.initialized = true;
    return true;
  }

  async parseCV(fileContent: string): Promise<CVParseResult> {
    if (!this.initialized) {
      console.log("[NLP Service] Using fallback regex-based parsing (service not initialized)");
      return this.fallbackCVParsing(fileContent);
    }

    console.log(`[NLP Service] Stub: Would use ${this.config?.provider} to parse CV with advanced NLP`);
    console.log("[NLP Service] Stub: This would use named entity recognition, skill taxonomy mapping, etc.");
    
    return this.fallbackCVParsing(fileContent);
  }

  async parseJD(fileContent: string): Promise<JDParseResult> {
    if (!this.initialized) {
      console.log("[NLP Service] Using fallback regex-based parsing (service not initialized)");
      return this.fallbackJDParsing(fileContent);
    }

    console.log(`[NLP Service] Stub: Would use ${this.config?.provider} to parse JD with advanced NLP`);
    console.log("[NLP Service] Stub: This would extract requirements, qualifications, and responsibilities");
    
    return this.fallbackJDParsing(fileContent);
  }

  async extractSkills(text: string): Promise<string[]> {
    if (!this.initialized) {
      return this.fallbackSkillExtraction(text);
    }

    console.log(`[NLP Service] Stub: Would use ${this.config?.provider} to extract skills from text`);
    console.log("[NLP Service] Stub: This would use skill taxonomy and entity recognition");
    
    return this.fallbackSkillExtraction(text);
  }

  async categorizeText(text: string, categories: string[]): Promise<string> {
    if (!this.initialized) {
      return categories[0] || "uncategorized";
    }

    console.log(`[NLP Service] Stub: Would categorize text into one of: ${categories.join(", ")}`);
    return categories[0] || "uncategorized";
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  private fallbackCVParsing(fileContent: string): CVParseResult {
    const emailMatch = fileContent.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = fileContent.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    const skillKeywords = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", "AWS", "Docker", "Kubernetes", "Git"];
    const extractedSkills = skillKeywords.filter((skill) => 
      fileContent.toLowerCase().includes(skill.toLowerCase())
    );

    const lines = fileContent.split('\n').filter(line => line.trim().length > 0);
    const candidateName = lines[0]?.trim() || "Unknown";

    const experienceMatch = fileContent.match(/experience[:\s]+([\s\S]{0,500})/i);
    const educationMatch = fileContent.match(/education[:\s]+([\s\S]{0,300})/i);

    return {
      candidateName,
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : undefined,
      skills: extractedSkills,
      experience: experienceMatch ? experienceMatch[1].substring(0, 200) : "",
      education: educationMatch ? educationMatch[1].substring(0, 150) : "",
      confidence: 0.6,
    };
  }

  private fallbackJDParsing(fileContent: string): JDParseResult {
    const lines = fileContent.split('\n').filter(line => line.trim().length > 0);
    
    const skillKeywords = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", "AWS"];
    const requiredSkills = skillKeywords.filter((skill) => 
      fileContent.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      title: lines[0]?.trim() || "Untitled Position",
      description: fileContent.substring(0, 500),
      requiredSkills,
      preferredSkills: [],
      experience: "Not specified",
      education: "Not specified",
      department: "General",
      confidence: 0.5,
    };
  }

  private fallbackSkillExtraction(text: string): string[] {
    const skillKeywords = [
      "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL", 
      "AWS", "Docker", "Kubernetes", "Git", "CI/CD", "Agile", "Scrum"
    ];
    
    return skillKeywords.filter((skill) => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
  }
}

export const nlpService = new NLPService();
