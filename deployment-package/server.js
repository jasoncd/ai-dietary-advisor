const express = require('express');
const path = require('path');
const { z } = require('zod');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist/public directory
app.use(express.static(path.join(__dirname, 'dist', 'public')));

// CORS middleware for API routes
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Dietary advice request schema
const dietaryAdviceRequestSchema = z.object({
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

function summarizeHealthProfile(formData) {
  const summary = `${formData.name} is a ${formData.age}-year-old ${formData.gender} with a body weight of ${formData.bodyWeight}. 
Current dietary habits: ${formData.dietaryHabit}. 
Daily activities and exercise: ${formData.dailyActivities}. 
Health goals: ${formData.healthGoal}.
${formData.healthProblem ? `Health concerns: ${formData.healthProblem}.` : ''}
${formData.medication ? `Current medications: ${formData.medication}.` : ''}
Please provide personalized dietary advice and meal recommendations to help achieve their health goals while considering their current lifestyle and any health conditions.`;
  
  return summary;
}

// Function to call Hugging Face API
async function callHuggingFaceAPI(healthSummary) {
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

// API Routes
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Dietary Advisor server running on port ${PORT}`);
  console.log(`📱 Access your app at: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.log('⚠️  Warning: HUGGINGFACE_API_KEY not found. Using fallback responses.');
  } else {
    console.log('✅ Hugging Face API key configured');
  }
});

module.exports = app;