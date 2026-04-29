const express = require('express');
const router = express.Router();
const { getInventory, addOrUpdateItem, deleteItem } = require('../controllers/inventoryController');

router.get('/', getInventory);
router.post('/', addOrUpdateItem);
router.delete('/:id', deleteItem);

module.exports = router;
