import { users, healthProfiles, comments, type User, type InsertUser, type HealthProfile, type InsertHealthProfile, type Comment, type InsertComment } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Health Profile methods
  saveHealthProfile(profile: InsertHealthProfile): Promise<HealthProfile>;
  searchHealthProfiles(query: string): Promise<HealthProfile[]>;
  getAllHealthProfiles(): Promise<HealthProfile[]>;
  getHealthProfile(id: number): Promise<HealthProfile | undefined>;

  // Comment methods
  addComment(comment: InsertComment): Promise<Comment>;
  getCommentsByHealthProfile(healthProfileId: number): Promise<Comment[]>;
  getCommentReplies(parentCommentId: number): Promise<Comment[]>;

  // Comment methods
  addComment(comment: InsertComment): Promise<Comment>;
  getCommentsByHealthProfile(healthProfileId: number): Promise<Comment[]>;
  getCommentReplies(parentCommentId: number): Promise<Comment[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async saveHealthProfile(profile: InsertHealthProfile): Promise<HealthProfile> {
    const now = new Date().toISOString();
    const [savedProfile] = await db
      .insert(healthProfiles)
      .values({
        ...profile,
        createdAt: now
      })
      .returning();
    return savedProfile;
  }

  async searchHealthProfiles(query: string): Promise<HealthProfile[]> {
    const searchTerm = `%${query}%`;
    return await db
      .select()
      .from(healthProfiles)
      .where(
        or(
          ilike(healthProfiles.name, searchTerm),
          ilike(healthProfiles.dietaryHabit, searchTerm),
          ilike(healthProfiles.healthProblem, searchTerm),
          ilike(healthProfiles.medication, searchTerm),
          ilike(healthProfiles.dailyActivities, searchTerm),
          ilike(healthProfiles.healthGoal, searchTerm),
          ilike(healthProfiles.aiAdvice, searchTerm),
          ilike(healthProfiles.shareText, searchTerm)
        )
      )
      .orderBy(healthProfiles.createdAt);
  }

  async getAllHealthProfiles(): Promise<HealthProfile[]> {
    return await db
      .select()
      .from(healthProfiles)
      .orderBy(healthProfiles.createdAt);
  }

  async getHealthProfile(id: number): Promise<HealthProfile | undefined> {
    const [profile] = await db
      .select()
      .from(healthProfiles)
      .where(eq(healthProfiles.id, id));
    return profile || undefined;
  }

  async addComment(comment: InsertComment): Promise<Comment> {
    const [savedComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    return savedComment;
  }

  async getCommentsByHealthProfile(healthProfileId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(
        eq(comments.healthProfileId, healthProfileId)
      )
      .orderBy(desc(comments.createdAt));
  }

  async getCommentReplies(parentCommentId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.parentCommentId, parentCommentId))
      .orderBy(desc(comments.createdAt));
  }
}

export const storage = new DatabaseStorage();
