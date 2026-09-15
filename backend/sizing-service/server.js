const express = require('express');
const cors = require('cors');
const sizingRoutes = require('./routes/sizingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount your routes
app.use('/api/v1/sizing', sizingRoutes);

// Test root endpoint
app.get('/', (req, res) => {
  res.send({ message: 'Sizing Service is running successfully!' });
});

// Choose a unique port (e.g., 5003) so it doesn't clash with your PDF or GIS services
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Sizing Service listening on port ${PORT}`);
});