/// routes/itemTypeRoutes.js
const express = require('express');
const router = express.Router();
const itemTypeController = require('../controllers/itemTypeController');
const authorizePermission = require('../middlewares/authorizePermission');
const authenticateUser = require('../middlewares/requireLogin')

router.get('/item-types', authenticateUser, itemTypeController.getAllItemTypes);
router.post('/item-types', authenticateUser, authorizePermission('admin'), itemTypeController.addItemType);

// PUT (update) an item type
router.put('/item-types/:id', authenticateUser, authorizePermission('admin'), itemTypeController.updateItemType);

// DELETE an item type
router.delete('/item-types/:id', authenticateUser, authorizePermission('admin'), itemTypeController.deleteItemType);

module.exports = router;


