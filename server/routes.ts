import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { hashPassword } from "./auth";
import { ResumeContent } from "@shared/schema";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  const httpServer = createServer(app);

  // Resume Templates API
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Resumes API
  app.get("/api/resumes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const resumes = await storage.getResumesByUser(req.user.id);
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.get("/api/resumes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const resume = await storage.getResume(parseInt(req.params.id));
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      // Only allow access if the user owns the resume or is an admin
      if (resume.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Not authorized to view this resume" });
      }

      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  app.post("/api/resumes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { name, templateId, content } = req.body;
      
      if (!name || !templateId || !content) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const resume = await storage.createResume({
        name,
        userId: req.user.id,
        templateId,
        content,
      });

      res.status(201).json(resume);
    } catch (error) {
      console.error("Error creating resume:", error);
      res.status(500).json({ message: "Failed to create resume" });
    }
  });

  app.put("/api/resumes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const resumeId = parseInt(req.params.id);
      const existingResume = await storage.getResume(resumeId);
      
      if (!existingResume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      // Check if the user owns this resume or is an admin
      if (existingResume.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Not authorized to update this resume" });
      }

      const { name, templateId, content } = req.body;
      const updatedResume = await storage.updateResume(resumeId, {
        name,
        templateId,
        content,
      });

      res.json(updatedResume);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const resumeId = parseInt(req.params.id);
      const existingResume = await storage.getResume(resumeId);
      
      if (!existingResume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      // Check if the user owns this resume or is an admin
      if (existingResume.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Not authorized to delete this resume" });
      }

      await storage.deleteResume(resumeId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // OpenRouter AI API
  app.post("/api/ai/generate", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { prompt, type } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // Get the OpenRouter API key
      const apiKey = await storage.getActiveApiKey("openrouter");
      
      if (!apiKey) {
        return res.status(500).json({ message: "OpenRouter API key not configured" });
      }

      // Format the prompt based on the content type requested
      let formattedPrompt = "";
      
      switch (type) {
        case "summary":
          formattedPrompt = `Write a professional resume summary (2-3 sentences) for someone with the following background: ${prompt}`;
          break;
        case "experience":
          formattedPrompt = `Write 3-4 bullet points describing job responsibilities and achievements for this position: ${prompt}`;
          break;
        case "complete":
          formattedPrompt = `Create a professional resume based on the following background information. Format the response as JSON following this structure: ${JSON.stringify({
            personalInfo: {
              firstName: "String",
              lastName: "String",
              email: "String",
              phone: "String",
              address: "String",
              title: "String",
              summary: "String"
            },
            education: [
              {
                institution: "String",
                degree: "String",
                fieldOfStudy: "String",
                startDate: "String",
                endDate: "String",
                description: "String"
              }
            ],
            experience: [
              {
                company: "String",
                position: "String",
                startDate: "String",
                endDate: "String",
                description: "String"
              }
            ],
            skills: [
              {
                name: "String",
                level: 0
              }
            ],
            projects: [
              {
                name: "String",
                description: "String",
                url: "String",
                startDate: "String",
                endDate: "String"
              }
            ]
          })}. Background information: ${prompt}`;
          break;
        default:
          formattedPrompt = prompt;
      }

      // Call OpenRouter API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.key}`,
          "HTTP-Referer": process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(",")[0] : "http://localhost:5000",
          "X-Title": "AI Resume Builder"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a professional resume writer helping users create impressive resumes."
            },
            {
              role: "user",
              content: formattedPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenRouter API error:", errorData);
        return res.status(response.status).json({ message: "AI generation failed", details: errorData });
      }

      const data = await response.json();
      let result = data.choices[0].message.content;

      // For complete resume requests, parse the JSON if possible
      if (type === "complete") {
        try {
          // Extract JSON from the response if it's wrapped in markdown code blocks
          const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, result];
          const jsonContent = jsonMatch[1];
          
          // Parse and validate as ResumeContent
          const parsedContent = JSON.parse(jsonContent) as ResumeContent;
          return res.json({ content: parsedContent });
        } catch (error) {
          console.error("Error parsing AI response as JSON:", error);
          return res.json({ content: result });
        }
      }

      res.json({ content: result });
    } catch (error) {
      console.error("Error generating AI content:", error);
      res.status(500).json({ message: "Failed to generate AI content" });
    }
  });

  // Admin API routes
  // Users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Don't allow deleting the current user
      if (userId === req.user.id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      await storage.deleteUser(userId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Admin Resumes management
  app.get("/api/admin/resumes", async (req, res) => {
    try {
      const resumes = await storage.getAllResumes();
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.delete("/api/admin/resumes/:id", async (req, res) => {
    try {
      const resumeId = parseInt(req.params.id);
      await storage.deleteResume(resumeId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // API Keys management
  app.get("/api/admin/api-keys", async (req, res) => {
    try {
      const apiKeys = await storage.getAllApiKeys();
      res.json(apiKeys);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      res.status(500).json({ message: "Failed to fetch API keys" });
    }
  });

  app.post("/api/admin/api-keys", async (req, res) => {
    try {
      const { name, key, provider } = req.body;
      
      if (!name || !key || !provider) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const apiKey = await storage.createApiKey({
        name,
        key,
        provider,
        isActive: true,
      });
      
      res.status(201).json(apiKey);
    } catch (error) {
      console.error("Error creating API key:", error);
      res.status(500).json({ message: "Failed to create API key" });
    }
  });

  app.put("/api/admin/api-keys/:id", async (req, res) => {
    try {
      const keyId = parseInt(req.params.id);
      const { name, key, provider, isActive } = req.body;
      
      const updatedKey = await storage.updateApiKey(keyId, {
        name,
        key,
        provider,
        isActive,
      });
      
      if (!updatedKey) {
        return res.status(404).json({ message: "API key not found" });
      }
      
      res.json(updatedKey);
    } catch (error) {
      console.error("Error updating API key:", error);
      res.status(500).json({ message: "Failed to update API key" });
    }
  });

  app.delete("/api/admin/api-keys/:id", async (req, res) => {
    try {
      const keyId = parseInt(req.params.id);
      await storage.deleteApiKey(keyId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting API key:", error);
      res.status(500).json({ message: "Failed to delete API key" });
    }
  });

  return httpServer;
}
