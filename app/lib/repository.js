var db = require('../models'),
  notify = require('../lib/notify'),
  util = require('util'),
  _ = require('lodash-node');

function notifyDevice(loaddevice) {
  db.mobiledevices.findAll()
    .then(function(mobiledevices) {
      _.each(mobiledevices, function(device) {
        notify(device.android_device_id, {
            device_id: loaddevice.load_device_id
          }, 'new_device')
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
      notifyDevice(loaddevice); //refactor: remove this from here!
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

module.exports.addDeviceAndNotify = addDeviceAndNotify;
