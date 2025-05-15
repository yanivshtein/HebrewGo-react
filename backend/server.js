const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://hebgoAdmin:HebGo1234%21@hebgo.ungpego.mongodb.net/hebrewGo?retryWrites=true&w=majority&appName=HebGo',
  {}
);
// Confirm connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('✅ Connected to MongoDB'));

// User Schema
const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  progress:   {
    us:   { easy: [Number], medium: [Number], hard: [Number] },
    es:   { easy: [Number], medium: [Number], hard: [Number] },
    ru:   { easy: [Number], medium: [Number], hard: [Number] }
  }
});
const User = mongoose.model('User', userSchema);

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, progress } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  try {
    if (await User.findOne({ name: username })) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    // Store password in plain text (no bcrypt)
    const user = new User({ name: username, password, progress });
    await user.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Save or update user progress/settings
app.post('/api/save', async (req, res) => {
  const { name, language, difficulty, progress } = req.body;
  try {
    let user = await User.findOne({ name });
    if (user) {
      user.language = language;
      user.difficulty = difficulty;
      user.progress = progress;
    } else {
      return res.status(400).json({ error: 'User does not exist.' });
    }
    await user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by name
app.get('/api/user/:name', async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name }).select('-password');
    res.status(200).json(user || {});
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server is running at http://localhost:${PORT}`));
