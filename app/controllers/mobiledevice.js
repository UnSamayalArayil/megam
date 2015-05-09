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
    var deviceObject = {
      android_device_id: req.body.id,
      user_id: uuid.v4()
    };

    db.mobiledevices.create(deviceObject)
      .then(function(mobiledevice) {
        res.status(201).json({
          user_id: mobiledevice.user_id,
          message: "Mobile registered sucessfully."
        });
      })
      .catch(function(err) {
        res.status(500).json({
          message: err.message
        });
      });
  });
};
