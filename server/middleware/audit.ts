import type { Request, Response, NextFunction } from "express";
import type { IStorage } from "../storage";
import type { AuthRequest } from "../auth";

export function createAuditMiddleware(storage: IStorage) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    const auditLogBase = {
      method: req.method,
      endpoint: req.path,
      ipAddress: req.ip || req.socket.remoteAddress || "unknown",
      userAgent: req.get("user-agent") || "unknown",
      action: getActionFromMethod(req.method),
      resource: getResourceFromPath(req.path),
      resourceId: req.params.id || null,
    };

    res.on('finish', () => {
      const auditLog = {
        ...auditLogBase,
        userId: req.user?.id || null,
        statusCode: res.statusCode,
        changes: undefined as any,
        metadata: {
          query: req.query,
          duration: Date.now() - startTime,
        },
      };

      if (req.method === "PUT" || req.method === "PATCH" || req.method === "DELETE") {
        auditLog.changes = {
          before: req.body?.before || null,
          after: req.body || null,
        };
      }

      if (shouldAudit(req.path, req.method)) {
        storage.createAuditLog(auditLog).catch((error) => {
          console.error("[Audit Middleware] Failed to log:", error);
        });
      }
    });

    next();
  };
}

function getActionFromMethod(method: string): string {
  const actions: Record<string, string> = {
    GET: "read",
    POST: "create",
    PUT: "update",
    PATCH: "update",
    DELETE: "delete",
  };
  return actions[method] || "unknown";
}

function getResourceFromPath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts.length >= 2 && parts[0] === "api") {
    return parts[1];
  }
  return "unknown";
}

function shouldAudit(path: string, method: string): boolean {
  if (path.includes("/auth")) return true;
  
  if (method === "GET" && !path.includes("/users") && !path.includes("/settings")) {
    return false;
  }

  const sensitiveResources = [
    "/users",
    "/employees",
    "/settings",
    "/uploads",
    "/cvs",
    "/job-descriptions",
    "/fitment",
  ];

  return sensitiveResources.some((resource) => path.includes(resource));
}
