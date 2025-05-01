import { db } from "@db";
import { users, resumes, resumeTemplates, apiKeys } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "@db";
import { InsertUser, User, InsertResume, Resume, InsertResumeTemplate, ResumeTemplate, InsertApiKey, ApiKey } from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>;

  // Resume operations
  createResume(resume: InsertResume & { content: any }): Promise<Resume>;
  getResume(id: number): Promise<Resume | undefined>;
  getResumesByUser(userId: number): Promise<Resume[]>;
  getAllResumes(): Promise<Resume[]>;
  updateResume(id: number, resume: Partial<InsertResume & { content: any }>): Promise<Resume | undefined>;
  deleteResume(id: number): Promise<void>;

  // Template operations
  createTemplate(template: InsertResumeTemplate): Promise<ResumeTemplate>;
  getTemplate(id: number): Promise<ResumeTemplate | undefined>;
  getAllTemplates(): Promise<ResumeTemplate[]>;
  updateTemplate(id: number, template: Partial<InsertResumeTemplate>): Promise<ResumeTemplate | undefined>;
  deleteTemplate(id: number): Promise<void>;

  // API Key operations
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  getApiKey(id: number): Promise<ApiKey | undefined>;
  getActiveApiKey(provider: string): Promise<ApiKey | undefined>;
  getAllApiKeys(): Promise<ApiKey[]>;
  updateApiKey(id: number, apiKey: Partial<InsertApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: number): Promise<void>;

  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User operations
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUser(id: number): Promise<User | undefined> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
    });
    return allUsers;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Resume operations
  async createResume(resume: InsertResume & { content: any }): Promise<Resume> {
    const [newResume] = await db.insert(resumes).values(resume).returning();
    return newResume;
  }

  async getResume(id: number): Promise<Resume | undefined> {
    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.id, id),
      with: {
        user: true,
        template: true,
      },
    });
    return resume;
  }

  async getResumesByUser(userId: number): Promise<Resume[]> {
    const userResumes = await db.query.resumes.findMany({
      where: eq(resumes.userId, userId),
      with: {
        template: true,
      },
      orderBy: [desc(resumes.updatedAt)],
    });
    return userResumes;
  }

  async getAllResumes(): Promise<Resume[]> {
    const allResumes = await db.query.resumes.findMany({
      with: {
        user: true,
        template: true,
      },
      orderBy: [desc(resumes.updatedAt)],
    });
    return allResumes;
  }

  async updateResume(id: number, resume: Partial<InsertResume & { content: any }>): Promise<Resume | undefined> {
    const [updatedResume] = await db
      .update(resumes)
      .set({ ...resume, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return updatedResume;
  }

  async deleteResume(id: number): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }

  // Template operations
  async createTemplate(template: InsertResumeTemplate): Promise<ResumeTemplate> {
    const [newTemplate] = await db.insert(resumeTemplates).values(template).returning();
    return newTemplate;
  }

  async getTemplate(id: number): Promise<ResumeTemplate | undefined> {
    const template = await db.query.resumeTemplates.findFirst({
      where: eq(resumeTemplates.id, id),
    });
    return template;
  }

  async getAllTemplates(): Promise<ResumeTemplate[]> {
    const allTemplates = await db.query.resumeTemplates.findMany();
    return allTemplates;
  }

  async updateTemplate(id: number, template: Partial<InsertResumeTemplate>): Promise<ResumeTemplate | undefined> {
    const [updatedTemplate] = await db
      .update(resumeTemplates)
      .set(template)
      .where(eq(resumeTemplates.id, id))
      .returning();
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<void> {
    await db.delete(resumeTemplates).where(eq(resumeTemplates.id, id));
  }

  // API Key operations
  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const [newApiKey] = await db.insert(apiKeys).values(apiKey).returning();
    return newApiKey;
  }

  async getApiKey(id: number): Promise<ApiKey | undefined> {
    const apiKey = await db.query.apiKeys.findFirst({
      where: eq(apiKeys.id, id),
    });
    return apiKey;
  }

  async getActiveApiKey(provider: string): Promise<ApiKey | undefined> {
    const key = await db.query.apiKeys.findFirst({
      where: and(
        eq(apiKeys.provider, provider),
        eq(apiKeys.isActive, true)
      ),
    });
    return key;
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    const allApiKeys = await db.query.apiKeys.findMany({
      orderBy: [desc(apiKeys.updatedAt)],
    });
    return allApiKeys;
  }

  async updateApiKey(id: number, apiKey: Partial<InsertApiKey>): Promise<ApiKey | undefined> {
    const [updatedApiKey] = await db
      .update(apiKeys)
      .set({ ...apiKey, updatedAt: new Date() })
      .where(eq(apiKeys.id, id))
      .returning();
    return updatedApiKey;
  }

  async deleteApiKey(id: number): Promise<void> {
    await db.delete(apiKeys).where(eq(apiKeys.id, id));
  }
}

export const storage = new DatabaseStorage();
