var express = require('express'),
  db = require('../models'),
  notify = require('../lib/notify'),
  bodyParser = require('body-parser');

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.post('/test', function(req, res) {
    db.devices.find(req.body.id)
      .then(function(device) {

        notify(device.id, 'ping!', 'test')
          .then(function(result) {
            res.status(200).json({
              message: result
            });
          })
          .fail(function(err) {
            res.status(500).json({
              message: err.message
            });
          });

      })
      .catch(function(err) {
        res.status(500).json({
          message: err.message
        });
      });
  });
};
