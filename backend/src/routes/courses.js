// CSV upload and search endpoints (with Redis caching)
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Course = require('../models/Course');
const redisClient = require('../utils/redisClient');
const router = express.Router();

// configure multer temp storage for CSV file uploads
const upload = multer({ dest: 'tmp/' });

/**
 * POST /api/courses/upload
 * Accepts form-data with `file` field (CSV). Parses CSV and inserts into MongoDB.
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'CSV file required' });
  const results = [];
  const filepath = req.file.path;

  try {
    // parse CSV stream and push rows into results
    const stream = fs.createReadStream(filepath).pipe(csv());
    for await (const row of stream) {
      // map CSV columns to Course model fields; keep raw data in meta
      results.push({
        course_id: row.course_id || row.id || row.CourseID || '',
        title: row.title || row.Title || row.courseName || '',
        description: row.description || row.Description || row.overviewDescription || '',
        category: row.category || row.Category || '',
        instructor: row.instructor || row.Instructor || '',
        duration: row.duration || row.Duration || '',
        firstYearTuitionFee: Number(row.firstYearTuitionFee || row.tuition || 0),
        tuitionFeeCurrency: row.tuitionFeeCurrency || row.currency || 'USD',
        universityCode: row.universityCode || row.university_code || '',
        meta: row
      });
    }

    // bulk insert into MongoDB
    if (results.length) await Course.insertMany(results);

    // cleanup temp file
    fs.unlinkSync(filepath);
    res.json({ inserted: results.length });
  } catch (err) {
    console.error('CSV upload error', err);
    // attempt to remove temp file if exists
    try { if (fs.existsSync(filepath)) fs.unlinkSync(filepath); } catch {}
    res.status(500).json({ error: 'Failed to process CSV' });
  }
});

/**
 * GET /api/courses/search?q=...&page=1&limit=20
 * Performs a simple text search across title/description/category/instructor.
 * Uses Redis caching to reduce DB load for identical queries.
 */
router.get('/search', async (req, res) => {
  const q = (req.query.q || '').toString();
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  const cacheKey = `search:${q}:page:${page}:limit:${limit}`;

  try {
    // check Redis first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ source: 'cache', results: JSON.parse(cached) });
    }

    // build Mongo query (regex based, for assignment). For production use full-text index.
    const query = q ? {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { instructor: { $regex: q, $options: 'i' } }
      ]
    } : {};

    const results = await Course.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // cache results for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(results), { EX: 3600 });

    res.json({ source: 'db', results });
  } catch (err) {
    console.error('Search error', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * GET /api/courses/:id
 * Fetch a course by course_id (cached)
 */
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const key = `course:${id}`;

  try {
    const cached = await redisClient.get(key);
    if (cached) return res.json({ source: 'cache', course: JSON.parse(cached) });

    const course = await Course.findOne({ course_id: id }).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await redisClient.set(key, JSON.stringify(course), { EX: 3600 });
    res.json({ source: 'db', course });
  } catch (err) {
    console.error('Get course error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
