/*jslint node: true */

'use strict';

var serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBSE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FIREBASE_X509_CERT_URL,
}
var databaseUrl = process.env.FIREBASE_DATABASE_URL;

var firebase = require("firebase");
firebase.initializeApp({
  serviceAccount: serviceAccount,
  databaseURL: databaseUrl
});

var db = firebase.database();

function fetchUsers() {
  return db.ref("users").once("value");
}

function savePhotos(uid, photos) {
  var ref = db.ref("users/" + uid + "/letter/photos");
  return ref.set(photos);
}

function saveInProgressLetter(uid, letter) {
  var ref = db.ref("users/" + uid + "/letter_in_progress");
  return ref.set(letter);
}

function saveLetter(uid, letter) {
  var ref = db.ref("users/" + uid + "/letter");
  return ref.set(letter);
}

module.exports = {
  fetchUsers: fetchUsers,
  savePhotos: savePhotos,
  saveLetter: saveLetter,
  saveInProgressLetter: saveInProgressLetter
};