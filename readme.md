=== Firebase Server ===

Maintanance jobs for Little Lilly. 

* Import photos from Instagram
  * To test the import job locally run: `heroku local:run node jobs/import-photos.js`
  * To run on the server against production database make sure the app is pushed to production then: `heroku run node jobs/import-photos.js`
* Move current letter to in progress and create new letter
  * Import photos if you think users have done many changes lately
  * To test the import job locally run: `heroku local:run node jobs/new-month.js`
  * To run on the server against production database make sure the app is pushed to production then: `heroku run node jobs/new-month.js`
* Move in progress letter to archive and give it a shipment date
  * Update date in `jobs/shipped.js`
  * To test the import job locally run: `heroku local:run node jobs/shipped.js`
  * To run on the server against production database make sure the app is pushed to production then: `heroku run node jobs/shipped.js`