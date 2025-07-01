const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');
//const ItemType = require('../models/ItemType');
//const Department = require('../models/Department');

const models = {
  ItemType: require('../models/ItemType')(sequelize, Sequelize.DataTypes),
  Item: require('../models/Item')(sequelize, Sequelize.DataTypes),
  User: require('../models/User')(sequelize, Sequelize.DataTypes),
 
  // Add other models here
};
const db = {}
// Run associate if associations are defined
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
    
  }
});

module.exports = models;
