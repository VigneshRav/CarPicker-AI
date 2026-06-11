const express = require('express');
const cors = require('cors');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

// Enable CORS for frontend cross-origin requests
app.use(cors());

// Parse JSON request payloads
app.use(express.json());

// Routes configuration
app.use('/api/recommend', recommendationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CarCompass AI server is healthy' });
});

// Wildcard 404 Route handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

module.exports = app;
