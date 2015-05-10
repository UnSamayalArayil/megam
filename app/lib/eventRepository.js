var util = require('util'),
  Q = require('q'),
  _ = require('lodash-node');

module.exports = function(config) {

  function writeSeries(newSeries) {
    config.influxClient.writeSeries(newSeries, {}, function(err) {
      if (err) {
        console.error("Cannot write data", err);
      }
    });
  }

  function getWeight(seriesName) {
    return Q.promise(function(resolve, reject) {
      var query = util.format('SELECT weight FROM %s limit 1', seriesName);
      config.influxClient.query(query, function(err, result) {
        if (err) {
          reject("Cannot read data", err);
        }

        var obj = _.zipObject(result[0].columns, result[0].points[0]);
        resolve(obj.weight);
      });
    });
  }
  return {
    writeSeries: writeSeries,
    getWeight: getWeight
  };
};
