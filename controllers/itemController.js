const { Item } = require('../models/Index');
const db = require('../models/Index');
//const ItemType = db.ItemType;

exports.createItem = async (req, res) => {
  try {
    const item = await db.Item.create(req.body);
    res.status(201).json({ message: 'Item created', item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving item', error:error.message});
  }
}
const { Op } = require("sequelize");

exports.getAllItems = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const { floor, location, itemType, full, search } = req.query;

  const whereClause = {};

  if (floor) whereClause.floor = {[Op.like]:`%${floor}%`};
  if (location) {
    whereClause.location = {[Op.like]:`%${location}%`};
  }
  if (itemType) {whereClause.itemType = itemType; }

  if (search) {
    const searchTerm = `%${search.toLowerCase()}%`;
    whereClause[Op.or] = [
      { location: { [Op.like]: searchTerm } },
      { floor: { [Op.like]: searchTerm } },
      { serialNumber: { [Op.like]: searchTerm } },
      { manufacturer: { [Op.like]: searchTerm } },
      { model: { [Op.like]: searchTerm } },
      // Add more fields as needed
    ];
  }

  try {
    const queryOptions = {
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.ItemType,
          as: "listItemType",
           attributes: [
      ['name', 'itemName'],
      ['id', 'itemid']
    ]
        }
      ],
    };

    if (full !== 'true') {
      queryOptions.limit = limit;
      queryOptions.offset = offset;
    }

    const items = await Item.findAndCountAll(queryOptions);

    res.json({
      total: items.count,
      items: items.rows
    });
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ message: 'Error retrieving items', error });
  }
};


exports.deleteItem = async (req, res) => {
    try {
      const item = await db.Item.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
  
      await item.destroy();
      res.json({ message: 'Item deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting item', error });
    }
  };
  
  exports.updateItem = async (req, res) => {
    try {
      const item = await db.Item.findOne({where:{id:req.params.id},  include:[{model:db.ItemType, as:"listItemType", 
        // attributes: [[Sequelize.col("name"), "itemName"],
       //   [Sequelize.col("id"), "itemid"]],}]
       attributes: [
      ['name', 'itemName'],
      ['id', 'itemid']
    ] 
        }]});
      if (!item) return res.status(404).json({ message: 'Item not found' });
  
      await item.update(req.body);
      res.json({ message: 'Item updated', item });
    } catch (error) {
      res.status(500).json({ message: 'Error updating item', error });
    }
  };
  