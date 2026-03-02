const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require('../middleware/authmiddleware');

const User = mongoose.model('User');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractJSON = (text) => {
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    return JSON.parse(jsonMatch[0].trim());
  } catch (e) {
    throw new Error("AI Format Error: " + e.message);
  }
};

router.post('/deep-consult', authMiddleware, async (req, res) => {
  const { profile } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Act as a Career Architect. Analyze this student:
      - Academic: ${profile.academicStatus}, Backlogs: ${profile.backlogs}
      - Skills: ${profile.topSkills}
      - Projects Built: ${profile.projectDetails}
      - Work Style: ${profile.workStyle}
      - Dream Company: ${profile.dreamCompany}
      
      Suggest exactly 5 Industry Domains. Provide a 'Corrective Analysis' (2 sentences) explaining why this fits their profile and what they must fix to reach ${profile.dreamCompany}.
      
      Return ONLY a JSON Array: [{"domain": "Job Title", "analysis": "Detailed reasoning"}]
    `;

    const result = await model.generateContent(prompt);
    res.json(extractJSON(result.response.text()));
  } catch (err) {
    res.status(500).json({ msg: "AI Consult failed." });
  }
});

router.post('/generate-roadmap', authMiddleware, async (req, res) => {
  const { domain, currentSkills } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `6-month roadmap for ${domain} given skills ${currentSkills}. Return ONLY JSON: {"targetDomain": "${domain}", "missingSkills": ["s1", "s2"], "roadmap": [{"month": 1, "goal": "Skill 1", "action": "Steps", "isCompleted": false}]}`;
    const result = await model.generateContent(prompt);
    const roadmapData = extractJSON(result.response.text());

    await User.findByIdAndUpdate(req.user.id, {
      roadmap: {
        targetDomain: roadmapData.targetDomain,
        missingSkills: roadmapData.missingSkills,
        roadmapData: roadmapData.roadmap
      }
    });
    res.json(roadmapData);
  } catch (err) { res.status(500).send("AI Roadmap Error"); }
});

module.exports = router;