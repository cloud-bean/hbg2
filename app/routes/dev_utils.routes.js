'use strict';

var development = require('../controllers/dev_utils.server.controller');


module.exports = function (app) {
    // developer
    app.get('/app/admin/development/log/list', development.getLogList);
    app.post('/app/admin/development/log/text', development.getLogText);

    app.get('/app/admin/development/db/backupList', development.getDBBackupList);
    app.get('/admin/development/db/download/:file', development.downloadDBBackup);
    //app.post('/app/admin/development/db/restore', development.restoreDB);
    app.get('/app/admin/development/db/backup', development.backupDB);

    app.get('/app/admin/development/config', development.getConfigs);
    app.get('/app/admin/development/build/log', development.getBuildLog);
};
