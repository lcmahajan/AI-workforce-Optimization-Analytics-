export interface EmployeeData {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  skills?: string[];
  startDate?: Date;
  metadata?: Record<string, any>;
}

export interface ActivityData {
  employeeId: string;
  activityType: string;
  date: Date;
  duration: number;
  description?: string;
  projectId?: string;
  metadata?: Record<string, any>;
}

export interface SyncResult {
  success: boolean;
  recordsSynced: number;
  errors?: string[];
  timestamp: Date;
}

export interface ConnectorConfig {
  apiUrl?: string;
  apiKey?: string;
  tenantId?: string;
  enabled: boolean;
  syncInterval?: number;
}

export interface IERPConnector {
  connect(config: ConnectorConfig): Promise<boolean>;
  disconnect(): Promise<void>;
  syncEmployees(): Promise<SyncResult>;
  syncActivities(startDate: Date, endDate: Date): Promise<SyncResult>;
  getEmployee(employeeId: string): Promise<EmployeeData | null>;
  isConnected(): boolean;
}

export interface ICollaborationConnector {
  connect(config: ConnectorConfig): Promise<boolean>;
  disconnect(): Promise<void>;
  sendNotification(userId: string, message: string): Promise<boolean>;
  getActivityMetrics(userId: string, startDate: Date, endDate: Date): Promise<ActivityData[]>;
  isConnected(): boolean;
}
