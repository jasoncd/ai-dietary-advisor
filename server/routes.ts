import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { dietaryAdviceRequestSchema, insertHealthProfileSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

function summarizeHealthProfile(formData: any): string {
  const summary = `${formData.name} is a ${formData.age}-year-old ${formData.gender} with a body weight of ${formData.bodyWeight}. 
Current dietary habits: ${formData.dietaryHabit}. 
Daily activities and exercise: ${formData.dailyActivities}. 
Health goals: ${formData.healthGoal}.
${formData.healthProblem ? `Health concerns: ${formData.healthProblem}.` : ''}
${formData.medication ? `Current medications: ${formData.medication}.` : ''}
Please provide personalized dietary advice and meal recommendations to help achieve their health goals while considering their current lifestyle and any health conditions.`;
  
  return summary;
}

async function callHuggingFaceAPI(healthSummary: string): Promise<string> {
  const API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || "";
  
  // Use a free model that's good for text generation
  const model = "microsoft/DialoGPT-medium";
  
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `You are a professional registered dietitian and nutritional advisor. Provide personalized, evidence-based dietary recommendations based on the client summary below. Always emphasize consulting healthcare professionals for medical concerns.

CLIENT SUMMARY:
${healthSummary}

Please provide comprehensive dietary advice including:
1. Personalized meal recommendations
2. Nutritional guidelines specific to their profile
3. Foods to emphasize and avoid
4. Portion size recommendations
5. Any special considerations based on their health profile

PERSONALIZED DIETARY RECOMMENDATIONS:`,
          parameters: {
            max_length: 800,
            temperature: 0.7,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (Array.isArray(result) && result.length > 0) {
      return result[0].generated_text || "I apologize, but I couldn't generate a proper response. Please try rephrasing your question.";
    }
    
    throw new Error("Unexpected response format");
  } catch (error) {
    console.error("Hugging Face API error:", error);
    
    // Fallback response when API fails
    return `I apologize, but I'm currently unable to process your request due to a technical issue. Here are some general dietary tips:

**General Healthy Eating Guidelines:**
• Eat a variety of whole foods including fruits, vegetables, whole grains, and lean proteins
• Stay hydrated by drinking plenty of water throughout the day
• Practice portion control and mindful eating
• Limit processed foods, added sugars, and excessive sodium
• Consider your individual needs, activity level, and any health conditions

**Important Note:** For personalized dietary advice, especially if you have specific health conditions, allergies, or medical concerns, please consult with a registered dietitian or healthcare professional.

Please try again later when our AI service is available, or consider speaking with a qualified nutrition professional for comprehensive guidance.`;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for getting dietary advice
  app.post("/api/dietary-advice", async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Validate request body
      const validatedData = dietaryAdviceRequestSchema.parse(req.body);
      
      // Summarize health profile
      const healthSummary = summarizeHealthProfile(validatedData);
      
      // Call AI service with summarized data
      const advice = await callHuggingFaceAPI(healthSummary);
      
      const processingTime = (Date.now() - startTime) / 1000;
      
      res.json({
        advice,
        processingTime: Math.round(processingTime * 10) / 10, // Round to 1 decimal
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error in dietary advice route:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid input",
          errors: error.errors,
        });
      }
      
      res.status(500).json({
        message: "Failed to generate dietary advice. Please try again later.",
      });
    }
  });

  // API route for saving health profile
  app.post("/api/health-profiles", async (req, res) => {
    try {
      const validatedData = insertHealthProfileSchema.parse(req.body);
      const savedProfile = await storage.saveHealthProfile(validatedData);
      res.json(savedProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Invalid input",
          errors: error.errors,
        });
      } else {
        console.error("Error saving health profile:", error);
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  });

  // API route for searching health profiles
  app.get("/api/health-profiles/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (typeof q === "string" && q.trim()) {
        const profiles = await storage.searchHealthProfiles(q.trim());
        res.json(profiles);
      } else {
        const profiles = await storage.getAllHealthProfiles();
        res.json(profiles);
      }
    } catch (error) {
      console.error("Error searching health profiles:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });

  // API route for getting all health profiles
  app.get("/api/health-profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllHealthProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching health profiles:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });

  // API route for getting a specific health profile
  app.get("/api/health-profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid ID" });
        return;
      }
      
      const profile = await storage.getHealthProfile(id);
      if (!profile) {
        res.status(404).json({ message: "Profile not found" });
        return;
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching health profile:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });

  // Add comment to health profile
  app.post("/api/health-profiles/:id/comments", async (req, res) => {
    try {
      const healthProfileId = parseInt(req.params.id);
      const commentData = insertCommentSchema.parse({
        ...req.body,
        healthProfileId
      });
      
      const comment = await storage.addComment(commentData);
      res.json(comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  // Get comments for health profile
  app.get("/api/health-profiles/:id/comments", async (req, res) => {
    try {
      const healthProfileId = parseInt(req.params.id);
      const comments = await storage.getCommentsByHealthProfile(healthProfileId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Get replies for a comment
  app.get("/api/comments/:id/replies", async (req, res) => {
    try {
      const parentCommentId = parseInt(req.params.id);
      const replies = await storage.getCommentReplies(parentCommentId);
      res.json(replies);
    } catch (error) {
      console.error("Error fetching replies:", error);
      res.status(500).json({ error: "Failed to fetch replies" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
