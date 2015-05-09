var zmq = require('zmq'),
  util = require('util'),
  sock = zmq.socket('pull'),
  _ = require('lodash-node');

module.exports = function(config) {
  sock.connect(config.nirvagi);
  console.log(util.format('Talking to nirvagi on %s', config.nirvagi));

  sock.on('message', function(data) {
    var series = JSON.parse(data.toString());

    var newSeries = {};
    _.each(series, function(value, key) {
      newSeries[key] = [{
        weight: value
      }];
    });

    config.influxClient.writeSeries(newSeries, {}, function(err) {
      if (err) {
        console.error("Cannot write data", err);
      }
    });
  });
};
