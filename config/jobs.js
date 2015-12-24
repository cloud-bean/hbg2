'use strict';
var job = require('../app/controllers/dev_utils.server.controller');
var config = require('./config');

module.exports = function () {
    console.log('cron job is running');
    var CronJob = require('cron').CronJob;

    // backup database everyday at 20:00
    new CronJob(config.scheduleTime.everyDayAtTwentyClock, function() {
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

    // backup database everyday at 20:00
    new CronJob(config.scheduleTime.everyHour, function() {
            console.log('auto generate dashboard analysis data' , new Date());

            job.generateDashboardAnalysisData(function (text) {
                console.log(text);
                console.log('generate dashboard analysis finished!');
            });
        }, function() {
            console.log('err when generate dashboard analysis');
        },
        true //start now
    );

};
