'use strict';
var job = require('../app/controllers/dev_utils.server.controller');
module.exports = function () {
    console.log('cron job is running');
    var CronJob = require('cron').CronJob;

    // backup database each day
    new CronJob('0 0 0 * * *', function() {
            console.log('auto backup start' , new Date());

            job.backup_db_auto(function (text) {
                console.log(text);
                console.log('auto backup finished!');
            });
        }, function() {
            console.log('err when backup db');
        },
        true //start now
    );

};
