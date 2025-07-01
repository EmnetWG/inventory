const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authorizePermission = require('../middlewares/authorizePermission');
const authenticateUser = require('../middlewares/requireLogin')

router.get('/users', authenticateUser, userController.getAllUsers);
router.get('/users/me', authenticateUser, userController.showMe)

router.get('/users/:id', authenticateUser, userController.getUserById);
router.put('/users/:id', authenticateUser, userController.updateUser);
router.patch('/users/:id/resetPassword', authenticateUser, authorizePermission('admin'), userController.resetPassword);
router.delete('/users/:id', authenticateUser, authorizePermission('admin'), userController.deleteUser);
//router.patch('users/:id/resetPassword', (req, res) => {
//    console.log("reset password hit")
//    res.json({message: "You reached rpr"})
//})

module.exports = router;
