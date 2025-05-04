import mysql from "mysql2/promise";
import * as session from "express-session";
import connectMysql from "express-mysql-session";
import { InsertUser, User, InsertResume, Resume, InsertResumeTemplate, ResumeTemplate, InsertApiKey, ApiKey } from "@shared/schema";
import { JsonValue } from "type-fest"; // Install type-fest if not already installed
type Json = JsonValue;

// MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Default XAMPP MySQL user
  password: "", // No password by default
  database: "ai-resume",
  port: 3306,
});

const MySQLSessionStore = connectMysql(session);

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
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MySQLSessionStore({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "ai-resume",
      port: parseInt(process.env.DB_PORT || "3306", 10),
    }) as session.Store;
  }
  async updateResume(id: number, resume: Partial<InsertResume & { content: any }>): Promise<Resume | undefined> {
    const [result] = await pool.query("UPDATE resumes SET ? WHERE id = ?", [resume, id]);
    if ((result as any).affectedRows === 0) {
      return undefined; // No rows updated
    }
    return this.getResume(id); // Return the updated resume
  }

  async updateTemplate(id: number, template: Partial<InsertResumeTemplate>): Promise<ResumeTemplate | undefined> {
    const [result] = await pool.query("UPDATE resumeTemplates SET ? WHERE id = ?", [template, id]);
    if ((result as any).affectedRows === 0) {
      return undefined; // No rows updated
    }
    return this.getTemplate(id); // Return the updated template
  }
  updateApiKey(id: number, apiKey: Partial<InsertApiKey>): Promise<ApiKey | undefined> {
    throw new Error("Method not implemented.");
  }

  async createUser(user: InsertUser): Promise<User> {
    const [result] = await pool.query("INSERT INTO users SET ?", user);
    const insertedId = (result as any).insertId;
    return { ...user, id: insertedId };
  }

  async getUser(id: number): Promise<User | undefined> {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return (rows as User[])[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    return (rows as User[])[0];
  }

  async getAllUsers(): Promise<User[]> {
    const [rows] = await pool.query("SELECT * FROM users ORDER BY createdAt DESC");
    return rows as User[];
  }

  async deleteUser(id: number): Promise<void> {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
  }

  async createResume(resume: InsertResume & { content: any }): Promise<Resume> {
    const [result] = await pool.query("INSERT INTO resumes SET ?", resume);
    const insertedId = (result as any).insertId;
    return { ...resume, id: insertedId };
  }

  async getResume(id: number): Promise<Resume | undefined> {
    const [rows] = await pool.query("SELECT * FROM resumes WHERE id = ?", [id]);
    return (rows as Resume[])[0];
  }

  async getResumesByUser(userId: number): Promise<Resume[]> {
    const [rows] = await pool.query("SELECT * FROM resumes WHERE userId = ? ORDER BY updatedAt DESC", [userId]);
    return rows as Resume[];
  }

  async getAllResumes(): Promise<Resume[]> {
    const [rows] = await pool.query("SELECT * FROM resumes ORDER BY updatedAt DESC");
    return rows as Resume[];
  }

  async deleteResume(id: number): Promise<void> {
    await pool.query("DELETE FROM resumes WHERE id = ?", [id]);
  }

  async createTemplate(template: InsertResumeTemplate): Promise<ResumeTemplate> {
    const [result] = await pool.query("INSERT INTO resumeTemplates SET ?", template);
    const insertedId = (result as any).insertId;
    return { ...template, id: insertedId };
  }

  async getTemplate(id: number): Promise<ResumeTemplate | undefined> {
    const [rows] = await pool.query("SELECT * FROM resumeTemplates WHERE id = ?", [id]);
    return (rows as ResumeTemplate[])[0];
  }

  async getAllTemplates(): Promise<ResumeTemplate[]> {
    const [rows] = await pool.query("SELECT * FROM resumeTemplates");
    return rows as ResumeTemplate[];
  }

  async deleteTemplate(id: number): Promise<void> {
    await pool.query("DELETE FROM resumeTemplates WHERE id = ?", [id]);
  }

  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const [result] = await pool.query("INSERT INTO apiKeys SET ?", apiKey);
    const insertedId = (result as any).insertId;
    return { ...apiKey, id: insertedId };
  }

  async getApiKey(id: number): Promise<ApiKey | undefined> {
    const [rows] = await pool.query("SELECT * FROM apiKeys WHERE id = ?", [id]);
    return (rows as ApiKey[])[0];
  }

  async getActiveApiKey(provider: string): Promise<ApiKey | undefined> {
    const [rows] = await pool.query("SELECT * FROM apiKeys WHERE provider = ? AND active = 1", [provider]);
    return (rows as ApiKey[])[0];
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    const [rows] = await pool.query("SELECT * FROM apiKeys");
    return rows as ApiKey[];
  }

  async deleteApiKey(id: number): Promise<void> {
    await pool.query("DELETE FROM apiKeys WHERE id = ?", [id]);
  }
}

export const storage = new DatabaseStorage();
