const passport = require('passport');
const session = require('express-session');
const express = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();
const app = express();

// Middleware for sessions and static files
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Setup with proper profile extraction
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo' // Ensure we get the proper profile info
  },
  function(accessToken, refreshToken, profile, done) {
    // Log to debug what's coming from Google
    console.log('Google profile received:', JSON.stringify(profile, null, 2));
    
    // Ensure we have the proper profile structure
    const user = {
      id: profile.id,
      displayName: profile.displayName || 'User',
      emails: profile.emails || [{ value: 'No email available' }],
      photos: profile.photos || [{ value: '/default-profile.png' }]
    };
    
    return done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Debug middleware to log user info
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('Current user:', req.user.displayName);
    console.log('Photo URL:', req.user.photos && req.user.photos[0] ? req.user.photos[0].value : 'No photo');
    console.log('Email:', req.user.emails && req.user.emails[0] ? req.user.emails[0].value : 'No email');
  }
  next();
});

// Home route for logged-in users
app.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    res.render('home', { user: req.user });
  }
});

// Google login route
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

// Login page
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

// Logout route
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// Create a default profile image route
app.get('/default-profile.png', (req, res) => {
  res.sendFile(__dirname + '/public/default-profile.png');
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});