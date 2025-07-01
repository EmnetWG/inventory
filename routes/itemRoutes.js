const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authenticateUser = require('../middlewares/requireLogin')
const authorizePermission = require('../middlewares/authorizePermission');

router.post('/items', authenticateUser, authorizePermission('admin'), itemController.createItem);

router.get('/items', authenticateUser, itemController.getAllItems);
router.delete('/items/:id', authenticateUser, authorizePermission('admin'), itemController.deleteItem);

router.put('/items/:id', authenticateUser, authorizePermission('admin'), itemController.updateItem);


module.exports = router;
