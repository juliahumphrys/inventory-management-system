function getItemByNumber(itemNumber, callback) {
    const sql = `
      SELECT 
        i.itemNumber, i.itemName, i.itemCategory, i.itemQuantity, i.itemLocation, i.itemPicture,
        a.itemCost, a.itemCondition, a.itemDescription,
        h.dateLastUsed, h.showLastUsed
      FROM 
        itemInfo i
      LEFT JOIN 
        advancedItemInfo a ON i.itemNumber = a.itemNumber
      LEFT JOIN 
        historicalItemInfo h ON i.itemNumber = h.itemNumber
      WHERE 
        i.itemNumber = ?
    `;
    db.get(sql, [itemNumber], callback);
  }
  
  module.exports = { getItemByNumber };
  