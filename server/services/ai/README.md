# AI Services

This directory contains AI-powered services for NLP, embeddings, and fitment scoring.

## Structure

```
services/ai/
├── types.ts                    # TypeScript interfaces
├── index.ts                    # Service manager and exports
├── nlp-service.ts              # Natural Language Processing
├── embedding-service.ts        # Text embeddings and similarity
└── fitment-engine.ts           # AI-powered fitment scoring
```

## Current Status: MVP with Fallbacks

All services include **stub implementations** with fallback logic:
- Services log what they would do with real AI
- Fallback to regex/heuristic methods when AI not initialized
- Designed with pluggable backends (OpenAI, custom microservice, local models)

## Services Overview

### 1. NLP Service

Handles text parsing and extraction using natural language processing.

**Capabilities:**
- Parse CVs to extract structured data (name, email, skills, experience)
- Parse job descriptions to extract requirements and qualifications
- Extract skills from any text
- Categorize text into predefined categories

**Supported Backends:**
- `openai`: OpenAI GPT models for parsing
- `anthropic`: Anthropic Claude models
- `custom`: Your own Python microservice (spaCy, transformers, etc.)
- `local`: Local models running on the server

### 2. Embedding Service

Generates vector embeddings for semantic similarity.

**Capabilities:**
- Generate embeddings for text/skills
- Calculate cosine similarity between embeddings
- Batch process skill embeddings

**Supported Backends:**
- `openai`: OpenAI text-embedding-3-small/large
- `custom`: Custom embedding API
- `local`: sentence-transformers models

### 3. Fitment Engine

AI-powered employee-to-role matching and recommendations.

**Capabilities:**
- Calculate fitment scores between employees and job descriptions
- Batch scoring for multiple candidates
- Recommend top candidates for a role
- Recommend top roles for an employee
- Generate natural language explanations for scores

**Scoring Components:**
- Skill match (40% weight)
- Experience match (30% weight)
- Cultural fit (20% weight)
- Growth potential (10% weight)

## Usage Examples

### Initialize Services

```typescript
import { aiServiceManager } from "./services/ai";

// Initialize all AI services with OpenAI
await aiServiceManager.initializeAll({
  provider: "openai",
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4",
  enabled: true,
});
```

### Parse CV with NLP

```typescript
import { nlpService } from "./services/ai";

const cvText = "...resume content...";
const result = await nlpService.parseCV(cvText);

console.log(result.candidateName);  // "John Doe"
console.log(result.email);          // "john@example.com"
console.log(result.skills);         // ["JavaScript", "React", "Node.js"]
console.log(result.confidence);     // 0.95
```

### Calculate Fitment Score

```typescript
import { FitmentEngine } from "./services/ai/fitment-engine";
import { storage } from "./storage";

const fitmentEngine = new FitmentEngine(storage);
await fitmentEngine.initialize({
  provider: "openai",
  apiKey: process.env.OPENAI_API_KEY,
  enabled: true,
});

const score = await fitmentEngine.calculateFitment(
  "employee-123",
  "jd-456"
);

console.log(score.overallScore);      // 85.3
console.log(score.reasoning);         // "Strong technical skills match..."
console.log(score.recommendations);   // ["Consider advanced React training..."]
```

### Generate Embeddings

```typescript
import { embeddingService } from "./services/ai";

const embedding = await embeddingService.generateEmbedding(
  "Full-stack developer with 5 years React experience"
);

const skillEmbeddings = await embeddingService.generateSkillEmbeddings([
  "React",
  "Node.js",
  "PostgreSQL"
]);

const similarity = embeddingService.calculateSimilarity(
  embedding,
  skillEmbeddings[0].embedding
);
```

## Implementing Real AI Integration

### Option 1: OpenAI Integration

```typescript
// In nlp-service.ts
async parseCV(fileContent: string): Promise<CVParseResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'Extract structured data from this CV. Return JSON with candidateName, email, skills, experience, education.'
      }, {
        role: 'user',
        content: fileContent
      }],
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
```

### Option 2: Custom Python Microservice

**Python Service (FastAPI):**
```python
# nlp_service.py
from fastapi import FastAPI
import spacy

app = FastAPI()
nlp = spacy.load("en_core_web_lg")

@app.post("/parse-cv")
async def parse_cv(text: str):
    doc = nlp(text)
    
    # Extract entities and skills
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    
    return {
        "candidateName": extract_name(doc),
        "email": extract_email(text),
        "skills": extract_skills(doc),
        "experience": extract_experience(doc),
        "education": extract_education(doc),
        "confidence": 0.92
    }
```

**TypeScript Client:**
```typescript
// In nlp-service.ts
async parseCV(fileContent: string): Promise<CVParseResult> {
  const response = await fetch(`${this.config.apiUrl}/parse-cv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: fileContent })
  });

  return await response.json();
}
```

### Option 3: Replit AI Integration

Use Replit's AI integrations to automatically manage API keys:

```typescript
// Search for AI integrations
import { search_integrations } from "@replit/integrations";

// This will find OpenAI, Anthropic, etc. integrations
// that handle API key management automatically
```

## Configuration

### Environment Variables

```bash
# AI Service Provider
AI_PROVIDER=openai          # openai, anthropic, custom, local
AI_ENABLED=true

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-opus-20240229

# Custom Microservice
CUSTOM_NLP_URL=http://localhost:8000
CUSTOM_EMBEDDING_URL=http://localhost:8001

# Weights for Fitment Scoring (can be configured per admin settings)
FITMENT_SKILL_WEIGHT=0.4
FITMENT_EXPERIENCE_WEIGHT=0.3
FITMENT_CULTURAL_FIT_WEIGHT=0.2
FITMENT_GROWTH_POTENTIAL_WEIGHT=0.1
```

## Future Enhancements

### Phase 1: Real AI Integration
- [ ] Integrate OpenAI for CV/JD parsing
- [ ] Use OpenAI embeddings for skill matching
- [ ] GPT-4 for fitment reasoning and explanations

### Phase 2: Advanced Features
- [ ] Fine-tuned models for domain-specific parsing
- [ ] Custom skill taxonomy and ontology
- [ ] Multi-language support
- [ ] Continuous learning from user corrections

### Phase 3: ML Pipeline
- [ ] Train custom models on historical data
- [ ] A/B testing for different scoring algorithms
- [ ] Explainable AI for fitment decisions
- [ ] Predictive analytics for employee success

## Testing

```typescript
// test/ai-services.test.ts
import { nlpService } from "../server/services/ai";

describe("NLP Service", () => {
  it("should parse CV without AI (fallback)", async () => {
    const result = await nlpService.parseCV("John Doe\njohn@example.com\nSkills: JavaScript");
    expect(result.candidateName).toBe("John Doe");
    expect(result.email).toBe("john@example.com");
  });
});
```
