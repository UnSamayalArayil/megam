module.exports = function(config) {

  function writeSeries(newSeries) {
    config.influxClient.writeSeries(newSeries, {}, function(err) {
      if (err) {
        console.error("Cannot write data", err);
      }
    });
  }
  return {
    writeSeries: writeSeries
  };
};
