const express = require('express')
const router = express.Router()
const { getBilling } = require('../controllers/billingController')
const { protect } = require('../middleware/authMiddleware')

router.get('/summary', protect, getBilling)

module.exports = router