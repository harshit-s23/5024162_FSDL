const express = require('express');
const router = express.Router();
const { getDashboard, getCarbonFactors } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getDashboard);
router.get('/factors', getCarbonFactors);

module.exports = router;
