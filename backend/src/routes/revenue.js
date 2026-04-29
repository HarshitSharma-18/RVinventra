const express = require('express');
const router = express.Router();
const { getLast7DaysRevenue } = require('../controllers/revenueController');

router.get('/last-7-days', getLast7DaysRevenue);

module.exports = router;
