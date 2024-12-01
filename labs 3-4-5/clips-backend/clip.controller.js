// clip.controller.js
const Clip = require('./clip.model');

// Get all clips
exports.getAllClips = async (req, res) => {
    try {
        const clips = await Clip.find();
        res.json(clips);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving clips' });
    }
};

// Get a single clip by ID
exports.getClipById = async (req, res) => {
    try {
        const clip = await Clip.findById(req.params.id);
        if (!clip) return res.status(404).json({ message: 'Clip not found' });
        res.json(clip);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving clip' });
    }
};

// Create a new clip
exports.createClip = async (req, res) => {
    const { artist, song, length, views } = req.body;
    const newClip = new Clip({ artist, song, length, views });

    try {
        await newClip.save();
        res.status(201).json(newClip);
    } catch (err) {
        res.status(400).json({ message: 'Error creating clip' });
    }
};

// Update an existing clip by ID
exports.updateClip = async (req, res) => {
    const { artist, song, length, views } = req.body;

    try {
        const clip = await Clip.findByIdAndUpdate(
            req.params.id,
            { artist, song, length, views },
            { new: true }
        );
        if (!clip) return res.status(404).json({ message: 'Clip not found' });
        res.json(clip);
    } catch (err) {
        res.status(400).json({ message: 'Error updating clip' });
    }
};

// Delete a clip by ID
exports.deleteClip = async (req, res) => {
    try {
        const clip = await Clip.findByIdAndDelete(req.params.id);
        if (!clip) return res.status(404).json({ message: 'Clip not found' });
        res.json({ message: 'Clip deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting clip' });
    }
};
