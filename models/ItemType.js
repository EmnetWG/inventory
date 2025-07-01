// models/ItemType.js

/*
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Adjust path to your Sequelize instance

const ItemType = sequelize.define('ItemType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'item_types', // Optional: matches your table name
  timestamps: false        // Optional: if you're not using createdAt/updatedAt
});

module.exports = ItemType;

*/


// models/ItemType.js
//'use strict';

module.exports = (sequelize, DataTypes) => {
  const ItemType = sequelize.define('ItemType', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    table:'itemtypes',
    timestamps: true
  });


ItemType.associate = function(models ) {
ItemType.hasMany(models.Item, {
     foreignKey: 'itemType',
    as:'listItemType'
}
)
}



  return ItemType;
};
