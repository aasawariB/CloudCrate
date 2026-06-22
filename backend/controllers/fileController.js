const File = require('../models/File')
const fs = require('fs')
const path = require('path')

// Upload file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const file = await File.create({
      user: req.user._id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadCost: 1,  // ₹1 per upload
    })

    res.status(201).json({
      message: 'File uploaded successfully',
      file,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get all files for logged in user
const getMyFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(files)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Delete a file
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    // Make sure the file belongs to the logged in user
    if (file.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this file' })
    }

    // Delete physical file from uploads folder
    const filePath = path.join(__dirname, '..', 'uploads', file.storedName)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete from database
    await file.deleteOne()

    res.json({ message: 'File deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { uploadFile, getMyFiles, deleteFile }