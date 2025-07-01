const db = require('../models/Index');
const User = db.User;

const bcrypt = require('bcrypt');
// const { User } = require('../models');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

 // req.session.userId = user.id;

req.session.user = {
      id: user.id,
      role: user.role,
      username: user.username
    };

  res.json({ message: 'Logged in successfully', role: user.role  });
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered' });
};

// controllers/authController.js

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};
