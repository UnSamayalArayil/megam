var express = require('express'),
  db = require('../models'),
  _ = require('lodash-node'),
  Q = require('q'),
  async = require('async');

function transform(loadDevices, eventRepository) {

  return Q.promise(function(resolve, reject) {
    async.map(loadDevices, function(loadDevice, callback) {
      eventRepository.getWeight(loadDevice.load_device_id).then(function(currentWeight) {
        var currentPercentage = (currentWeight / loadDevice.initial_weight) * 100;
        callback(null, {
          device_id: loadDevice.load_device_id,
          item_name: loadDevice.item_name,
          current_percentage: Math.round(currentPercentage * 100) / 100
        });
      }, function(err) {
        callback(err);
      });
    }, function(err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = function(app, config) {
  var eventRepository = require('../lib/eventRepository')(config);

  app.post('/list', function(req, res) {
    db.mobiledevices.find({
        where: {
          user_id: req.body.user_id
        }
      })
      .then(function() {
        db.loaddevices.findAll()
          .then(function(loaddevices) {
            transform(loaddevices, eventRepository).then(function(items) {
              res.status(200).json({
                items: items
              });
            }, function(err) {
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
      .then(function() {
        res.status(200).json({
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
