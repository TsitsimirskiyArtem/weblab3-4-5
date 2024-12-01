// clip.route.js
const express = require('express');
const router = express.Router();
const clipController = require('./clip.controller');

// Define routes for each CRUD operation
router.get('/', clipController.getAllClips);
router.get('/:id', clipController.getClipById);
router.post('/', clipController.createClip);
router.put('/:id', clipController.updateClip);
router.delete('/:id', clipController.deleteClip);

module.exports = router;
