const express = require('express');
const router = express.Router();
// const axios = require('axios');
// const { GoogleAuth } = require('google-auth-library');

// POST /api/recommendations
router.post('/', async (req, res) => {
  const { topics, skillLevel } = req.body || {};

  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: 'Topics are required (array).' });
  }
  if (!skillLevel) {
    return res.status(400).json({ error: 'Skill level is required.' });
  }

  try {
    // =========================
    // MOCK DATA (for submission)
    // =========================
    const mock = [
      { id: 'g-1', title: 'Intro to Data Science', instructor: 'Prof A', reason: 'Matches beginner data science' },
      { id: 'g-2', title: 'Python for Data Analysis', instructor: 'Prof B', reason: 'Hands-on with Python' },
      { id: 'g-3', title: 'Statistics Essentials', instructor: 'Prof C', reason: 'Fundamental stats' }
    ];

    res.json({
      source: 'mock',
      preferences: { topics, skillLevel },
      recommendations: mock
    });

    // =========================
    // REAL GEMINI API (enable if you have valid service account)
    // =========================
    /*
    const auth = new GoogleAuth({
      keyFile: '../../Gemini_Key.json', // path to your JSON key
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent',
      {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Recommend online courses for a ${skillLevel} learner interested in ${topics.join(', ')}.`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const recommendations = response.data.choices[0].message.parts[0].text;

    res.json({
      source: 'Gemini AI',
      preferences: { topics, skillLevel },
      recommendations
    });
    */

  } catch (err) {
    console.error('Recommendations error:', err.message);
    res.status(500).json({ error: 'Failed to fetch recommendations.' });
  }
});

module.exports = router;
