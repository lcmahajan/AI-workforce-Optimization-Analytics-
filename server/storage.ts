import { db } from "./db";
import {
  users,
  employees,
  jobDescriptions,
  cvs,
  activities,
  fitmentScores,
  type User,
  type InsertUser,
  type Employee,
  type InsertEmployee,
  type JobDescription,
  type InsertJobDescription,
  type Cv,
  type InsertCv,
  type Activity,
  type InsertActivity,
  type FitmentScore,
  type InsertFitmentScore,
} from "@shared/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;
  
  // Employees
  getAllEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployeesByDepartment(department: string): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, data: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
  
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
  getActivitiesByEmployee(employeeId: string): Promise<Activity[]>;
  getActivitiesByDateRange(startDate: Date, endDate: Date): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  createActivitiesBulk(activities: InsertActivity[]): Promise<Activity[]>;
  
  // Fitment Scores
  getAllFitmentScores(): Promise<FitmentScore[]>;
  getFitmentScoresByJob(jobDescriptionId: string): Promise<FitmentScore[]>;
  getFitmentScore(jobDescriptionId: string, cvId: string): Promise<FitmentScore | undefined>;
  createFitmentScore(score: InsertFitmentScore): Promise<FitmentScore>;
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

  // Employees
  async getAllEmployees(): Promise<Employee[]> {
    return db.select().from(employees).orderBy(desc(employees.createdAt));
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
    return result[0];
  }

  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    return db.select().from(employees).where(eq(employees.department, department));
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const result = await db.insert(employees).values(employee).returning();
    return result[0];
  }

  async updateEmployee(id: string, data: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const result = await db
      .update(employees)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return result[0];
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id)).returning();
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

  async getActivitiesByEmployee(employeeId: string): Promise<Activity[]> {
    return db.select().from(activities).where(eq(activities.employeeId, employeeId)).orderBy(desc(activities.date));
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
}

export const storage = new DbStorage();
