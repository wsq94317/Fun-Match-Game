const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true},
	nickname: { type: String, required: true},
	score: { type: Number, default: 0 },
	level: { type: Number, default: 1},
},{ timestamps: true});

module.exports = mongoose.model('User', UserSchema);
