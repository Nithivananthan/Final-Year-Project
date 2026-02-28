const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require('../middleware/authmiddleware');

// Access the User model registered in your Auth routes
const User = mongoose.model('User');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Robust JSON Extractor (Cleans markdown backticks like ```json)
const extractJSON = (text) => {
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON block found in AI response");
    return JSON.parse(jsonMatch[0].trim());
  } catch (e) {
    console.error("AI Response causing error:", text);
    throw new Error("AI Format Error: " + e.message);
  }
};

/**
 * 1. Deep Consultation (Domain Discovery)
 * No more mock data—always calls Gemini 1.5 Flash.
 */
router.post('/deep-consult', authMiddleware, async (req, res) => {
  const { profile } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Act as a Career Placement Director. Analyze this student:
      Year: ${profile.academicStatus}, Backlogs: ${profile.backlogs}, Skills: ${profile.topSkills}, Goal: ${profile.dreamCompany}.
      
      Suggest exactly 5 realistic Industry Career Domains. 
      For each, provide a 'Corrective Analysis' explaining exactly why this path fits their profile and what they should fix.
      
      Return ONLY a JSON Array: 
      [{"domain": "Job Title", "analysis": "Detailed 2-sentence reasoning"}]
    `;

    const result = await model.generateContent(prompt);
    const data = extractJSON(result.response.text());
    res.json(data);

  } catch (err) {
    console.error("Consultation AI Error:", err);
    res.status(err.status || 500).json({ msg: "AI Consult failed. Check API key/quota." });
  }
});

/**
 * 2. Skill Gap & Roadmap Generator
 * Saves the real AI roadmap directly to MongoDB.
 */
router.post('/generate-roadmap', authMiddleware, async (req, res) => {
  const { domain, currentSkills } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      The student currently knows: ${currentSkills}.
      They want to become a: ${domain}.
      
      1. Identify 5 CRITICAL missing technical skills they lack.
      2. Create a detailed 6-month 'Level Up' roadmap.
      
      Return ONLY a JSON Object:
      {
        "targetDomain": "${domain}",
        "missingSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
        "roadmap": [
          {"month": 1, "goal": "Skill 1 Mastery", "action": "Specific learning steps for month 1", "isCompleted": false},
          {"month": 2, "goal": "Skill 2 Mastery", "action": "Specific learning steps for month 2", "isCompleted": false},
          {"month": 3, "goal": "Project Phase 1", "action": "Specific building steps for month 3", "isCompleted": false},
          {"month": 4, "goal": "Skill 3 Mastery", "action": "Specific learning steps for month 4", "isCompleted": false},
          {"month": 5, "goal": "Skill 4 Mastery", "action": "Specific learning steps for month 5", "isCompleted": false},
          {"month": 6, "goal": "Final Portfolio", "action": "Final deployment and portfolio polish", "isCompleted": false}
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const roadmapData = extractJSON(result.response.text());

    // ✅ SAVE TO DATABASE (PERSISTENCE)
    await User.findByIdAndUpdate(req.user.id, {
      roadmap: {
        targetDomain: roadmapData.targetDomain,
        missingSkills: roadmapData.missingSkills,
        roadmapData: roadmapData.roadmap
      }
    });

    res.json(roadmapData);

  } catch (err) {
    console.error("Roadmap AI Error:", err);
    res.status(err.status || 500).json({ msg: "AI Roadmap failed." });
  }
});

module.exports = router;