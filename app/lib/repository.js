var db = require('../models'),
notify = require('../lib/notify');

function notify(loaddevice){
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

function addDeviceAndNotify(series) {
  db.loaddevices.findOrCreate({
      where: {
        load_device_id: series.name
      }
    })
    .spread(function(result, created) {
      var loaddevice = result.get();
      if (created) {
        console.log(util.format('Device %s added successfully', loaddevice.load_device_id));
        notify(loaddevice);
      }
    })
    .catch(function(err) {
      console.error(err.message);
    });
}

module.exports.addDeviceAndNotify = addDeviceAndNotify;
