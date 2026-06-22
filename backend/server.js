const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
const authRoutes = require('./routes/authRoutes')
const fileRoutes = require('./routes/fileRoutes')
const billingRoutes = require('./routes/billingRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/billing', billingRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'CloudCrate API is running!' })
})

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
  })