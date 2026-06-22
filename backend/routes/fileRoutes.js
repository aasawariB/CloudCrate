const express = require('express')
const router = express.Router()
const { uploadFile, getMyFiles, deleteFile } = require('../controllers/fileController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../config/multer')

router.post('/upload', protect, upload.single('file'), uploadFile)
router.get('/my-files', protect, getMyFiles)
router.delete('/:id', protect, deleteFile)

module.exports = router