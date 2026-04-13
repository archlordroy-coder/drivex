const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'DriveX API is running' });
});

// Endpoint pour la recherche (moteur basé sur Google Drive API)
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  // Logique d'appel à l'API Google Drive v3 ici
  res.json({ results: [] });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
