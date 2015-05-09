var db = require('../models'),
  notify = require('../lib/notify'),
  util = require('util'),
  _ = require('lodash-node');

function notifyDevice(loaddevice, notificationMessage, notificationType) {
  db.mobiledevices.findAll()
    .then(function(mobiledevices) {
      _.each(mobiledevices, function(device) {
        notify(device.android_device_id, notificationMessage, notificationType)
          .then(function(result) {
            console.log(result);
          })
          .catch(function(err) {
            console.error(err.message);
          });
      });
    })
    .catch(function(err) {
      console.error(err.message);
    });
}

function addDevice(name, weight) {
  db.loaddevices.create({
      load_device_id: name,
      initial_weight: weight
    })
    .then(function(loaddevice) {
      console.log(util.format('Device %s added successfully', loaddevice.load_device_id));
      var notificationMessage = {
          device_id: loaddevice.load_device_id
        },
        notificationType = 'new_device';
      notifyDevice(loaddevice, notificationMessage, notificationType); //refactor: remove this from here!
    })
    .catch(function(err) {
      console.error(err.message);
    });
}

function addDeviceAndNotify(series) {
  db.loaddevices.find({
    where: {
      load_device_id: series.name
    }
  }).then(function(loaddevice) {
    if (loaddevice === null) {
      addDevice(series.name, series.weight);
    }
  });
}

function alertDevice(series) {
  db.loaddevices.find({
    where: {
      load_device_id: series.name
    }
  }).then(function(loaddevice) {
    if(loaddevice !== null){
      if (series.weight <= loaddevice.initial_weight * loaddevice.alert_percentage / 100) {
        var notificationMessage = {
            device_id: loaddevice.load_device_id,
            item_name: loaddevice.item_name,
            current_percentage: series.weight / 100
          },
          notificationType = 'alert';
        notifyDevice(loaddevice, notificationMessage, notificationType);
      }
    }
  });
}

module.exports.addDeviceAndNotify = addDeviceAndNotify;
module.exports.alertDevice = alertDevice;
