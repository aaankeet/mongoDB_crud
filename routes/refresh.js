const refreshTokenController = require('../controllers/refreshTokenController');
const express = require('express');
const router = express.Router();

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;
