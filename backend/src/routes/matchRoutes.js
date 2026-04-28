const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.post('/', matchController.createMatch);
router.get('/open', matchController.listOpenMatches);
router.post('/:id/join', matchController.joinMatch);

// Novas rotas para resultados
router.get('/:id', matchController.getMatchDetails);
router.post('/:id/result', matchController.submitResult);

module.exports = router;
