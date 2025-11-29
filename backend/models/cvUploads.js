const mongoose = require('mongoose');
const { Schema } = mongoose;

const CvUploadSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  fileUrl: { type: String, required: true },
  fileName: String,
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
  meta: Schema.Types.Mixed
});

module.exports = mongoose.model('CvUpload', CvUploadSchema);
