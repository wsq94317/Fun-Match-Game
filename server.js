const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const gameRoutes = require('./routes/game');

const app = express();
app.use(express.json());

// Server static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/game', gameRoutes);



//API routes
const authRoutes = require('./routes/auth');

//Defaults to index
app.get('/', (req,res) => {
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
    res.redirect('/game');
})

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('MongoDB connected'))
    .catch(err=> console.error('Database connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
