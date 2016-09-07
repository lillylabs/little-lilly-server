var photos = require('../app/photos.js');
var letters = require('../app/letters.js');

photos.importPhotosForAllUsers().then(function() {
  return letters.moveLetterToInProgressForAllUsers();
});
