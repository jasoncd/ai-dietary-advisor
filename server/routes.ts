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
  // For now, let's use a working setup with your token
  const API_KEY = process.env.HUGGING_FACE_TOKEN || "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";
  
  // Use Hugging Face's text generation API with a stable model
  const model = "microsoft/DialoGPT-small";
  
  try {
    const prompt = `Provide personalized dietary advice for: ${healthSummary}. Include meal recommendations, nutritional guidelines, foods to emphasize/avoid, portion sizes, and special considerations.`;

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 300,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
            repetition_penalty: 1.1,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Hugging Face API error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Hugging Face API response:", result);
    
    if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
      const advice = result[0].generated_text.trim();
      return advice || "I apologize, but I couldn't generate a proper response. Please try again.";
    }
    
    throw new Error("Unexpected response format");
  } catch (error) {
    console.error("Hugging Face API error:", error);
    
    // Enhanced fallback response with personalized advice
    return generatePersonalizedAdvice(healthSummary);
  }
}

function generatePersonalizedAdvice(healthSummary: string): string {
  // Parse the health summary to extract key information
  const isVegetarian = healthSummary.toLowerCase().includes('vegetarian');
  const isVegan = healthSummary.toLowerCase().includes('vegan');
  const hasHighCholesterol = healthSummary.toLowerCase().includes('cholesterol');
  const hasDiabetes = healthSummary.toLowerCase().includes('diabetes');
  const wantsWeightLoss = healthSummary.toLowerCase().includes('weight loss') || healthSummary.toLowerCase().includes('lose weight');
  const wantsMuscleGain = healthSummary.toLowerCase().includes('muscle') || healthSummary.toLowerCase().includes('build');
  const isActive = healthSummary.toLowerCase().includes('gym') || healthSummary.toLowerCase().includes('exercise');
  
  let advice = "Based on your health profile, here are personalized dietary recommendations:\n\n";
  
  // Personalized meal recommendations
  advice += "**Recommended Foods:**\n";
  if (isVegetarian || isVegan) {
    advice += "• Legumes (lentils, chickpeas, black beans) for protein\n";
    advice += "• Quinoa, brown rice, and whole grain breads\n";
    advice += "• Nuts and seeds (almonds, walnuts, chia seeds)\n";
    if (!isVegan) {
      advice += "• Greek yogurt and eggs for additional protein\n";
    }
  } else {
    advice += "• Lean proteins (chicken breast, fish, turkey)\n";
    advice += "• Fatty fish (salmon, mackerel) twice weekly\n";
  }
  
  if (hasHighCholesterol) {
    advice += "• Oats, barley, and soluble fiber-rich foods\n";
    advice += "• Avocados and olive oil for healthy fats\n";
    advice += "• Berries and leafy greens for antioxidants\n";
  }
  
  if (wantsMuscleGain && isActive) {
    advice += "• Adequate protein at each meal (20-30g)\n";
    advice += "• Complex carbohydrates around workouts\n";
  }
  
  advice += "\n**Foods to Limit:**\n";
  if (hasHighCholesterol) {
    advice += "• Saturated fats and trans fats\n";
    advice += "• High-sodium processed foods\n";
  }
  if (hasDiabetes) {
    advice += "• Refined sugars and simple carbohydrates\n";
    advice += "• Processed snacks and sugary drinks\n";
  } else {
    advice += "• Processed foods and added sugars\n";
    advice += "• Excessive sodium and refined grains\n";
  }
  
  // Portion guidance
  advice += "\n**Portion Guidelines:**\n";
  if (wantsWeightLoss) {
    advice += "• Use smaller plates to control portions\n";
    advice += "• Fill half your plate with vegetables\n";
    advice += "• Protein portion: palm-sized serving\n";
  } else if (wantsMuscleGain) {
    advice += "• Protein: 1.6-2.2g per kg body weight daily\n";
    advice += "• Carbohydrates: Focus around workout times\n";
  }
  
  // Meal timing
  advice += "\n**Meal Timing:**\n";
  if (isActive) {
    advice += "• Eat protein within 2 hours post-workout\n";
    advice += "• Include carbs before and after exercise\n";
  }
  advice += "• Eat regular meals every 3-4 hours\n";
  advice += "• Stay hydrated with 8-10 glasses of water daily\n";
  
  // Special considerations
  advice += "\n**Special Considerations:**\n";
  if (healthSummary.includes('medication')) {
    advice += "• Consult your doctor about food-drug interactions\n";
  }
  if (hasHighCholesterol) {
    advice += "• Consider plant stanols/sterols in foods\n";
    advice += "• Monitor cholesterol levels regularly\n";
  }
  
  advice += "\n**Important:** This advice is based on general nutritional principles. For personalized guidance, especially with health conditions or medications, please consult with a registered dietitian or healthcare professional.\n";
  
  return advice;
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
      
      // Use personalized fallback advice even if API fails
      const healthSummary = summarizeHealthProfile(req.body);
      const advice = generatePersonalizedAdvice(healthSummary);
      
      res.json({
        advice,
        processingTime: 0.1,
        timestamp: new Date().toISOString(),
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
