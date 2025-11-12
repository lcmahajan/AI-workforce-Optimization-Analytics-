# AI Assistant — Employee Insights: Production Implementation Guide

## Current Implementation (Demo/Prototype)

The current implementation uses **client-side mock data** to demonstrate the UI/UX and RBAC patterns. This is intentional for the demo phase but requires server-side implementation for production use.

## ⚠️ Security Considerations

### Demo Limitations
- All employee data (including salary/email) is bundled in the client JavaScript
- RBAC filtering happens in the browser and can be bypassed via DevTools
- This is **NOT SECURE** for production use with real employee data

### Why This Approach for Demo
- Allows instant testing without backend setup
- Demonstrates the correct UI/UX patterns
- Shows how RBAC should behave from a user perspective
- Provides clear code examples for backend integration

## 🚀 Production Implementation Requirements

### 1. Server-Side API Endpoints

Create role-aware API endpoints that filter data **before** sending to client:

```typescript
// Server-side example (Express + TypeScript)
app.get('/api/employees/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const userRole = req.user.role; // From JWT/session
  
  // Query database with role-based field selection
  let query;
  if (userRole === 'Admin') {
    query = 'SELECT * FROM employees WHERE userid = $1';
  } else if (userRole === 'Manager') {
    query = 'SELECT id, name, email, department, ... FROM employees WHERE userid = $1';
    // Exclude: salary
  } else { // Editor
    query = 'SELECT id, name, department, ... FROM employees WHERE userid = $1';
    // Exclude: salary, email
  }
  
  const employee = await db.query(query, [id]);
  res.json(employee);
});
```

### 2. Database Schema & Permissions

Consider using database-level permissions:

```sql
-- Create views for different roles
CREATE VIEW employees_manager_view AS
  SELECT id, name, email, department, position, fitment_score, productivity, utilization
  FROM employees;

CREATE VIEW employees_editor_view AS
  SELECT id, name, department, position, fitment_score, productivity, utilization
  FROM employees;

-- Grant appropriate permissions
GRANT SELECT ON employees TO admin_role;
GRANT SELECT ON employees_manager_view TO manager_role;
GRANT SELECT ON employees_editor_view TO editor_role;
```

### 3. Frontend Changes for Production

Replace mock data imports with API calls:

```typescript
// REPLACE:
import { mockEmployees } from "@/data/mockEmployeeData";
const employee = mockEmployees.find(emp => emp.userid === id);

// WITH:
const loadEmployee = async (userid: string) => {
  const response = await fetch(`/api/employees/${userid}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to load employee');
  }
  
  const employee = await response.json();
  setSelectedEmployee(employee);
};
```

### 4. AI Integration (OpenAI/LLM)

Replace mock AI function with real LLM calls:

```typescript
// Server-side AI endpoint
app.post('/api/ai/analyze-employee', authenticateUser, async (req, res) => {
  const { employeeData, query } = req.body;
  
  // Ensure user has permission to access this employee
  if (!canAccessEmployee(req.user, employeeData.id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Call OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an HR analytics assistant. Analyze employee data and provide insights."
      },
      {
        role: "user",
        content: `Analyze this employee: ${JSON.stringify(employeeData)}\nQuery: ${query}`
      }
    ]
  });
  
  res.json({ answer: response.choices[0].message.content });
});
```

### 5. Vector Database for Historical Data

For advanced queries over historical documents/reviews:

```typescript
// Example with Pinecone
import { PineconeClient } from '@pinecone-database/pinecone';

const pinecone = new PineconeClient();
await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: 'us-west1-gcp'
});

const index = pinecone.Index('employee-documents');

// Store document embeddings
await index.upsert({
  vectors: [{
    id: `${employeeId}-review-2024-q4`,
    values: embedding, // From OpenAI embeddings API
    metadata: {
      employeeId,
      documentType: 'performance_review',
      date: '2024-12-01'
    }
  }]
});

// Query for relevant context
const queryResponse = await index.query({
  vector: queryEmbedding,
  filter: { employeeId: { $eq: employeeId } },
  topK: 5,
  includeMetadata: true
});
```

### 6. Audit Logging

Log all access to sensitive employee data:

```typescript
// Server-side audit logging
app.get('/api/employees/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  
  // Log access
  await auditLog.create({
    action: 'VIEW_EMPLOYEE_PROFILE',
    userId: user.id,
    employeeId: id,
    timestamp: new Date(),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  // ... rest of endpoint logic
});
```

### 7. Export/PDF Generation

Server-side PDF generation with audit trail:

```typescript
app.post('/api/employees/:id/export', authenticateUser, async (req, res) => {
  const { id } = req.params;
  
  // Check permissions
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Only admins can export reports' });
  }
  
  // Log export
  await auditLog.create({
    action: 'EXPORT_EMPLOYEE_REPORT',
    userId: req.user.id,
    employeeId: id,
    timestamp: new Date()
  });
  
  // Generate PDF
  const employee = await getEmployeeWithPermissions(id, req.user.role);
  const pdfBuffer = await generateEmployeePDF(employee);
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=employee-${id}-report.pdf`);
  res.send(pdfBuffer);
});
```

## 🔒 Security Checklist for Production

- [ ] All employee data served via authenticated API endpoints
- [ ] Role-based field filtering implemented server-side
- [ ] Database queries filter fields based on user role
- [ ] JWT/session tokens properly validated
- [ ] API rate limiting implemented
- [ ] Audit logging for all sensitive data access
- [ ] HTTPS enforced for all endpoints
- [ ] Input validation and sanitization
- [ ] XSS protection headers configured
- [ ] CORS properly configured
- [ ] Environment variables for API keys/secrets
- [ ] No PII in client-side bundles or logs
- [ ] Regular security audits scheduled

## 📊 Monitoring & Analytics

### Key Metrics to Track
- API response times for employee queries
- AI assistant query latency
- Error rates by endpoint
- Role-based access patterns
- Failed authorization attempts
- Export/download frequency

### Recommended Tools
- Sentry for error tracking
- DataDog for performance monitoring
- CloudWatch for AWS deployments
- Custom audit dashboard for compliance

## 🧪 Testing Requirements

### Unit Tests
- RBAC filtering logic
- API endpoint authorization
- Data validation

### Integration Tests
- End-to-end role-based workflows
- AI query processing
- PDF export generation

### Security Tests
- Attempt to access restricted data with lower roles
- SQL injection testing
- XSS vulnerability scanning
- Authentication bypass attempts

## 📝 Migration Path

1. **Phase 1**: Set up backend API with role-based filtering
2. **Phase 2**: Replace mock data with API calls in frontend
3. **Phase 3**: Integrate real AI (OpenAI/Anthropic)
4. **Phase 4**: Add vector database for document search
5. **Phase 5**: Implement audit logging and monitoring
6. **Phase 6**: Add PDF export with server-side generation
7. **Phase 7**: Security audit and penetration testing

## 📧 Questions or Issues?

For production implementation questions or security concerns, contact the development team or refer to the security documentation.
