const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobDescriptionSchema = new Schema({
  jdId: { type: String, index: true },
  title: String,
  department: String,
  location: String,
  requiredSkills: [String],
  preferredSkills: [String],
  experienceRequired: Number,
  responsibilities: [String],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('JobDescription', JobDescriptionSchema);
