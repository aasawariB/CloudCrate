const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  storedName: {
    type: String,
    required: true,
  },
  size: {
    type: Number,  // size in bytes
    required: true,
  },
  mimeType: {
    type: String,
  },
  uploadCost: {
    type: Number,  // ₹1 per upload
    default: 1,
  },
}, { timestamps: true })

module.exports = mongoose.model('File', fileSchema)