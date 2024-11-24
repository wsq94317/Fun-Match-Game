const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

//register
router.post('/register', async (req, res) => {
    const {email, password, nickname} = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashedPassword, nickname});
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login

router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({error: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials'});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({ token, nickname: user.nickname, score: user.score, level: user.level });
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

module.exports = router;


