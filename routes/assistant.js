const express = require('express');
const router = express.Router();
const AssistantController = require('../controllers/AssistantController');
const assitant = new AssistantController();

router.use('/conversation', assitant.callWatson);

module.exports = router;
