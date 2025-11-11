# Enterprise Connectors

This directory contains integration connectors for external ERP/HRMS and collaboration platforms.

## Structure

```
connectors/
├── types.ts                    # Shared TypeScript interfaces
├── index.ts                    # Connector manager and exports
├── erp/                        # ERP/HRMS connectors
│   ├── sap.ts                  # SAP connector
│   ├── workday.ts              # Workday connector
│   └── oracle.ts               # Oracle HCM connector
└── collaboration/              # Collaboration tool connectors
    ├── slack.ts                # Slack connector
    └── teams.ts                # Microsoft Teams connector
```

## Current Status: MVP Stubs

All connectors are currently **stub implementations** with defined interfaces. They log what they would do but don't make actual API calls.

## Usage

### Initialize a Connector

```typescript
import { connectorManager } from "./connectors";

// Initialize SAP connector
const config = {
  apiUrl: "https://your-sap-instance.com/api",
  apiKey: process.env.SAP_API_KEY,
  tenantId: "your-tenant-id",
  enabled: true,
};

await connectorManager.initializeConnector("sap", config);
```

### Sync Employee Data

```typescript
const sapConnector = connectorManager.getConnector("sap");
const result = await sapConnector.syncEmployees();

console.log(`Synced ${result.recordsSynced} employees`);
```

### Send Notifications via Slack

```typescript
import { connectorManager } from "./connectors";

await connectorManager.initializeConnector("slack", {
  apiKey: process.env.SLACK_BOT_TOKEN,
  enabled: true,
});

const slackConnector = connectorManager.getConnector("slack");
await slackConnector.sendNotification("U123456", "Your fitment score has been updated!");
```

## Implementing Real Connectors

To implement a real connector, replace the stub logic with actual API calls:

### Example: Real SAP Implementation

```typescript
// In server/connectors/erp/sap.ts

async syncEmployees(): Promise<SyncResult> {
  if (!this.connected) {
    throw new Error("SAP connector not connected");
  }

  try {
    // Make actual API call to SAP
    const response = await fetch(`${this.config.apiUrl}/employees`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const employees = await response.json();

    // Transform and store in database
    for (const emp of employees) {
      await storage.createUser({
        username: emp.id,
        email: emp.email,
        department: emp.department,
        // ... map other fields
      });
    }

    return {
      success: true,
      recordsSynced: employees.length,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      recordsSynced: 0,
      errors: [error.message],
      timestamp: new Date(),
    };
  }
}
```

## Available Connectors

### ERP/HRMS

- **SAP**: Enterprise resource planning and HR management
- **Workday**: Cloud-based HCM and financial management
- **Oracle HCM**: Oracle Human Capital Management Cloud

### Collaboration Tools

- **Slack**: Messaging platform for notifications and activity metrics
- **Microsoft Teams**: Microsoft 365 collaboration platform

## Adding New Connectors

1. Create a new file in the appropriate directory (erp/ or collaboration/)
2. Implement the relevant interface (IERPConnector or ICollaborationConnector)
3. Add to ConnectorManager in index.ts
4. Update this README

## Environment Variables

For production use, configure these environment variables:

```bash
# SAP
SAP_API_URL=https://your-sap-instance.com/api
SAP_API_KEY=your_api_key
SAP_TENANT_ID=your_tenant_id

# Workday
WORKDAY_API_URL=https://wd2-impl-services1.workday.com
WORKDAY_USERNAME=your_username
WORKDAY_PASSWORD=your_password
WORKDAY_TENANT_NAME=your_tenant

# Oracle HCM
ORACLE_HCM_URL=https://your-instance.oraclecloud.com
ORACLE_HCM_USERNAME=your_username
ORACLE_HCM_PASSWORD=your_password

# Slack
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_WORKSPACE_ID=T123456

# Microsoft Teams
TEAMS_APP_ID=your_app_id
TEAMS_APP_SECRET=your_app_secret
TEAMS_TENANT_ID=your_tenant_id
```
