import type { IERPConnector, ConnectorConfig, SyncResult, EmployeeData } from "../types";

export class SAPConnector implements IERPConnector {
  private connected: boolean = false;
  private config?: ConnectorConfig;

  async connect(config: ConnectorConfig): Promise<boolean> {
    this.config = config;
    
    if (!config.enabled) {
      console.log("[SAP Connector] Disabled in config");
      return false;
    }

    console.log("[SAP Connector] Stub: Would connect to SAP with config:", {
      apiUrl: config.apiUrl,
      tenantId: config.tenantId,
    });

    this.connected = true;
    return true;
  }

  async disconnect(): Promise<void> {
    console.log("[SAP Connector] Stub: Disconnecting from SAP");
    this.connected = false;
  }

  async syncEmployees(): Promise<SyncResult> {
    if (!this.connected) {
      throw new Error("SAP connector not connected");
    }

    console.log("[SAP Connector] Stub: Would sync employees from SAP HR module");
    
    return {
      success: true,
      recordsSynced: 0,
      timestamp: new Date(),
      errors: ["Stub implementation - no actual sync performed"],
    };
  }

  async syncActivities(startDate: Date, endDate: Date): Promise<SyncResult> {
    if (!this.connected) {
      throw new Error("SAP connector not connected");
    }

    console.log(`[SAP Connector] Stub: Would sync activities from ${startDate} to ${endDate}`);
    
    return {
      success: true,
      recordsSynced: 0,
      timestamp: new Date(),
      errors: ["Stub implementation - no actual sync performed"],
    };
  }

  async getEmployee(employeeId: string): Promise<EmployeeData | null> {
    if (!this.connected) {
      throw new Error("SAP connector not connected");
    }

    console.log(`[SAP Connector] Stub: Would fetch employee ${employeeId} from SAP`);
    return null;
  }

  isConnected(): boolean {
    return this.connected;
  }
}
