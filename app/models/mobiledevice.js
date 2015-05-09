module.exports = function(sequelize, DataTypes) {

  var mobiledevices = sequelize.define('mobiledevices', {
    android_device_id: { type: DataTypes.STRING, allowNull: false, unique: true},
    user_id: {type: DataTypes.UUID, allowNull: false, unique: true}
  });

  return mobiledevices;
};
