import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("employee"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  status: text("status").notNull().default("active"),
  userId: varchar("user_id").references(() => users.id),
  fitmentScore: integer("fitment_score"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

export const jobDescriptions = pgTable("job_descriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements"),
  department: text("department").notNull(),
  uploadedBy: varchar("uploaded_by").notNull().references(() => users.id),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertJobDescriptionSchema = createInsertSchema(jobDescriptions).omit({
  id: true,
  createdAt: true,
});

export type InsertJobDescription = z.infer<typeof insertJobDescriptionSchema>;
export type JobDescription = typeof jobDescriptions.$inferSelect;

export const cvs = pgTable("cvs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateName: text("candidate_name").notNull(),
  email: text("email"),
  skills: jsonb("skills"),
  experience: text("experience"),
  education: text("education"),
  uploadedBy: varchar("uploaded_by").notNull().references(() => users.id),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCvSchema = createInsertSchema(cvs).omit({
  id: true,
  createdAt: true,
});

export type InsertCv = z.infer<typeof insertCvSchema>;
export type Cv = typeof cvs.$inferSelect;

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => employees.id),
  taskName: text("task_name").notNull(),
  hoursSpent: integer("hours_spent").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("pending"),
  projectId: text("project_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
}).extend({
  date: z.coerce.date(),
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export const fitmentScores = pgTable("fitment_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobDescriptionId: varchar("job_description_id").notNull().references(() => jobDescriptions.id),
  cvId: varchar("cv_id").notNull().references(() => cvs.id),
  score: integer("score").notNull(),
  matchedSkills: jsonb("matched_skills"),
  gaps: jsonb("gaps"),
  calculatedAt: timestamp("calculated_at").notNull().defaultNow(),
});

export const insertFitmentScoreSchema = createInsertSchema(fitmentScores).omit({
  id: true,
  calculatedAt: true,
});

export type InsertFitmentScore = z.infer<typeof insertFitmentScoreSchema>;
export type FitmentScore = typeof fitmentScores.$inferSelect;
