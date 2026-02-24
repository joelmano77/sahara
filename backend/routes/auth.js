const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../db/models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_prod';

// Register Local User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            authProvider: 'local'
        });

        const savedUser = await newUser.save();

        // Sign JWT
        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }
        });
    } catch (err) {
        console.error('[POST /auth/register] ERROR:', err);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login Local User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please enter all fields' });
        }

        // Check for existing user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Validate password
        if (user.authProvider !== 'local' || !user.password) {
            return res.status(400).json({ error: 'Please sign in with Google' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Sign JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error('[POST /auth/login] ERROR:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Google Login
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ error: 'Google credential missing' });
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id'
        }).catch(err => {
            // Note: If using placeholder client ID, it might fail verification
            // For MVP purposes without a real client ID, we could decode it directly
            // but for security we should verify. 
            // Workaround logic for placeholder test:
            if (process.env.GOOGLE_CLIENT_ID === 'placeholder_client_id') {
                console.warn("Using placeholder Google Client ID - Skipping robust verification");
                return { getPayload: () => jwt.decode(credential) };
            }
            throw err;
        });

        const payload = ticket.getPayload();
        const { sub, email, name } = payload; // sub is the google user ID

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // If user exists but sign up via local originally, we could link.
            if (user.authProvider !== 'google') {
                user.googleId = sub;
                // Keep authProvider as local, or update if we prefer strict sync
                await user.save();
            }
        } else {
            // Create a new user
            user = new User({
                name: name || 'Google User',
                email,
                authProvider: 'google',
                googleId: sub
            });
            await user.save();
        }

        // Sign JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (err) {
        console.error('[POST /auth/google] ERROR:', err);
        res.status(500).json({ error: 'Server error during Google authentication' });
    }
});

module.exports = router;
