var q = require('q');
var _ = require('underscore');
var moment = require('moment');
var data = require('./data.js');

function moveLetterToInProgressForUser(uid, letter, defaultGreeting) {
  var lastMonth = moment().month() - 1;
  var letterEndMonth = moment(letter.timeframe.end).month();

  if (letterEndMonth === lastMonth) {
    console.log("Move letter");
    return data.saveInProgressLetter(uid, letter).then(function() {
      var format = "YYYY-MM-DD";
      var start = moment().date(1);
      var end = moment().date(1).add(1, 'month').subtract(1, 'days');

      letter.timeframe.start = start.format(format);
      letter.timeframe.end = end.format(format);
      letter.name = moment(letter.timeframe.start).format("MMMM YYYY");
      letter.photos = [];

      if (defaultGreeting) {
        letter.greeting = defaultGreeting;
      } else {
        letter.greeting = null;
      }

      return data.saveLetter(uid, letter).then(function() {
        return "Created new letter and moved current letter to in progress for user " + uid;
      });
    });
  } else {
    return "Letter for user " + uid + " will not be moved";
  }
}

function moveLetterToInProgressForAllUsers() {
  data.fetchUsers().then(function(users) {
    console.log("Users fetched");

    var promises = [];

    _.each(users.val(), function(user, uid) {
      var promise = moveLetterToInProgressForUser(uid, user.letter, user.profile.greeting);

      promises.push(promise);
    });

    return q.all(promises).then(function(results) {
      _.each(results, function(result) {
        console.log(result);
      });
    }, function(error) {
      console.log("ERROR", error);
    });
  });
}

function moveInPogressLetterToArchiveForUser(uid, letter, shipmentDate) {
  if (letter) {
    letter.shipment_date = shipmentDate;
    return data.addLetterToArchive(uid, letter).then(function() {
      return data.removeInProgressLetter(uid);
    }).then(function() {
      return "Moved in progress letter for user " + uid + " to archive";
    });
  } else {
    return "User " + uid + " has no letter in progress";
  }
}

function moveInPogressLetterToArchiveForAllUsers(shipmentDate) {
  data.fetchUsers().then(function(users) {
    console.log("Users fetched");

    var promises = [];

    _.each(users.val(), function(user, uid) {
      var promise = moveInPogressLetterToArchiveForUser(uid, user.letter_in_progress, shipmentDate);

      promises.push(promise);
    });

    return q.all(promises).then(function(results) {
      _.each(results, function(result) {
        console.log(result);
      });
    }, function(error) {
      console.log("ERROR", error);
    });
  });
}

module.exports = {
  moveLetterToInProgressForAllUsers: moveLetterToInProgressForAllUsers,
  moveInPogressLetterToArchiveForAllUsers: moveInPogressLetterToArchiveForAllUsers
};
