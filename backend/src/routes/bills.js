const express = require('express');
const router = express.Router();
const { getBills, saveBill } = require('../controllers/billsController');

router.get('/', getBills);
router.post('/', saveBill);

module.exports = router;
