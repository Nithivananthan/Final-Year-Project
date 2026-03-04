const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require('../middleware/authmiddleware');

const User = mongoose.model('User');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get('/match', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.roadmap || !user.roadmap.targetDomain) {
      return res.status(400).json({ msg: "Complete your profile first" });
    }

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: `${user.roadmap.targetDomain} in India`,
        page: '1',
        num_pages: '2', 
        date_posted: 'week' 
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, 
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    const rawJobs = response.data.data;

    const jobsToAnalyze = rawJobs.slice(0, 10); 

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const userContext = {
      skills: user.roadmap.roadmapData.filter(s => s.isCompleted).map(s => s.goal),
      target: user.roadmap.targetDomain
    };

    const matchingPrompt = `
      User Skills: ${userContext.skills.join(", ")}
      Job List: ${JSON.stringify(jobsToAnalyze.map(j => ({ id: j.job_id, title: j.job_title, desc: j.job_description.slice(0, 500) })))}
      
      Analyze each job. Return ONLY a JSON array of objects: 
      [{"id": "job_id", "matchScore": 0-100, "reason": "1-sentence why"}]
    `;

    const aiResult = await model.generateContent(matchingPrompt);
    const aiText = aiResult.response.text();
    
    const jsonMatch = aiText.match(/\[[\s\S]*\]/);
    const matches = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    const finalRecommendations = jobsToAnalyze.map(job => {
      const matchData = matches.find(m => m.id === job.job_id);
      return {
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        logo: job.employer_logo || 'https://via.placeholder.com/100',
        location: job.job_city || 'India',
        applyLink: job.job_apply_link,
        matchScore: matchData ? matchData.matchScore : 50,
        analysis: matchData ? matchData.reason : "Analyzing fit..."
      };
    });

    res.json(finalRecommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to sync real-time jobs" });
  }
});

module.exports = router;