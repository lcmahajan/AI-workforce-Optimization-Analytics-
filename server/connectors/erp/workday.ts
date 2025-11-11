import type { IERPConnector, ConnectorConfig, SyncResult, EmployeeData } from "../types";

export class WorkdayConnector implements IERPConnector {
  private connected: boolean = false;
  private config?: ConnectorConfig;

  async connect(config: ConnectorConfig): Promise<boolean> {
    this.config = config;
    
    if (!config.enabled) {
      console.log("[Workday Connector] Disabled in config");
      return false;
    }

    console.log("[Workday Connector] Stub: Would connect to Workday API with config:", {
      apiUrl: config.apiUrl,
      tenantId: config.tenantId,
    });

    this.connected = true;
    return true;
  }

  async disconnect(): Promise<void> {
    console.log("[Workday Connector] Stub: Disconnecting from Workday");
    this.connected = false;
  }

  async syncEmployees(): Promise<SyncResult> {
    if (!this.connected) {
      throw new Error("Workday connector not connected");
    }

    console.log("[Workday Connector] Stub: Would sync employees from Workday HCM");
    
    return {
      success: true,
      recordsSynced: 0,
      timestamp: new Date(),
      errors: ["Stub implementation - no actual sync performed"],
    };
  }

  async syncActivities(startDate: Date, endDate: Date): Promise<SyncResult> {
    if (!this.connected) {
      throw new Error("Workday connector not connected");
    }

    console.log(`[Workday Connector] Stub: Would sync time tracking from ${startDate} to ${endDate}`);
    
    return {
      success: true,
      recordsSynced: 0,
      timestamp: new Date(),
      errors: ["Stub implementation - no actual sync performed"],
    };
  }

  async getEmployee(employeeId: string): Promise<EmployeeData | null> {
    if (!this.connected) {
      throw new Error("Workday connector not connected");
    }

    console.log(`[Workday Connector] Stub: Would fetch employee ${employeeId} from Workday`);
    return null;
  }

  isConnected(): boolean {
    return this.connected;
  }
}
