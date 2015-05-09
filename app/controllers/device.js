var express = require('express'),
  db = require('../models'),
  bodyParser = require('body-parser');

module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.post('/register', function(req, res) {
    db.devices.create(req.body)
      .then(function(device) {
        res.status(201).json({
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
