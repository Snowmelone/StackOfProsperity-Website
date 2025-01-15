require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser'); // To handle cookies for JWTs

const app = express();
const PORT = 3000;

// Use environment variable for JWT secret key
const jwtSecret = process.env.JWT_SECRET || 'your_default_secret_key';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static('C:/Users/Kian/Desktop/R6 Website'));

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    console.log('No token found. Redirecting to sign-in page.');
    return res.redirect('/SignIn.html'); // Redirect if no token
  }

  try {
    const verified = jwt.verify(token, jwtSecret);
    console.log('Token verified:', verified);
    req.user = verified; // Attach verified user data to the request
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.redirect('/SignIn.html'); // Redirect if token verification fails
  }
};

// Routes for serving HTML files

// Home Page (Static)
app.get('/', (req, res) => {
  res.sendFile('C:/Users/Kian/Desktop/R6 Website/HTML files/Home.html');
});

app.get('/Home.html', (req, res) => {
  res.sendFile('C:/Users/Kian/Desktop/R6 Website/HTML files/Home.html');
});

// Sign-In Page (Static)
app.get('/SignIn.html', (req, res) => {
  res.sendFile('C:/Users/Kian/Desktop/R6 Website/HTML files/SignIn.html');
});

// Protected Pages
app.get('/SiteSetups.html', authenticate, (req, res) => {
  res.sendFile('C:/Users/Kian/Desktop/R6 Website/HTML files/SiteSetups.html');
});

app.get('/AttackerStrategies.html', authenticate, (req, res) => {
  res.sendFile('C:/Users/Kian/Desktop/R6 Website/HTML files/AttackerStrategies.html');
});

// Sign-Up Route
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    // Hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, jwtSecret, { expiresIn: '1h' });

    // Set token as an HTTP-only cookie
    res.cookie('authToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Sign-In Route
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });

    // Set token as an HTTP-only cookie
    res.cookie('authToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Sign in successful' });
  } catch (error) {
    console.error('Error signing in:', error.message);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Logout Route
app.post('/logout', (req, res) => {
  res.clearCookie('authToken'); // Clear the auth token cookie
  res.json({ message: 'Logged out successfully' });
});



// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

