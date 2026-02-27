const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require('../middleware/authmiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Robust JSON Extractor Helper
const extractJSON = (text) => {
  try {
    const startArr = text.indexOf('[');
    const startObj = text.indexOf('{');
    let start = -1; let end = -1;

    if (startArr !== -1 && (startObj === -1 || startArr < startObj)) {
      start = startArr; end = text.lastIndexOf(']') + 1;
    } else if (startObj !== -1) {
      start = startObj; end = text.lastIndexOf('}') + 1;
    }
    if (start === -1 || end === 0) throw new Error("Invalid AI format");
    return JSON.parse(text.substring(start, end).trim());
  } catch (e) {
    throw new Error("AI parsing failed");
  }
};

// 1. Deep Consultation (Domain Discovery)
router.post('/deep-consult', authMiddleware, async (req, res) => {
  const { profile } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Act as a Placement Director. Student Profile: Year ${profile.academicStatus}, Backlogs: ${profile.backlogs}, Skills: ${profile.topSkills}, Goal: ${profile.dreamCompany}. 
    Suggest exactly 5 Industry Career Domains. For each, give a 'Corrective Analysis' explaining why this path is realistic for their current academic standing.
    Return ONLY JSON Array: [{"domain": "Job Title", "analysis": "Reasoning"}]`;

    const result = await model.generateContent(prompt);
    res.json(extractJSON(result.response.text()));
  } catch (err) { res.status(500).json({ msg: "Consultation Error" }); }
});

// 2. Skill Gap & Roadmap Generator (The "Level-Up" Logic)
router.post('/generate-roadmap', authMiddleware, async (req, res) => {
  const { domain, currentSkills } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `The student knows: ${currentSkills}. They want to become a: ${domain}.
    1. Identify 5 CRITICAL missing skills they lack to be industry-ready.
    2. Create a 6-month roadmap to 'Level Up'.
    Return ONLY JSON Object:
    {
      "targetDomain": "${domain}",
      "missingSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
      "roadmap": [
        {"month": 1, "goal": "Mastery Topic", "action": "Step-by-step detail", "isCompleted": false},
        {"month": 2, "goal": "...", "action": "...", "isCompleted": false},
        {"month": 3, "goal": "...", "action": "...", "isCompleted": false},
        {"month": 4, "goal": "...", "action": "...", "isCompleted": false},
        {"month": 5, "goal": "...", "action": "...", "isCompleted": false},
        {"month": 6, "goal": "Final Project", "action": "Build a portfolio piece", "isCompleted": false}
      ]
    }`;

    const result = await model.generateContent(prompt);
    res.json(extractJSON(result.response.text()));
  } catch (err) { res.status(500).json({ msg: "Roadmap Error" }); }
});

module.exports = router;