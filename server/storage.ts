import { db } from "./db";
import {
  users,
  jobDescriptions,
  cvs,
  activities,
  fitmentScores,
  uploads,
  settings,
  auditLogs,
  fitmentExplanations,
  type User,
  type InsertUser,
  type JobDescription,
  type InsertJobDescription,
  type Cv,
  type InsertCv,
  type Activity,
  type InsertActivity,
  type FitmentScore,
  type InsertFitmentScore,
  type Upload,
  type InsertUpload,
  type Setting,
  type InsertSetting,
  type AuditLog,
  type InsertAuditLog,
  type FitmentExplanation,
  type InsertFitmentExplanation,
} from "@shared/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByDepartment(department: string): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;
  deleteUser(id: string): Promise<boolean>;
  
  // Job Descriptions
  getAllJobDescriptions(): Promise<JobDescription[]>;
  getJobDescription(id: string): Promise<JobDescription | undefined>;
  createJobDescription(jd: InsertJobDescription): Promise<JobDescription>;
  
  // CVs
  getAllCvs(): Promise<Cv[]>;
  getCv(id: string): Promise<Cv | undefined>;
  createCv(cv: InsertCv): Promise<Cv>;
  
  // Activities
  getAllActivities(): Promise<Activity[]>;
  getActivitiesByUser(userId: string): Promise<Activity[]>;
  getActivitiesByDateRange(startDate: Date, endDate: Date): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  createActivitiesBulk(activities: InsertActivity[]): Promise<Activity[]>;
  
  // Fitment Scores
  getAllFitmentScores(): Promise<FitmentScore[]>;
  getFitmentScoresByJob(jobDescriptionId: string): Promise<FitmentScore[]>;
  getFitmentScore(jobDescriptionId: string, cvId: string): Promise<FitmentScore | undefined>;
  createFitmentScore(score: InsertFitmentScore): Promise<FitmentScore>;

  // Uploads
  getAllUploads(): Promise<Upload[]>;
  getUpload(id: string): Promise<Upload | undefined>;
  getUploadsByType(type: string): Promise<Upload[]>;
  getUploadsByUser(uploaderId: string): Promise<Upload[]>;
  createUpload(upload: InsertUpload): Promise<Upload>;
  updateUpload(id: string, data: Partial<InsertUpload>): Promise<Upload | undefined>;

  // Settings
  getAllSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  getSettingsByCategory(category: string): Promise<Setting[]>;
  upsertSetting(key: string, value: any, category: string, description?: string, updatedBy?: string): Promise<Setting>;
  deleteSetting(key: string): Promise<boolean>;

  // Audit Logs
  getAllAuditLogs(): Promise<AuditLog[]>;
  getAuditLogsByUser(userId: string): Promise<AuditLog[]>;
  getAuditLogsByResource(resource: string, resourceId?: string): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  anonymizeAuditLogs(userId: string): Promise<void>;

  // Fitment Explanations
  getFitmentExplanation(employeeId: string, jobDescriptionId: string): Promise<FitmentExplanation | undefined>;
  getFitmentExplanationsByEmployee(employeeId: string): Promise<FitmentExplanation[]>;
  getFitmentExplanationsByJob(jobDescriptionId: string): Promise<FitmentExplanation[]>;
  createFitmentExplanation(explanation: InsertFitmentExplanation): Promise<FitmentExplanation>;

  // GDPR Operations
  deleteActivitiesByUser(userId: string): Promise<void>;
  deleteFitmentExplanationsByUser(userId: string): Promise<void>;
  deleteFitmentExplanationsByJob(jobDescriptionId: string): Promise<void>;
  deleteFitmentScoresByJob(jobDescriptionId: string): Promise<void>;
  deleteFitmentScoresByCv(cvId: string): Promise<void>;
  deleteCvsByUser(userId: string): Promise<void>;
  deleteJobDescriptionsByUser(userId: string): Promise<void>;
  deleteSettingsByUser(userId: string): Promise<void>;
  deleteUpload(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<void> {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUsersByDepartment(department: string): Promise<User[]> {
    return db.select().from(users).where(eq(users.department, department)).orderBy(desc(users.createdAt));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return db.select().from(users).where(eq(users.role, role)).orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // Job Descriptions
  async getAllJobDescriptions(): Promise<JobDescription[]> {
    return db.select().from(jobDescriptions).orderBy(desc(jobDescriptions.createdAt));
  }

  async getJobDescription(id: string): Promise<JobDescription | undefined> {
    const result = await db.select().from(jobDescriptions).where(eq(jobDescriptions.id, id)).limit(1);
    return result[0];
  }

  async createJobDescription(jd: InsertJobDescription): Promise<JobDescription> {
    const result = await db.insert(jobDescriptions).values(jd).returning();
    return result[0];
  }

  // CVs
  async getAllCvs(): Promise<Cv[]> {
    return db.select().from(cvs).orderBy(desc(cvs.createdAt));
  }

  async getCv(id: string): Promise<Cv | undefined> {
    const result = await db.select().from(cvs).where(eq(cvs.id, id)).limit(1);
    return result[0];
  }

  async createCv(cv: InsertCv): Promise<Cv> {
    const result = await db.insert(cvs).values(cv).returning();
    return result[0];
  }

  // Activities
  async getAllActivities(): Promise<Activity[]> {
    return db.select().from(activities).orderBy(desc(activities.date));
  }

  async getActivitiesByUser(userId: string): Promise<Activity[]> {
    return db.select().from(activities).where(eq(activities.user, userId)).orderBy(desc(activities.date));
  }

  async getActivitiesByDateRange(startDate: Date, endDate: Date): Promise<Activity[]> {
    return db
      .select()
      .from(activities)
      .where(and(gte(activities.date, startDate), lte(activities.date, endDate)))
      .orderBy(desc(activities.date));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(activity).returning();
    return result[0];
  }

  async createActivitiesBulk(activitiesList: InsertActivity[]): Promise<Activity[]> {
    const result = await db.insert(activities).values(activitiesList).returning();
    return result;
  }

  // Fitment Scores
  async getAllFitmentScores(): Promise<FitmentScore[]> {
    return db.select().from(fitmentScores).orderBy(desc(fitmentScores.score));
  }

  async getFitmentScoresByJob(jobDescriptionId: string): Promise<FitmentScore[]> {
    return db
      .select()
      .from(fitmentScores)
      .where(eq(fitmentScores.jobDescriptionId, jobDescriptionId))
      .orderBy(desc(fitmentScores.score));
  }

  async getFitmentScore(jobDescriptionId: string, cvId: string): Promise<FitmentScore | undefined> {
    const result = await db
      .select()
      .from(fitmentScores)
      .where(
        and(
          eq(fitmentScores.jobDescriptionId, jobDescriptionId),
          eq(fitmentScores.cvId, cvId)
        )
      )
      .limit(1);
    return result[0];
  }

  async createFitmentScore(score: InsertFitmentScore): Promise<FitmentScore> {
    const result = await db.insert(fitmentScores).values(score).returning();
    return result[0];
  }

  // Uploads
  async getAllUploads(): Promise<Upload[]> {
    return db.select().from(uploads).orderBy(desc(uploads.createdAt));
  }

  async getUpload(id: string): Promise<Upload | undefined> {
    const result = await db.select().from(uploads).where(eq(uploads.id, id)).limit(1);
    return result[0];
  }

  async getUploadsByType(type: string): Promise<Upload[]> {
    return db.select().from(uploads).where(eq(uploads.type, type)).orderBy(desc(uploads.createdAt));
  }

  async getUploadsByUser(uploaderId: string): Promise<Upload[]> {
    return db.select().from(uploads).where(eq(uploads.uploader, uploaderId)).orderBy(desc(uploads.createdAt));
  }

  async createUpload(upload: InsertUpload): Promise<Upload> {
    const result = await db.insert(uploads).values(upload).returning();
    return result[0];
  }

  async updateUpload(id: string, data: Partial<InsertUpload>): Promise<Upload | undefined> {
    const result = await db.update(uploads).set(data).where(eq(uploads.id, id)).returning();
    return result[0];
  }

  // Settings
  async getAllSettings(): Promise<Setting[]> {
    return db.select().from(settings).orderBy(settings.category, settings.key);
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    return result[0];
  }

  async getSettingsByCategory(category: string): Promise<Setting[]> {
    return db.select().from(settings).where(eq(settings.category, category)).orderBy(settings.key);
  }

  async upsertSetting(key: string, value: any, category: string = "general", description?: string, updatedBy?: string): Promise<Setting> {
    const existing = await this.getSetting(key);
    
    if (existing) {
      const result = await db
        .update(settings)
        .set({ value, category, description, updatedBy, updatedAt: new Date() })
        .where(eq(settings.key, key))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(settings).values({ key, value, category, description, updatedBy }).returning();
      return result[0];
    }
  }

  async deleteSetting(key: string): Promise<boolean> {
    const result = await db.delete(settings).where(eq(settings.key, key)).returning();
    return result.length > 0;
  }

  // Audit Logs
  async getAllAuditLogs(): Promise<AuditLog[]> {
    return db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(1000);
  }

  async getAuditLogsByUser(userId: string): Promise<AuditLog[]> {
    return db.select().from(auditLogs).where(eq(auditLogs.userId, userId)).orderBy(desc(auditLogs.timestamp));
  }

  async getAuditLogsByResource(resource: string, resourceId?: string): Promise<AuditLog[]> {
    if (resourceId) {
      return db.select().from(auditLogs).where(
        and(eq(auditLogs.resource, resource), eq(auditLogs.resourceId, resourceId))
      ).orderBy(desc(auditLogs.timestamp));
    }
    return db.select().from(auditLogs).where(eq(auditLogs.resource, resource)).orderBy(desc(auditLogs.timestamp));
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const result = await db.insert(auditLogs).values(log).returning();
    return result[0];
  }

  async anonymizeAuditLogs(userId: string): Promise<void> {
    await db.update(auditLogs).set({ 
      userId: null,
      ipAddress: "[ANONYMIZED]",
      userAgent: "[ANONYMIZED]"
    }).where(eq(auditLogs.userId, userId));
  }

  // Fitment Explanations
  async getFitmentExplanation(employeeId: string, jobDescriptionId: string): Promise<FitmentExplanation | undefined> {
    const result = await db.select().from(fitmentExplanations).where(
      and(
        eq(fitmentExplanations.employeeId, employeeId),
        eq(fitmentExplanations.jobDescriptionId, jobDescriptionId)
      )
    ).orderBy(desc(fitmentExplanations.calculatedAt)).limit(1);
    return result[0];
  }

  async getFitmentExplanationsByEmployee(employeeId: string): Promise<FitmentExplanation[]> {
    return db.select().from(fitmentExplanations)
      .where(eq(fitmentExplanations.employeeId, employeeId))
      .orderBy(desc(fitmentExplanations.calculatedAt));
  }

  async getFitmentExplanationsByJob(jobDescriptionId: string): Promise<FitmentExplanation[]> {
    return db.select().from(fitmentExplanations)
      .where(eq(fitmentExplanations.jobDescriptionId, jobDescriptionId))
      .orderBy(desc(fitmentExplanations.calculatedAt));
  }

  async createFitmentExplanation(explanation: InsertFitmentExplanation): Promise<FitmentExplanation> {
    const result = await db.insert(fitmentExplanations).values(explanation).returning();
    return result[0];
  }

  // GDPR Operations
  async deleteActivitiesByUser(userId: string): Promise<void> {
    await db.delete(activities).where(eq(activities.user, userId));
  }

  async deleteFitmentExplanationsByUser(userId: string): Promise<void> {
    await db.delete(fitmentExplanations).where(eq(fitmentExplanations.employeeId, userId));
  }

  async deleteFitmentExplanationsByJob(jobDescriptionId: string): Promise<void> {
    await db.delete(fitmentExplanations).where(eq(fitmentExplanations.jobDescriptionId, jobDescriptionId));
  }

  async deleteFitmentScoresByJob(jobDescriptionId: string): Promise<void> {
    await db.delete(fitmentScores).where(eq(fitmentScores.jobDescriptionId, jobDescriptionId));
  }

  async deleteFitmentScoresByCv(cvId: string): Promise<void> {
    await db.delete(fitmentScores).where(eq(fitmentScores.cvId, cvId));
  }

  async deleteCvsByUser(userId: string): Promise<void> {
    await db.delete(cvs).where(eq(cvs.uploadedBy, userId));
  }

  async deleteJobDescriptionsByUser(userId: string): Promise<void> {
    await db.delete(jobDescriptions).where(eq(jobDescriptions.uploadedBy, userId));
  }

  async deleteSettingsByUser(userId: string): Promise<void> {
    await db.delete(settings).where(eq(settings.updatedBy, userId));
  }

  async deleteUpload(id: string): Promise<boolean> {
    const result = await db.delete(uploads).where(eq(uploads.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();
