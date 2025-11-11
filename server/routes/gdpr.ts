import type { Express, Response } from "express";
import { authMiddleware, requireAdmin, type AuthRequest } from "../auth";
import { GDPRService } from "../services/gdpr";
import type { IStorage } from "../storage";

export function registerGDPRRoutes(app: Express, storage: IStorage) {
  const gdprService = new GDPRService(storage);

  app.get("/api/gdpr/export", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const data = await gdprService.exportUserData(userId);

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="user-data-${userId}.json"`);
      res.json(data);
    } catch (error: any) {
      console.error("[GDPR Export] Error:", error);
      res.status(500).json({ error: "Failed to export user data" });
    }
  });

  app.post("/api/gdpr/delete-my-data", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;

      await gdprService.deleteUserData(userId);

      res.json({ 
        success: true, 
        message: "All your data has been permanently deleted. Your account will be logged out." 
      });
    } catch (error: any) {
      console.error("[GDPR Delete] Error:", error);
      res.status(500).json({ error: "Failed to delete user data" });
    }
  });

  app.post("/api/gdpr/anonymize/:userId", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;

      await gdprService.anonymizeUser(userId);

      res.json({ 
        success: true, 
        message: `User ${userId} has been anonymized` 
      });
    } catch (error: any) {
      console.error("[GDPR Anonymize] Error:", error);
      res.status(500).json({ error: "Failed to anonymize user" });
    }
  });

  app.delete("/api/gdpr/user/:userId", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;

      await gdprService.deleteUserData(userId);

      res.json({ 
        success: true, 
        message: `All data for user ${userId} has been deleted` 
      });
    } catch (error: any) {
      console.error("[GDPR Admin Delete] Error:", error);
      res.status(500).json({ error: "Failed to delete user data" });
    }
  });

  app.get("/api/analytics/anonymized", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const analytics = await gdprService.getAnonymizedAnalytics();

      res.json(analytics);
    } catch (error: any) {
      console.error("[Anonymized Analytics] Error:", error);
      res.status(500).json({ error: "Failed to get anonymized analytics" });
    }
  });

  app.get("/api/audit/logs", authMiddleware, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const logs = await storage.getAllAuditLogs();

      res.json(logs);
    } catch (error: any) {
      console.error("[Audit Logs] Error:", error);
      res.status(500).json({ error: "Failed to get audit logs" });
    }
  });

  app.get("/api/audit/user/:userId", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;

      if (req.user!.id !== userId && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Not authorized to view this user's audit logs" });
      }

      const logs = await storage.getAuditLogsByUser(userId);

      res.json(logs);
    } catch (error: any) {
      console.error("[User Audit Logs] Error:", error);
      res.status(500).json({ error: "Failed to get user audit logs" });
    }
  });

  app.get("/api/fitment/explanation/:employeeId/:jobId", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { employeeId, jobId } = req.params;

      if (req.user!.id !== employeeId && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Not authorized to view this fitment explanation" });
      }

      const explanation = await storage.getFitmentExplanation(employeeId, jobId);

      if (!explanation) {
        return res.status(404).json({ error: "Fitment explanation not found" });
      }

      res.json(explanation);
    } catch (error: any) {
      console.error("[Fitment Explanation] Error:", error);
      res.status(500).json({ error: "Failed to get fitment explanation" });
    }
  });
}
