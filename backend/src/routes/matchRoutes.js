const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.post('/', matchController.createMatch);
router.get('/open', matchController.listOpenMatches);
router.post('/:id/join', matchController.joinMatch);

module.exports = router;
