// Mongoose model for Admin users
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);
