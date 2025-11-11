# Security & Governance

This document outlines the security measures, governance policies, and compliance requirements for the WorkForce AI Platform.

## Security Checklist Status

### ✅ 1. HTTPS in Production

**Status**: Configuration documented, requires deployment setup

**Implementation**:
- Platform is designed to run behind HTTPS in production
- On Replit: Automatically enabled when published
- On custom infrastructure: Configure reverse proxy (nginx/Caddy) with TLS certificates

**Production Configuration**:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Recommendation**: Use Let's Encrypt for free TLS certificates or Cloudflare for automatic HTTPS.

---

### ✅ 2. Password Hashing & PII Minimization

**Status**: Fully implemented

**Password Security**:
- All passwords hashed with bcrypt (salt rounds: 10)
- Never stored or logged in plain text
- Password reset requires old password verification
- Implemented in: `server/auth.ts`

**PII (Personally Identifiable Information) Minimization**:
- Only essential PII collected: username, email
- No unnecessary data fields (phone, address, etc.) in base schema
- CV parsing extracts only relevant professional data
- Upload files stored as text in database (no S3 in MVP)

**Data Storage**:
```typescript
// Users table - minimal PII
{
  username: string;     // Required for login
  email: string;        // Required for communication
  password: string;     // Hashed with bcrypt
  // No phone, address, SSN, or other sensitive PII
}
```

---

### ✅ 3. Role-Based Access Control (RBAC) & Audit Logging

**Status**: Fully implemented

**RBAC Implementation**:
- Two roles: `employee` (default) and `admin`
- Middleware: `authMiddleware` (authentication) and `requireAdmin` (authorization)
- Protected routes enforce role requirements
- AdminRoute component for UI-level protection

**Protected Endpoints** (Admin-only):
- `/api/uploads/*` - File uploads (JDs, CVs, Activity data)
- `/api/settings/*` - System configuration
- `/api/gdpr/user/:userId` - Delete other users' data
- `/api/gdpr/anonymize/:userId` - Anonymize users
- `/api/analytics/anonymized` - View anonymized analytics
- `/api/audit/logs` - View all audit logs

**Audit Trail**:
- Database table: `audit_logs`
- Middleware: Automatically logs all sensitive operations
- Captures: User ID, action, resource, method, endpoint, IP, user agent, timestamp
- Tracks changes: Before/after state for updates and deletions

**Audited Actions**:
- Authentication (login, register, logout)
- User CRUD operations
- Settings changes
- File uploads
- Fitment assessments

**Example Audit Log**:
```json
{
  "id": "uuid",
  "userId": "user-123",
  "action": "update",
  "resource": "users",
  "resourceId": "user-456",
  "method": "PUT",
  "endpoint": "/api/users/user-456",
  "statusCode": 200,
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "changes": {
    "before": { "role": "employee" },
    "after": { "role": "admin" }
  },
  "timestamp": "2025-11-11T12:00:00Z"
}
```

---

### ✅ 4. GDPR Compliance

**Status**: Fully implemented

**Right to Access** (Article 15):
- `GET /api/gdpr/export` - Export all personal data in JSON format
- Includes: User profile, activities, uploads, audit logs
- User can download their complete data package

**Right to Erasure** (Article 17):
- `POST /api/gdpr/delete-my-data` - User self-service data deletion
- `DELETE /api/gdpr/user/:userId` - Admin-initiated deletion
- Deletes: User profile, activities, uploads
- Anonymizes: Audit logs (preserves audit trail while removing PII)

**Right to be Forgotten**:
- `POST /api/gdpr/anonymize/:userId` - Anonymize user (admin-only)
- Replaces username, email with anonymized values
- Retains analytics data for business intelligence

**Anonymized Analytics** (Privacy by Design):
- `GET /api/analytics/anonymized` - Get anonymized analytics (admin-only)
- User IDs hashed to prevent re-identification
- Only aggregated and departmental data exposed
- No email, username, or identifiable information

**Data Retention**:
- Active users: Data retained indefinitely
- Deleted users: Complete removal within 30 days
- Audit logs: Retained for 7 years (compliance requirement)

---

### ✅ 5. Explainability Logs for AI Decisions

**Status**: Fully implemented

**Fitment Explainability**:
- Database table: `fitment_explanations`
- Every fitment score includes detailed explanation
- Logged automatically when fitment assessment runs

**Explainability Data Captured**:
```typescript
{
  employeeId: string;
  jobDescriptionId: string;
  overallScore: number;              // Final fitment score
  skillMatch: number;                // Skill alignment score
  experienceMatch: number;           // Experience level score
  culturalFit: number;               // Culture/soft skills score
  potentialGrowth: number;           // Growth potential score
  reasoning: string;                 // Natural language explanation
  recommendations: string[];         // Actionable recommendations
  aiModel: string;                   // e.g., "gpt-4", "heuristic-v1"
  aiProvider: string;                // e.g., "openai", "custom"
  decisionFactors: {
    skillsMatched: string[];         // Skills that aligned
    skillsGap: string[];             // Skills missing
    experienceYears: number;
    strengthAreas: string[];
    developmentAreas: string[];
  };
  calculatedAt: Date;
}
```

**Access Control**:
- `GET /api/fitment/explanation/:employeeId/:jobId`
- Employees can view their own explanations
- Admins can view all explanations
- Supports transparency and contestability (GDPR Article 22)

**Example Explanation**:
```json
{
  "overallScore": 85.3,
  "skillMatch": 88.0,
  "experienceMatch": 82.0,
  "culturalFit": 85.0,
  "potentialGrowth": 87.0,
  "reasoning": "The candidate demonstrates strong technical skills with 88% skill alignment, particularly excelling in React, TypeScript, and Node.js. Experience level (5 years) aligns well with senior role requirements. Cultural fit assessment shows strong teamwork and communication skills. High growth potential identified based on learning trajectory and adaptability scores.",
  "recommendations": [
    "Consider advanced React architecture training",
    "Pair with senior engineer for system design mentorship",
    "Explore leadership opportunities in 6-12 months"
  ],
  "decisionFactors": {
    "skillsMatched": ["React", "TypeScript", "Node.js", "PostgreSQL"],
    "skillsGap": ["Kubernetes", "AWS Lambda"],
    "experienceYears": 5,
    "strengthAreas": ["Frontend development", "API design", "Team collaboration"],
    "developmentAreas": ["Cloud architecture", "DevOps practices"]
  }
}
```

---

## Additional Security Measures

### Authentication Security

**JWT Token Management**:
- 8-hour expiry (configurable)
- Signed with SESSION_SECRET environment variable
- Stored in localStorage (client-side)
- ⚠️ **Production TODO**: Migrate to HTTP-only cookies to prevent XSS attacks

**Password Policy**:
- Minimum length enforced by Zod validation
- Bcrypt hashing with salt rounds = 10
- Password change requires old password verification

### API Security

**Input Validation**:
- All inputs validated with Zod schemas
- SQL injection prevention via parameterized queries (Drizzle ORM)
- XSS protection via JSON serialization

**Rate Limiting** (Recommended for Production):
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### Data Security

**Database Encryption**:
- Connection over TLS (Neon PostgreSQL default)
- Passwords hashed with bcrypt
- Environment variables for secrets

**File Upload Security**:
- File size limits (enforced by Multer)
- File type validation (PDF, DOCX, CSV)
- Virus scanning recommended for production

---

## Compliance Certifications

### GDPR (General Data Protection Regulation)

**Implemented**:
- ✅ Lawful basis for processing (Article 6)
- ✅ Data minimization (Article 5)
- ✅ Right to access (Article 15)
- ✅ Right to erasure (Article 17)
- ✅ Right to data portability (Article 20)
- ✅ Automated decision-making transparency (Article 22)
- ✅ Privacy by design (Article 25)

**TODO for Production**:
- [ ] Data Processing Agreement (DPA) with cloud providers
- [ ] GDPR-compliant cookie consent banner
- [ ] Data breach notification process
- [ ] Privacy Impact Assessment (PIA)
- [ ] Designate Data Protection Officer (DPO) if required

### SOC 2 (Future)

**Type II Controls**:
- [ ] Access control policies
- [ ] Encryption at rest and in transit
- [ ] Incident response plan
- [ ] Regular security audits
- [ ] Employee security training

---

## Security Best Practices

### For Developers

1. **Never commit secrets to git**
   - Use `.env` files (gitignored)
   - Use Replit Secrets for API keys
   - Rotate credentials regularly

2. **Validate all inputs**
   - Use Zod schemas for API endpoints
   - Sanitize user-generated content
   - Implement CSRF tokens for state-changing operations

3. **Follow principle of least privilege**
   - Users should have minimum necessary permissions
   - Admin routes protected with `requireAdmin` middleware
   - Database queries scoped to user context

### For Administrators

1. **Review audit logs regularly**
   - `GET /api/audit/logs` - View all system activity
   - Monitor for suspicious patterns
   - Set up alerts for critical actions

2. **User access management**
   - Regularly review user roles
   - Remove inactive accounts
   - Enforce password rotation policy

3. **Data backup and recovery**
   - Automated daily database backups
   - Test restore procedures quarterly
   - Store backups in separate region

---

## Incident Response

### Data Breach Protocol

1. **Detect**: Monitor audit logs and system alerts
2. **Contain**: Immediately revoke compromised credentials
3. **Assess**: Determine scope of breach (affected users, data types)
4. **Notify**: 
   - Affected users within 72 hours (GDPR requirement)
   - Regulatory authorities if required
   - Document incident in audit log
5. **Remediate**: Patch vulnerabilities, reset credentials
6. **Review**: Post-incident analysis and prevention measures

### Security Contacts

- **Security Team**: security@example.com
- **DPO (Data Protection Officer)**: dpo@example.com
- **Emergency Hotline**: +1-XXX-XXX-XXXX

---

## Production Deployment Checklist

### Before Going Live

- [ ] Enable HTTPS/TLS on all endpoints
- [ ] Migrate JWT tokens to HTTP-only cookies
- [ ] Enable rate limiting on API endpoints
- [ ] Configure WAF (Web Application Firewall)
- [ ] Set up monitoring and alerting (Sentry, DataDog)
- [ ] Implement database backups (daily minimum)
- [ ] Enable file upload virus scanning
- [ ] Review and harden CORS policy
- [ ] Conduct penetration testing
- [ ] Complete GDPR compliance audit
- [ ] Train team on security policies
- [ ] Document incident response procedures

### Environment Variables Required

```bash
# Application
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://...

# Security
SESSION_SECRET=<strong-random-secret>
JWT_EXPIRY=8h

# GDPR
DATA_RETENTION_DAYS=2555  # 7 years
ANONYMIZATION_ENABLED=true

# AI Services (if enabled)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

---

## Audit & Monitoring

### Key Metrics to Monitor

- Failed login attempts (potential brute force)
- Unusual API access patterns
- Admin privilege escalations
- Mass data exports
- GDPR deletion requests

### Recommended Tools

- **Logging**: Winston, Pino
- **Monitoring**: Datadog, New Relic
- **Error Tracking**: Sentry
- **Security Scanning**: Snyk, OWASP ZAP

---

## Contact & Support

For security concerns or to report a vulnerability:
- Email: security@example.com
- Responsible Disclosure Policy: https://example.com/security

Last Updated: November 11, 2025
