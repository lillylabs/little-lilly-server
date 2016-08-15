var q = require('q');
var _ = require('underscore');
var moment = require('moment');
var InstagramAPI = require('instagram-api');

var data = require('./data.js');

function isSelected(photo) {
    var TAGS = ['lillygram', 'lillygram'];
    var isSelected = false;
    _.each(TAGS, function (TAG) {
        isSelected = _.indexOf(photo.tags, TAG) > -1;
    });
    return isSelected;
}

function isWithinTimeframe(timeframe, photo) {

    timeframe = {
        start: moment(timeframe.start),
        end: moment(timeframe.end)
    };

    photo = moment(photo.created_time * 1000);

    return photo.isBetween(timeframe.start, timeframe.end, 'day', '[]');
}

function isNewerThanTimeFrameStart(timeframe, photo) {
    timeframe = {
        start: moment(timeframe.start)
    };

    photo = moment(photo.created_time * 1000);

    return photo.isAfter(timeframe.start, 'day', '[]');
}

function filterPhotos(photos, timeframe) {
    var filtredPhotos = [];
    _.each(photos, function (photo) {
        if (isSelected(photo) && isWithinTimeframe(timeframe, photo)) {
            filtredPhotos.push(photo);
        }
    });
    return filtredPhotos;
}

function fetchPhotos(params) {

    var options = {

    };

    if (params.pagination && params.pagination.next_max_id) {
        options.max_id = params.pagination.next_max_id;
    }

    if (params.pagination && params.pagination.next_min_id) {
        options.min_id = params.pagination.next_min_id;
    }


    console.log("Instagram: Fetch photos with options ", options);

    params.ig.userSelfMedia(options).then(function (response) {

        if (!response.data) {
            console.log("Instagram: No response data, ", response);
            return;
        } else {
            console.log("Instagram: Response data");
            console.log(response.pagination);
        }

        if (!params.photos) {
            params.photos = response.data;
        } else {
            params.photos = params.photos.concat(response.data);
        }

        if (response.pagination && response.pagination.next_url && isNewerThanTimeFrameStart(params.timeframe, params.photos[params.photos.length - 1])) {
            console.log("Instagram: Fetch more photos");
            params.pagination = response.pagination;
            fetchPhotos(params);
        } else {
            console.log("Instagram: Photos fetched, ", params.photos.length);
            var filteredPhotos = filterPhotos(params.photos, params.timeframe).reverse();
            console.log("Instagram: Photos after filter, ", filteredPhotos.length);
            params.deferred.resolve(filteredPhotos);
        }
    });
}

function fetchPhotosForUser(user) {
    var account = _.first(_.toArray(user.profile.ig_accounts));

    var ig = new InstagramAPI(account.token);

    var deferred = q.defer();

    var params = {
        ig: ig,
        timeframe: user.letter.timeframe,
        deferred: deferred
    };

    fetchPhotos(params);

    return deferred.promise;
}

data.fetchTestUser().then(function (userSnap) {
    //fetchPhotosForUser(userSnap.val());
})

data.fetchUsers().then(function (users) {

    console.log("Users fetched");

    var promises = [];

    _.each(users.val(), function (user, uid) {
        console.log(uid);
        var promise = fetchPhotosForUser(user).then(function (photos) {
            return data.savePhotos(uid, photos).then(function () {
                return "Saved " + photos.length + " photos for user " + uid;
            });
        });

        promises.push(promise);

    });

    return q.all(promises).then(function (results) {
        _.each(results, function (result) {
            console.log(result);
        })
    }).catch(function (error) {
        console.log("ERROR", error);
    });
})
