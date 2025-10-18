// Mongoose model for Course records (fields from CSV)
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  course_id: String,
  title: String,
  description: String,
  category: String,
  instructor: String,
  duration: String,
  firstYearTuitionFee: Number,
  tuitionFeeCurrency: String,
  universityCode: String,
  // keep raw row for flexibility
  meta: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Course', CourseSchema);
