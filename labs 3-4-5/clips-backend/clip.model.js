// clip.model.js
const mongoose = require('mongoose');

const clipSchema = new mongoose.Schema({
    artist: { type: String, required: true },
    song: { type: String, required: true },
    length: { type: Number, required: true },
    views: { type: Number, required: true }
});

module.exports = mongoose.model('Clip', clipSchema);
