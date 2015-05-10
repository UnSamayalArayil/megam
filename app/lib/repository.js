var db = require('../models'),
  notify = require('../lib/notify'),
  util = require('util'),
  Q = require('q'),
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

function updateNotification(loaddevice) {
  var updateFieldsOfDevice = {
      notification_sent: true
    },
    options = {
      where: {
        load_device_id: loaddevice.load_device_id,
        notification_sent: false
      }
    };

  return Q.promise(function(resolve, reject) {
    db.loaddevices.update(updateFieldsOfDevice, options)
      .then(function() {
        resolve("Notification sent sucessfully.");
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

function alertDevice(series) {
  db.loaddevices.find({
    where: {
      load_device_id: series.name,
      notification_sent: false
    }
  }).then(function(loaddevice) {
    if (loaddevice !== null && series.weight <= loaddevice.initial_weight * loaddevice.alert_percentage / 100) {
      var notificationMessage = {
          device_id: loaddevice.load_device_id,
          item_name: loaddevice.item_name,
          current_percentage: loaddevice.alert_percentage
        },
        notificationType = 'alert';
      updateNotification(loaddevice).then(function() {
        notifyDevice(loaddevice, notificationMessage, notificationType);
      })
      .catch(function(err) {
        console.error(err.message);
      });
    }
  });
}

module.exports.addDeviceAndNotify = addDeviceAndNotify;
module.exports.alertDevice = alertDevice;
