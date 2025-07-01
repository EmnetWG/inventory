
/// controllers/itemTypeController.js
//const ItemType = require('../models/ItemType');

const db = require('../models/Index');
const ItemType = db.ItemType;


exports.getAllItemTypes = async (req, res) => {
  try {
    const types = await ItemType.findAll();
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item types' });
  }
};

exports.addItemType = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const newType = await ItemType.create({ name });
    res.status(201).json({ message: 'Item type added', id: newType.id });
  } catch (err) {

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Item type name already exists.' });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Edit (Update) an existing item type
exports.updateItemType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const itemType = await ItemType.findByPk(id);
    if (!itemType) {
      return res.status(404).json({ error: 'Item type not found' });
    }

    itemType.name = name;
    await itemType.save();

    res.json({ message: 'Item type updated', id: itemType.id });
  } catch (err) {

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Item type name already exists.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error updating item type' });
  }
};

// Delete an item type
/*
exports.deleteItemType = async (req, res) => {
  const { id } = req.params;

  try {
    const itemType = await ItemType.findByPk(id);
    if (!itemType) {
      return res.status(404).json({ error: 'Item type not found' });
    }

    await itemType.destroy();
    res.json({ message: 'Item type deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting item type' });
  }
};

*/

exports.deleteItemType = async (req, res) => {
  const id = req.params.id;

  try {
    // Check if any items reference this item type
    const itemCount = await db.Item.count({
      where: { itemType: id }
    });

    if (itemCount > 0) {
      return res.status(400).json({
        message: `Cannot delete: There are ${itemCount} item(s) using this item type.`
      });
    }

    // Proceed with deletion
    const result = await ItemType.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: 'Item type not found.' });
    }

    res.json({ message: 'Item type deleted successfully.' });
  } catch (error) {
    console.error("Error deleting item type:", error);
    res.status(500).json({ message: 'Server error during deletion.', error });
  }
};
