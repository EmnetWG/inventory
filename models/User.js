// models/User.js
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values:['user', 'admin'],
        defaultValue: 'user',
        
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      timestamps:true
    },
  {

hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  // Correct instance method for comparing passwords
  User.prototype.comparePassword = async function(candidatePassword) {
    if (!candidatePassword) {
      throw new Error('Password is undefined or not provided');
    }
    return await bcrypt.compare(candidatePassword, this.password);
  };


    return User;
  };
  