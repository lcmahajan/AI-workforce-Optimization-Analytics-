import type { IStorage } from "../storage";

export interface GDPRDataExport {
  user: any;
  activities: any[];
  uploads: any[];
  auditLogs: any[];
  exportedAt: Date;
}

export interface AnonymizedUser {
  id: string;
  department: string | null;
  tower: string | null;
  roleTitle: string | null;
  fitmentScore: number | null;
  productivity: number | null;
  utilization: number | null;
  softskills: any;
  createdAt: Date;
}

export class GDPRService {
  constructor(private storage: IStorage) {}

  async exportUserData(userId: string): Promise<GDPRDataExport> {
    const user = await this.storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const activities = await this.storage.getActivitiesByUser(userId);
    const uploads = await this.storage.getAllUploads();
    const userUploads = uploads.filter((u: any) => u.uploader === userId);
    
    const auditLogs = await this.storage.getAuditLogsByUser(userId);

    const sanitizedUser = {
      ...user,
      password: "[REDACTED]",
    };

    return {
      user: sanitizedUser,
      activities,
      uploads: userUploads,
      auditLogs,
      exportedAt: new Date(),
    };
  }

  async deleteUserData(userId: string): Promise<void> {
    const user = await this.storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    console.log(`[GDPR] Starting data deletion for user ${userId}`);

    await this.storage.deleteActivitiesByUser(userId);
    console.log(`[GDPR] Deleted activities for user ${userId}`);

    await this.storage.deleteFitmentExplanationsByUser(userId);
    console.log(`[GDPR] Deleted fitment explanations for user ${userId}`);

    const userCvs = await this.storage.getAllCvs();
    const userCvIds = userCvs.filter((cv: any) => cv.uploadedBy === userId).map((cv: any) => cv.id);
    
    for (const cvId of userCvIds) {
      await this.storage.deleteFitmentScoresByCv(cvId);
    }
    console.log(`[GDPR] Deleted fitment scores for ${userCvIds.length} CVs`);

    await this.storage.deleteCvsByUser(userId);
    console.log(`[GDPR] Deleted CVs uploaded by user ${userId}`);

    const userJobs = await this.storage.getAllJobDescriptions();
    const userJobIds = userJobs.filter((j: any) => j.uploadedBy === userId).map((j: any) => j.id);
    
    for (const jobId of userJobIds) {
      await this.storage.deleteFitmentExplanationsByJob(jobId);
      await this.storage.deleteFitmentScoresByJob(jobId);
    }
    console.log(`[GDPR] Deleted fitment data for ${userJobIds.length} job descriptions`);

    await this.storage.deleteJobDescriptionsByUser(userId);
    console.log(`[GDPR] Deleted job descriptions uploaded by user ${userId}`);

    const uploads = await this.storage.getAllUploads();
    const userUploads = uploads.filter((u: any) => u.uploader === userId);
    for (const upload of userUploads) {
      await this.storage.deleteUpload(upload.id);
    }
    console.log(`[GDPR] Deleted ${userUploads.length} uploads for user ${userId}`);

    await this.storage.deleteSettingsByUser(userId);
    console.log(`[GDPR] Deleted settings updated by user ${userId}`);

    await this.storage.anonymizeAuditLogs(userId);
    console.log(`[GDPR] Anonymized audit logs for user ${userId}`);

    await this.storage.deleteUser(userId);
    console.log(`[GDPR] Deleted user ${userId}`);
  }

  async anonymizeUser(userId: string): Promise<void> {
    const user = await this.storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const anonymizedData = {
      username: `deleted_user_${userId.substring(0, 8)}`,
      email: `deleted_${userId.substring(0, 8)}@anonymized.local`,
      password: "[DELETED]",
    };

    await this.storage.updateUser(userId, anonymizedData);
    console.log(`[GDPR] Anonymized user ${userId}`);
  }

  anonymizeUserForAnalytics(user: any): AnonymizedUser {
    return {
      id: this.hashId(user.id),
      department: user.department,
      tower: user.tower,
      roleTitle: user.roleTitle,
      fitmentScore: user.fitmentScore,
      productivity: user.productivity,
      utilization: user.utilization,
      softskills: user.softskills,
      createdAt: user.createdAt,
    };
  }

  async getAnonymizedAnalytics(): Promise<{
    users: AnonymizedUser[];
    aggregates: {
      totalUsers: number;
      averageProductivity: number;
      averageUtilization: number;
      byDepartment: Record<string, number>;
      byTower: Record<string, number>;
    };
  }> {
    const users = await this.storage.getAllUsers();
    
    const anonymizedUsers = users.map((user) => this.anonymizeUserForAnalytics(user));

    const aggregates = {
      totalUsers: users.length,
      averageProductivity:
        users.reduce((sum, u) => sum + (u.productivity || 0), 0) / users.length,
      averageUtilization:
        users.reduce((sum, u) => sum + (u.utilization || 0), 0) / users.length,
      byDepartment: this.groupBy(users, "department"),
      byTower: this.groupBy(users, "tower"),
    };

    return {
      users: anonymizedUsers,
      aggregates,
    };
  }

  private hashId(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  private groupBy(arr: any[], key: string): Record<string, number> {
    return arr.reduce((acc, item) => {
      const value = item[key] || "Unknown";
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }
}
