import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import Papa from "papaparse";
import { storage } from "./storage";
import {
  hashPassword,
  comparePassword,
  generateToken,
  authMiddleware,
  requireAdmin,
  type AuthRequest,
} from "./auth";
import {
  insertUserSchema,
  insertJobDescriptionSchema,
  insertCvSchema,
  insertActivitySchema,
} from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      const token = generateToken(user.id, user.username, user.email, user.role);
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(user.id, user.username, user.email, user.role);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  // User Routes (replacing employee routes - users now contain employee data)
  app.get("/api/users", authMiddleware, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", authMiddleware, async (req, res) => {
    try {
      const data = insertUserSchema.partial().omit({ password: true }).parse(req.body);
      const user = await storage.updateUser(req.params.id, data);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", authMiddleware, requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Legacy /api/employees endpoints (backward compatibility adapters)
  app.get("/api/employees", authMiddleware, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  app.put("/api/employees/:id", authMiddleware, requireAdmin, async (req, res) => {
    try {
      const data = insertUserSchema.partial().omit({ password: true }).parse(req.body);
      const user = await storage.updateUser(req.params.id, data);
      if (!user) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update employee" });
    }
  });

  app.delete("/api/employees/:id", authMiddleware, requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete employee" });
    }
  });

  // Job Description Routes
  app.get("/api/job-descriptions", authMiddleware, async (req, res) => {
    try {
      const jds = await storage.getAllJobDescriptions();
      res.json(jds);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch job descriptions" });
    }
  });

  app.post("/api/job-descriptions", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertJobDescriptionSchema.parse({
        ...req.body,
        uploadedBy: req.user?.id,
      });
      const jd = await storage.createJobDescription(data);
      res.json(jd);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create job description" });
    }
  });

  // CV Routes
  app.get("/api/cvs", authMiddleware, async (req, res) => {
    try {
      const cvs = await storage.getAllCvs();
      res.json(cvs);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch CVs" });
    }
  });

  app.post("/api/cvs", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const data = insertCvSchema.parse({
        ...req.body,
        uploadedBy: req.user?.id,
      });
      const cv = await storage.createCv(data);
      res.json(cv);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create CV" });
    }
  });

  // Activity Routes
  app.get("/api/activities", authMiddleware, async (req, res) => {
    try {
      const { employeeId, startDate, endDate } = req.query;

      if (employeeId) {
        const activities = await storage.getActivitiesByUser(employeeId as string);
        return res.json(activities);
      }

      if (startDate && endDate) {
        const activities = await storage.getActivitiesByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
        return res.json(activities);
      }

      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", authMiddleware, async (req, res) => {
    try {
      const requestData = { ...req.body };
      
      // Backward compatibility: map employeeId to user if present
      if (requestData.employeeId && !requestData.user) {
        requestData.user = requestData.employeeId;
        delete requestData.employeeId;
      }
      
      // Provide defaults for new required fields if not present
      if (!requestData.activityType) {
        requestData.activityType = "task";
      }
      if (!requestData.durationMinutes) {
        requestData.durationMinutes = requestData.hoursSpent ? requestData.hoursSpent * 60 : 0;
      }
      if (!requestData.source) {
        requestData.source = "manual";
      }
      
      const data = insertActivitySchema.parse(requestData);
      const activity = await storage.createActivity(data);
      res.json(activity);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create activity" });
    }
  });

  // File Upload Routes
  app.post("/api/uploads/jd", authMiddleware, requireAdmin, upload.single("file"), async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { title, requirements, department } = req.body;
      const fileContent = req.file.buffer.toString("utf-8");

      const jd = await storage.createJobDescription({
        title: title || req.file.originalname,
        description: fileContent,
        requirements: requirements ? JSON.parse(requirements) : {},
        department: department || "General",
        uploadedBy: req.user!.id,
      });

      res.json({ success: true, jobDescription: jd });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to upload JD" });
    }
  });

  app.post("/api/uploads/cv", authMiddleware, requireAdmin, upload.single("file"), async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { candidateName, email, skills, experience, education } = req.body;
      const fileContent = req.file.buffer.toString("utf-8");

      // Create upload record for file metadata
      const uploadRecord = await storage.createUpload({
        originalName: req.file.originalname,
        storedName: req.file.originalname,
        type: "cv",
        uploader: req.user!.id,
        parsed: 0,
        meta: { fileContent },
      });

      // Create CV record
      const cv = await storage.createCv({
        candidateName: candidateName || "Unknown",
        email: email || "",
        skills: skills ? JSON.parse(skills) : [],
        experience: experience || "",
        education: education || "",
        uploadedBy: req.user!.id,
        fileUrl: uploadRecord.id,
      });

      res.json({ success: true, cv, upload: uploadRecord });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to upload CV" });
    }
  });

  app.post("/api/uploads/activity", authMiddleware, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const csvText = req.file.buffer.toString("utf-8");
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const activities = results.data
              .map((row: any) => {
                try {
                  return insertActivitySchema.parse({
                    user: row.user || row.userId || row.user_id || row.employeeId || row.employee_id,
                    activityType: row.activityType || row.activity_type || row.type || "task",
                    tower: row.tower || null,
                    category: row.category || null,
                    date: row.date,
                    durationMinutes: parseInt(row.durationMinutes || row.duration_minutes || row.duration || row.minutes || "0"),
                    source: row.source || "csv_upload",
                    taskName: row.taskName || row.task_name || row.task || null,
                    hoursSpent: parseInt(row.hoursSpent || row.hours_spent || row.hours || "0") || null,
                    status: row.status || "completed",
                    projectId: row.projectId || row.project_id || null,
                  });
                } catch (err) {
                  return null;
                }
              })
              .filter((activity: any) => activity !== null);

            if (activities.length === 0) {
              return res.status(400).json({ error: "No valid activities found in CSV" });
            }

            const created = await storage.createActivitiesBulk(activities);
            res.json({ success: true, count: created.length, activities: created });
          } catch (error: any) {
            res.status(400).json({ error: "Failed to parse or save activities" });
          }
        },
        error: (error: any) => {
          res.status(400).json({ error: "Failed to parse CSV file" });
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Analytics Routes
  app.get("/api/analytics/overview", authMiddleware, async (req, res) => {
    try {
      const employees = await storage.getAllUsers();
      const activities = await storage.getAllActivities();
      const fitmentScores = await storage.getAllFitmentScores();

      const totalHours = activities.reduce((sum, a) => sum + a.hoursSpent, 0);
      const completedTasks = activities.filter(a => a.status === "completed").length;
      const avgFitment = fitmentScores.length > 0 
        ? Math.round(fitmentScores.reduce((sum, f) => sum + f.score, 0) / fitmentScores.length)
        : 0;

      const utilization = employees.length > 0 
        ? Math.round((totalHours / (employees.length * 160)) * 100)
        : 0;

      res.json({
        productivity: completedTasks > 0 ? Math.round((completedTasks / activities.length) * 100) : 0,
        utilization,
        fitmentScore: avgFitment,
        totalEmployees: employees.length,
        totalTasks: activities.length,
        completedTasks,
        totalHours,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch analytics overview" });
    }
  });

  app.get("/api/analytics/employee/:id", authMiddleware, async (req, res) => {
    try {
      const employee = await storage.getUser(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      const activities = await storage.getActivitiesByUser(req.params.id);
      const totalHours = activities.reduce((sum, a) => sum + a.hoursSpent, 0);
      const completedTasks = activities.filter(a => a.status === "completed").length;

      res.json({
        employee,
        totalTasks: activities.length,
        completedTasks,
        totalHours,
        completionRate: activities.length > 0 ? Math.round((completedTasks / activities.length) * 100) : 0,
        avgHoursPerWeek: Math.round(totalHours / 4),
        recentActivities: activities.slice(0, 10),
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch employee analytics" });
    }
  });

  app.get("/api/analytics/work-distribution", authMiddleware, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();

      const activities = await storage.getActivitiesByDateRange(start, end);

      const distribution = activities.reduce((acc: any, activity) => {
        const month = activity.date.toISOString().substring(0, 7);
        if (!acc[month]) {
          acc[month] = { completed: 0, pending: 0, overdue: 0 };
        }
        acc[month][activity.status] = (acc[month][activity.status] || 0) + 1;
        return acc;
      }, {});

      res.json(distribution);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch work distribution" });
    }
  });

  app.get("/api/analytics/productivity", authMiddleware, async (req, res) => {
    try {
      const activities = await storage.getAllActivities();
      const employees = await storage.getAllUsers();

      const totalHours = activities.reduce((sum, a) => sum + a.hoursSpent, 0);
      const completedTasks = activities.filter(a => a.status === "completed").length;
      const totalTasks = activities.length;

      const avgProductivity = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      res.json({
        totalEmployees: employees.length,
        totalTasks,
        completedTasks,
        totalHours,
        avgProductivity: Math.round(avgProductivity * 10) / 10,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch productivity metrics" });
    }
  });

  // Fitment Routes
  app.get("/api/fitment/:jobId", authMiddleware, async (req, res) => {
    try {
      const scores = await storage.getFitmentScoresByJob(req.params.jobId);
      res.json(scores);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch fitment scores" });
    }
  });

  app.post("/api/fitment/assess", authMiddleware, async (req, res) => {
    try {
      const { jobDescriptionId, cvId } = req.body;

      if (!jobDescriptionId || !cvId) {
        return res.status(400).json({ error: "Job description ID and CV ID required" });
      }

      const jd = await storage.getJobDescription(jobDescriptionId);
      const cv = await storage.getCv(cvId);

      if (!jd || !cv) {
        return res.status(404).json({ error: "Job description or CV not found" });
      }

      const score = Math.floor(Math.random() * 30) + 70;
      const matchedSkills: string[] = [];
      const gaps: string[] = [];

      const fitmentScore = await storage.createFitmentScore({
        jobDescriptionId,
        cvId,
        score,
        matchedSkills,
        gaps,
      });

      res.json(fitmentScore);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to calculate fitment score" });
    }
  });

  // Fatigue Analysis Routes
  app.get("/api/fatigue/analysis", authMiddleware, async (req, res) => {
    try {
      const { weeks = 6 } = req.query;
      const weeksNum = parseInt(weeks as string);
      
      const endDate = new Date();
      const startDate = new Date(Date.now() - weeksNum * 7 * 24 * 60 * 60 * 1000);
      
      const activities = await storage.getActivitiesByDateRange(startDate, endDate);
      const employees = await storage.getAllUsers();

      const employeeWorkload = new Map<string, { totalHours: number; taskCount: number; consecutiveDays: number }>();

      activities.forEach(activity => {
        const current = employeeWorkload.get(activity.employeeId) || { totalHours: 0, taskCount: 0, consecutiveDays: 0 };
        current.totalHours += activity.hoursSpent;
        current.taskCount += 1;
        employeeWorkload.set(activity.employeeId, current);
      });

      const atRiskEmployees = [];
      for (const [employeeId, workload] of employeeWorkload.entries()) {
        const avgHoursPerWeek = workload.totalHours / weeksNum;
        const fatigueScore = Math.min(100, Math.round((avgHoursPerWeek / 40) * 100));
        
        if (fatigueScore > 60) {
          const employee = employees.find(e => e.id === employeeId);
          if (employee) {
            const employeeActivities = activities.filter(a => a.employeeId === employeeId).sort((a, b) => a.date.getTime() - b.date.getTime());
            
            let consecutiveDays = 0;
            let currentStreak = 0;
            let lastDate: Date | null = null;
            
            for (const activity of employeeActivities) {
              if (lastDate) {
                const daysDiff = Math.floor((activity.date.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));
                if (daysDiff === 1) {
                  currentStreak++;
                  consecutiveDays = Math.max(consecutiveDays, currentStreak);
                } else if (daysDiff > 1) {
                  currentStreak = 1;
                }
              } else {
                currentStreak = 1;
              }
              lastDate = activity.date;
            }
            
            atRiskEmployees.push({
              employeeId,
              name: employee.name,
              position: employee.position,
              fatigueScore,
              avgHours: Math.round(avgHoursPerWeek),
              consecutiveDays: consecutiveDays > 0 ? consecutiveDays : 1,
              status: fatigueScore > 80 ? "high-risk" : "medium-risk",
            });
          }
        }
      }

      const totalHours = Array.from(employeeWorkload.values()).reduce((sum, w) => sum + w.totalHours, 0);
      const avgFatigueScore = atRiskEmployees.length > 0
        ? Math.round(atRiskEmployees.reduce((sum, e) => sum + e.fatigueScore, 0) / atRiskEmployees.length)
        : 35;

      res.json({
        atRiskCount: atRiskEmployees.length,
        avgFatigueScore,
        avgWeeklyHours: employees.length > 0 ? Math.round(totalHours / (employees.length * weeksNum)) : 0,
        atRiskEmployees: atRiskEmployees.sort((a, b) => b.fatigueScore - a.fatigueScore),
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch fatigue analysis" });
    }
  });

  // Optimization Recommendations Routes
  app.get("/api/optimization/recommendations", authMiddleware, async (req, res) => {
    try {
      const employees = await storage.getAllUsers();
      const activities = await storage.getAllActivities();

      const recommendations = [];

      const employeeWorkload = new Map<string, number>();
      activities.forEach(activity => {
        const current = employeeWorkload.get(activity.employeeId) || 0;
        employeeWorkload.set(activity.employeeId, current + activity.hoursSpent);
      });

      const avgWorkload = Array.from(employeeWorkload.values()).reduce((sum, w) => sum + w, 0) / employeeWorkload.size;
      
      const overloaded = Array.from(employeeWorkload.entries()).filter(([_, hours]) => hours > avgWorkload * 1.3);
      const underutilized = Array.from(employeeWorkload.entries()).filter(([_, hours]) => hours < avgWorkload * 0.7);

      if (overloaded.length > 0 && underutilized.length > 0) {
        recommendations.push({
          id: "redistribute-tasks",
          title: "Redistribute Task Load",
          description: `${overloaded.length} employees are overloaded while ${underutilized.length} are underutilized. Consider redistributing tasks.`,
          impact: "High",
          savings: `${Math.round(overloaded.length * 3)} hours/week`,
          status: "pending",
          type: "workload",
        });
      }

      const departmentCounts = employees.reduce((acc: any, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
      }, {});

      if (Object.keys(departmentCounts).length > 1) {
        const departments = Object.entries(departmentCounts);
        const avgDeptSize = departments.reduce((sum, [_, count]: any) => sum + count, 0) / departments.length;
        const imbalanced = departments.filter(([_, count]: any) => Math.abs(count - avgDeptSize) > avgDeptSize * 0.5);

        if (imbalanced.length > 0) {
          recommendations.push({
            id: "team-rebalancing",
            title: "Team Rebalancing Needed",
            description: `Department sizes vary significantly. Consider rebalancing to improve efficiency.`,
            impact: "Medium",
            savings: "Improved collaboration",
            status: "pending",
            type: "structure",
          });
        }
      }

      const tasksByStatus = activities.reduce((acc: any, activity) => {
        acc[activity.status] = (acc[activity.status] || 0) + 1;
        return acc;
      }, {});

      const completionRate = tasksByStatus.completed / activities.length;
      if (completionRate < 0.8) {
        recommendations.push({
          id: "improve-completion",
          title: "Improve Task Completion Rate",
          description: `Current completion rate is ${Math.round(completionRate * 100)}%. Identify blockers and streamline processes.`,
          impact: "High",
          savings: "20% faster delivery",
          status: "pending",
          type: "productivity",
        });
      }

      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  // Settings Routes
  app.put("/api/settings/password", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new password required" });
      }

      const user = await storage.getUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isValid = await comparePassword(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(user.id, hashedPassword);

      res.json({ success: true, message: "Password updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update password" });
    }
  });

  // Documentation Route
  app.get("/api/docs", authMiddleware, async (req, res) => {
    try {
      const docs = {
        title: "WorkForce AI Platform Documentation",
        version: "1.0.0",
        sections: [
          {
            title: "Getting Started",
            content: "Welcome to the WorkForce AI Platform. This system helps optimize workforce allocation and track productivity metrics.",
          },
          {
            title: "Employee Management",
            content: "Manage employee profiles, track performance, and analyze fitment scores.",
          },
          {
            title: "Analytics",
            content: "View comprehensive analytics including work distribution, productivity metrics, and fatigue analysis.",
          },
          {
            title: "Optimization",
            content: "Get AI-powered recommendations for workforce optimization and task redistribution.",
          },
        ],
      };
      res.json(docs);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch documentation" });
    }
  });

  // Reports Export Route
  app.get("/api/reports/export", authMiddleware, async (req, res) => {
    try {
      const { type = "csv", startDate, endDate } = req.query;

      const employees = await storage.getAllUsers();
      const activities = await storage.getAllActivities();

      if (type === "csv") {
        const csvData = [
          ["Employee Name", "Position", "Department", "Total Tasks", "Completed Tasks", "Total Hours"],
          ...employees.map(emp => {
            const empActivities = activities.filter(a => a.employeeId === emp.id);
            const completed = empActivities.filter(a => a.status === "completed").length;
            const totalHours = empActivities.reduce((sum, a) => sum + a.hoursSpent, 0);
            
            return [
              emp.name,
              emp.position,
              emp.department,
              empActivities.length.toString(),
              completed.toString(),
              totalHours.toString(),
            ];
          }),
        ];

        const csv = csvData.map(row => row.join(",")).join("\n");
        
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=workforce-report.csv");
        res.send(csv);
      } else {
        res.json({
          employees,
          activities,
          summary: {
            totalEmployees: employees.length,
            totalActivities: activities.length,
            completedActivities: activities.filter(a => a.status === "completed").length,
          },
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to export report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
