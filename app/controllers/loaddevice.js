var express = require('express'),
  db = require('../models'),
  _ = require('lodash-node');

function transform(loaddevices) {

  return _.map(loaddevices, function(loaddevice) {
    return {
      device_id: loaddevice.load_device_id,
      item_name: loaddevice.item_name,
      current_percentage: loaddevice.alert_percentage
    };
  });
}

module.exports = function(app) {

  app.post('/list', function(req, res) {
    db.mobiledevices.find({
        where: {
          user_id: req.body.user_id
        }
      })
      .then(function() {
        db.loaddevices.findAll()
          .then(function(loaddevices) {
            res.status(200).json({
              items: transform(loaddevices)
            });
          })
          .catch(function(err) {
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

  app.post('/newdevice', function(req, res) {
    var updateFieldsOfDevice = {
        item_name: req.body.item_name,
        alert_percentage: req.body.alert_percentage,
      },
      options = {
        where: {
          load_device_id: req.body.device_id
        }
      };

    db.loaddevices.update(updateFieldsOfDevice, options)
      .then(function(loaddevice) {
        res.status(201).json({
          message: "Load Device registered sucessfully."
        });
      })
      .catch(function(err) {
        res.status(500).json({
          message: err.message
        });
      });
  });
};
