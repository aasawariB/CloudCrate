const File = require('../models/File')

const getBilling = async (req, res) => {
  try {
    // Get all files for this user
    const files = await File.find({ user: req.user._id })

    // Calculate total storage in bytes then convert to MB
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0)
    const totalMB = totalBytes / (1024 * 1024)

    // Billing rules
    const storageRate = 2      // ₹2 per MB
    const uploadRate = 1       // ₹1 per upload

    const storageCost = parseFloat((totalMB * storageRate).toFixed(2))
    const uploadCost  = files.length * uploadRate
    const totalCost   = parseFloat((storageCost + uploadCost).toFixed(2))

    res.json({
      totalFiles: files.length,
      totalStorageMB: parseFloat(totalMB.toFixed(2)),
      storageCost,   // ₹2 per MB
      uploadCost,    // ₹1 per file
      totalCost,     // total bill in ₹
      currency: 'INR',
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getBilling }