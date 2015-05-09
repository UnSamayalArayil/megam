var express = require('express'),
  gcm = require('node-gcm'),
  Q = require('q'),
  sender = new gcm.Sender(process.env.GOOGLE_API_KEY),
  message = new gcm.Message();

module.exports = function(registrationId, notificationMessage, notificationType) {
  return Q.promise(function(resolve, reject) {

    message.addData('message', notificationMessage);
    message.addData('type', notificationType);

    sender.send(message, [registrationId], function(err, result) {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
