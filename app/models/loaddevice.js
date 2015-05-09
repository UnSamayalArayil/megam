module.exports = function(sequelize, DataTypes) {

  var loaddevices = sequelize.define('loaddevices', {
    load_device_id: { type: DataTypes.STRING, allowNull: false, unique: true},
    item_name:  DataTypes.STRING,
    alert_percentage: DataTypes.INTEGER
  });

  return loaddevices;
};
