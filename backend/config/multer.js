const multer = require('multer')
const path = require('path')

// Where to store files and what to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Add timestamp to filename so duplicates don't overwrite each other
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_')
    cb(null, uniqueName)
  },
})

// Only allow certain file types
const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.zip', '.sql', '.mp4', '.txt', '.docx']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('File type not allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },  // 50 MB max
})

module.exports = upload