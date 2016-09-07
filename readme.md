=== Firebase Server ===

Maintanance jobs for Little Lilly. 

* Import photos from Instagram
  * To test the import job locally run: `heroku local:run node jobs/import-photos.js`
* Move current letter to in progress and create new letter
  * To test the import job locally run: `heroku local:run node jobs/new-month.js`
* Move in progress letter to archive and give it a shipment date
  * To test the import job locally run: `heroku local:run node jobs/shipped.js`