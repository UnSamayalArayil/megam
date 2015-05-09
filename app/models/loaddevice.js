module.exports = function(sequelize, DataTypes) {

  var loaddevices = sequelize.define('loaddevices', {
    load_device_id: { type: DataTypes.STRING, allowNull: false, unique: true},
    item_name:  DataTypes.STRING,
    alert_percentage: DataTypes.INTEGER,
    initial_weight: { type: DataTypes.INTEGER, allowNull: false},
    notification_Sent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
  });

  return loaddevices;
};
