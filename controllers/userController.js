//const { User } = require('../models');
const db = require('../models/Index');
const User = db.User
 // Adjust path if needed
const bcrypt = require('bcrypt');
//  GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

//  GET user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'role']
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

// routes/userRoutes.js or a similar file
exports.showMe=async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json(req.session.user); // should include id, email, role
};

exports.updateUser = async (req, res) => {
  try {
    const { username, password, role } = req.body; // role optional here

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (password) {
      const bcrypt = require('bcryptjs');
      user.password = await bcrypt.hash(password, 10); // hash password
    }
    if (role) user.role = role;

    await user.save();
    res.json({ message: 'User updated successfully', user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};


/*
//  PUT update user (email and role)
exports.updateUser = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role || user.role;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};
*/
//  DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

exports.resetPassword = async (req, res) => {
//  const userId = req.params.id;

  try {
   
    const user = await User.findByPk(req.params.id);
//console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
       const hashedPassword = await bcrypt.hash('1234', 10); // Always hash passwords
       user.password = hashedPassword;
       await user.save()
    

    res.json({ message: 'Password has been reset to 1234' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


