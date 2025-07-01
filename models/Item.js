//const ItemType = require("./ItemType");

//const { Sequelize, DataTypes } = require('sequelize');
//const sequelize = require('../config/sequelize');
//const bcrypt = require('bcryptjs');
//const ItemType = require('../models/ItemType')(sequelize, DataTypes);
//const db = require('./models')


module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('Item', {
      location: DataTypes.STRING,
      floor: DataTypes.STRING,
    //  itemType: DataTypes.INTEGER,
      manufacturer: DataTypes.STRING,
      model: DataTypes.STRING,
      formFactor: DataTypes.STRING,
      ram: DataTypes.STRING,
      cpuSpeed: DataTypes.STRING,
      operatingSystem: DataTypes.STRING,
      hdSize: DataTypes.STRING,
      category:DataTypes.STRING,
      status:DataTypes.STRING,
      size:DataTypes.STRING,
      firmwareVersion:DataTypes.STRING,
      toner:DataTypes.STRING,
      portCount:DataTypes.STRING,
      isManaged:DataTypes.STRING,
      resolution:DataTypes.STRING,
      storageType:DataTypes.STRING,
      copySpeed:DataTypes.STRING,
      serialNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },

       itemType: {
      type: DataTypes.INTEGER,
      allowNull: false,
     /* 
      references: {
        model: db.ItemType,
        key: 'id',
      },
      */
    },
      additionalInfo: DataTypes.TEXT
    }, {
  timestamps:true});
  

Item.associate = function(models ) {
  Item.belongsTo(models.ItemType, {
        foreignKey: 'itemType',
        as:'listItemType'
    })
}

    return Item;
  };
  