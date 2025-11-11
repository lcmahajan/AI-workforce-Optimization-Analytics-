import { SAPConnector } from "./erp/sap";
import { WorkdayConnector } from "./erp/workday";
import { OracleHCMConnector } from "./erp/oracle";
import { SlackConnector } from "./collaboration/slack";
import { MicrosoftTeamsConnector } from "./collaboration/teams";
import type { ConnectorConfig } from "./types";

export class ConnectorManager {
  private connectors: Map<string, any> = new Map();

  constructor() {
    this.connectors.set("sap", new SAPConnector());
    this.connectors.set("workday", new WorkdayConnector());
    this.connectors.set("oracle", new OracleHCMConnector());
    this.connectors.set("slack", new SlackConnector());
    this.connectors.set("teams", new MicrosoftTeamsConnector());
  }

  async initializeConnector(name: string, config: ConnectorConfig): Promise<boolean> {
    const connector = this.connectors.get(name);
    if (!connector) {
      throw new Error(`Unknown connector: ${name}`);
    }

    return await connector.connect(config);
  }

  getConnector(name: string): any {
    return this.connectors.get(name);
  }

  async disconnectAll(): Promise<void> {
    for (const [name, connector] of this.connectors.entries()) {
      if (connector.isConnected && connector.isConnected()) {
        console.log(`Disconnecting ${name}...`);
        await connector.disconnect();
      }
    }
  }

  listConnectors(): string[] {
    return Array.from(this.connectors.keys());
  }
}

export const connectorManager = new ConnectorManager();

export * from "./types";
export { SAPConnector } from "./erp/sap";
export { WorkdayConnector } from "./erp/workday";
export { OracleHCMConnector } from "./erp/oracle";
export { SlackConnector } from "./collaboration/slack";
export { MicrosoftTeamsConnector } from "./collaboration/teams";
