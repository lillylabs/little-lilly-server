/*jslint node: true */

'use strict';
var firebase = require("firebase");

if ("prod" === process.env.FIREBASE_ENV) {
  firebase.initializeApp({
    serviceAccount: "prod.config.json",
    databaseURL: "https://little-lilly.firebaseio.com"
  });
} else {
  firebase.initializeApp({
    serviceAccount: "test.config.json",
    databaseURL: "https://little-lilly-test.firebaseio.com"
  });
}

var db = firebase.database();

function fetchTestUser() {
  return db.ref("users").child('ayRCeV8tYQUtiqrP8Y7SyI7QHa82').once("value");
}

function fetchUsers() {
  return db.ref("users").once("value");
}

function savePhotos(uid, photos) {
  var ref = db.ref("users/" + uid + "/letter/photos");
  return ref.set(photos);
}

module.exports = {
  fetchUsers: fetchUsers,
  fetchTestUser: fetchTestUser,
  savePhotos: savePhotos
};
