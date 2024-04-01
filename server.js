// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Player = require('./models/player');

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost:27017/cricket', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/players', async (req, res) => {
  const player = new Player(req.body);
  try {
    const savedPlayer = await player.save();
    res.json(savedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/players/:id', async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
