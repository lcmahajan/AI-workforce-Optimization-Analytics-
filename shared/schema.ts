import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("employee"),
  department: text("department"),
  tower: text("tower"),
  roleTitle: text("role_title"),
  fitmentScore: real("fitment_score").default(0.0),
  productivity: real("productivity").default(0),
  utilization: real("utilization").default(0),
  softskills: jsonb("softskills").$type<{
    communication?: number;
    teamwork?: number;
    adaptability?: number;
    problemSolving?: number;
    creativity?: number;
    workEthic?: number;
    interpersonal?: number;
    timeManagement?: number;
    leadership?: number;
    attentionToDetail?: number;
  }>(),
  resumeFileId: text("resume_file_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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

export const uploads = pgTable("uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalName: text("original_name").notNull(),
  storedName: text("stored_name").notNull(),
  type: text("type").notNull(),
  uploader: varchar("uploader").notNull().references(() => users.id),
  parsed: integer("parsed").notNull().default(0),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUploadSchema = createInsertSchema(uploads).omit({
  id: true,
  createdAt: true,
});

export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Upload = typeof uploads.$inferSelect;

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user: varchar("user").notNull().references(() => users.id),
  activityType: text("activity_type").notNull(),
  tower: text("tower"),
  category: text("category"),
  date: timestamp("date").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  source: text("source"),
  taskName: text("task_name"),
  hoursSpent: integer("hours_spent"),
  status: text("status").default("pending"),
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

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  category: text("category").notNull().default("general"),
  description: text("description"),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;
