var express = require('express'),
  db = require('../models'),
  bodyParser = require('body-parser'),
  uuid = require('node-uuid');

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));

  app.post('/register', function(req, res) {
    var userId = uuid.v4();
    var deviceObject = {
      android_device_id: req.body.id,
      user_id: userId
    };

    db.devices.create(deviceObject)
      .then(function(device) {
        res.status(201).json({
          user_id: userId,
          message: "Device registered sucessfully."
        });
      })
      .catch(function(err) {
        res.status(500).json({
          message: err.message
        });
      });
  });
};
