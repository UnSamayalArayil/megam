var zmq = require('zmq'),
  util = require('util'),
  sock = zmq.socket('pull'),
  repository = require('../lib/repository');


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
