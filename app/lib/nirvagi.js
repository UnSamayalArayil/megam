var zmq = require('zmq'),
  util = require('util'),
  sock = zmq.socket('pull'),
  _ = require('lodash-node'),
  repository = require('../lib/repository');

setInterval(function() {
  repository.getAllUnRegisteredLoadDevices().then(function(loaddevices) {
    _.each(loaddevices, function(loaddevice) {
      var notificationMessage = {
          device_id: loaddevice.load_device_id
        },
        notificationType = 'new_device';
      repository.notifyDevice(loaddevice, notificationMessage, notificationType); //refactor: remove this from here!
    });
  });
}, 300000);

module.exports = function(config) {
  var eventRepository = require('../lib/eventRepository')(config);

  sock.connect(config.nirvagi);
  console.log(util.format('Talking to nirvagi on %s', config.nirvagi));

  sock.on('message', function(data) {
    var series = JSON.parse(data.toString());
    repository.addDeviceAndNotify(series);
    repository.updateWeightTillRegister(series);
    repository.alertDevice(series);

    var newSeries = {};
    newSeries[series.name] = [{
      weight: series.weight
    }];
    eventRepository.writeSeries(newSeries);
  });
};
