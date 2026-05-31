import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    secure: false // set to true in production with HTTPS
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user-management';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Farmer Data Schema
const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  mobile: { type: String, required: true },
  aadhar: { type: String, required: true },
  pan: { type: String, required: true },
  farmerId: { type: String, required: true },
  panFile: String,
  jila: { type: String, required: true },
  tehsil: { type: String, required: true },
  gao: { type: String, required: true },
  landRecords: [{
    surveyNumber: String,
    rakhva: Number
  }],
  totalRakhva: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Farmer = mongoose.model('Farmer', farmerSchema);

// Passport Configuration
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Sign up
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    await user.save();

    res.json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login
app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (!user) {
      return res.status(401).json({ error: info.message || 'Invalid credentials' });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Session error:', err);
        return res.status(500).json({ error: 'Session creation failed' });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    });
  })(req, res, next);
});

// Logout
app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

// Check auth status
app.get('/api/auth/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Create farmer
app.post('/api/farmers', isAuthenticated, async (req, res) => {
  try {
    const farmerData = req.body;

    const farmer = new Farmer({
      ...farmerData,
      createdBy: req.user._id
    });

    await farmer.save();

    res.json({ success: true, id: farmer._id });
  } catch (error) {
    console.error('Create farmer error:', error);
    res.status(500).json({ error: 'Failed to create farmer' });
  }
});

// Get all farmers
app.get('/api/farmers', isAuthenticated, async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json({ farmers });
  } catch (error) {
    console.error('Get farmers error:', error);
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

// Get single farmer
app.get('/api/farmers/:id', isAuthenticated, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    res.json({ farmer });
  } catch (error) {
    console.error('Get farmer error:', error);
    res.status(500).json({ error: 'Failed to fetch farmer' });
  }
});

// Update farmer
app.put('/api/farmers/:id', isAuthenticated, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    const updates = {
      ...req.body,
      updatedAt: new Date(),
      updatedBy: req.user._id
    };

    await Farmer.findByIdAndUpdate(req.params.id, updates);

    res.json({ success: true });
  } catch (error) {
    console.error('Update farmer error:', error);
    res.status(500).json({ error: 'Failed to update farmer' });
  }
});

// Delete farmer
app.delete('/api/farmers/:id', isAuthenticated, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    await Farmer.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete farmer error:', error);
    res.status(500).json({ error: 'Failed to delete farmer' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
