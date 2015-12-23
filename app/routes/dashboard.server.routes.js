'use strict';

var dashboard = require('../controllers/dashboard.server.controller');
module.exports = function (app) {
    app.get('/app/admin/dashbaord/member', dashboard.getMemberAnalysis);
};
