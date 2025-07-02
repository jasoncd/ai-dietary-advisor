import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Schema for dietary advice requests
export const dietaryAdviceRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  age: z.union([z.string(), z.number()]).transform(val => String(val)).pipe(z.string().regex(/^\d+$/, "Age must be a number").transform(val => parseInt(val)).refine(val => val >= 1 && val <= 120, "Age must be between 1 and 120")),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select your gender" }),
  bodyWeight: z.string().min(1, "Body weight is required").max(50, "Body weight description too long"),
  dietaryHabit: z.string().min(1, "Dietary habits are required").max(200, "Dietary habits description too long"),
  healthProblem: z.string().max(500, "Health problems description too long").optional().default(""),
  medication: z.string().max(200, "Medication information too long").optional().default(""),
  dailyActivities: z.string().min(1, "Daily activities are required").max(200, "Daily activities description too long"),
  healthGoal: z.string().min(1, "Health goals are required").max(500, "Health goals description too long"),
});

export type DietaryAdviceRequest = z.infer<typeof dietaryAdviceRequestSchema>;

export const dietaryAdviceResponseSchema = z.object({
  advice: z.string(),
  processingTime: z.number(),
});

export type DietaryAdviceResponse = z.infer<typeof dietaryAdviceResponseSchema>;

// Health Profiles table
export const healthProfiles = pgTable("health_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  bodyWeight: text("body_weight").notNull(),
  dietaryHabit: text("dietary_habit").notNull(),
  healthProblem: text("health_problem"),
  medication: text("medication"),
  dailyActivities: text("daily_activities").notNull(),
  healthGoal: text("health_goal").notNull(),
  aiAdvice: text("ai_advice").notNull(),
  shareText: text("share_text").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

export const insertHealthProfileSchema = createInsertSchema(healthProfiles).omit({
  id: true,
  createdAt: true,
});

export type InsertHealthProfile = z.infer<typeof insertHealthProfileSchema>;
export type HealthProfile = typeof healthProfiles.$inferSelect;

// Comments table for social media functionality
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  healthProfileId: integer("health_profile_id").notNull().references(() => healthProfiles.id),
  parentCommentId: integer("parent_comment_id"),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
