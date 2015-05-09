module.exports = function(sequelize, DataTypes) {

  var devices = sequelize.define('devices', {
    android_device_id: { type: DataTypes.STRING, allowNull: false, unique: true},
    user_id: {type: DataTypes.UUID, allowNull: false, unique: true}
  });

  return devices;
};
