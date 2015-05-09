// Example model


module.exports = function(sequelize, DataTypes) {

  var devices = sequelize.define('devices', {
    id: { type: DataTypes.STRING, allowNull: false}
  });

  return devices;
};
