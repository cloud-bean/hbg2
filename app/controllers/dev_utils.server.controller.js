'use strict';

var config = require('../../config/config');

var fs = require('fs'),
    path = require('path'),
    db_backup_dir = '../../DBBackup/',
    logs_dir = '../../logs',
    logFile= logs_dir + '/system.build.log';

function run_cmd(cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = '';
    fs.writeFileSync(path.join(__dirname, logFile), '', 'utf8');
    child.stdout.on('data', function (buffer) {
        resp += buffer.toString();
        fs.writeFileSync(path.join(__dirname, logFile), resp, 'utf8');
    });
    child.stdout.on('end', function() {
        resp += 'Manage Project Success';
        fs.writeFileSync(path.join(__dirname, logFile), resp, 'utf8');
        callBack (resp);
    });
}

exports.getDBBackupList = function(req,res,next) {
    var p = path.join(__dirname, db_backup_dir);
    fs.readdir(p, function (err, files) {
        if (err) {
            return next(err);
        }

        var result = [];
        if (files ) {
            files.forEach(function (file) {
                if (path.basename(file).indexOf(config.dbName + '_db') > -1) {
                    result.push(file);
                }
            });
        }
        res.json(result);
    });
};
exports.downloadDBBackup = function(req,res,next) {
    var file = path.join(__dirname, db_backup_dir, req.params.file);

    var filename = path.basename(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', 'application/zip, application/octet-stream');

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
};

exports.restoreDB = function(req, res, next) {
    var dbConnection = process.env.DB_CONNECTION;
    var dbAuth = process.env.DB_AUTH;
    if (!dbConnection || !dbAuth) return res.send(400);

    run_cmd( './bin/db_install.sh', [req.body.db, dbConnection, dbAuth], function(text) {
        console.info(text);
        res.send({code: 200, type: 'success'});
    });
};

exports.backupDB = function(req, res, next) {

    var dbConnection = process.env.DB_CONNECTION ;
    if (!dbConnection) return res.send(400);

    run_cmd( './bin/db_backup.sh', [dbConnection, config.dbName], function(text) {
        console.info(text);
        res.send({code: 200, type: 'success'});
    });
};

exports.backup_db_auto = function (callback) {
    var spawn = require('child_process').spawn;
    var child = spawn('./bin/db_backup.sh', [process.env.DB_CONNECTION, config.dbName]);
    var resp = '';
    child.stdout.on('data', function (buffer) {
        resp += buffer.toString();
    });
    child.stdout.on('end', function() {
        resp += 'Manage Project Success';
        if(callback){
            callback(resp);
        }
    });
};

exports.getLogList = function(req, res, next) {
    var p = path.join(__dirname, logs_dir);
    fs.readdir(p, function (err, files) {
        if (err) {
            return next(err);
        }

        var result = [];
        files.forEach(function (file) {
            if (path.extname(file) === '.log' ) {
                result.push(file);
            }
        });
        res.json(result);
    });
};

exports.getLogText = function(req, res, next) {
    var file = path.join(__dirname, logs_dir) + req.body.log;
    fs.readFile(file,'utf8',function (err, data) {
        if (err) {
            return next(err);
        }
        res.send({code: 'success', data: data.replace(/"/g, '\'').replace(/\n/g, '<br>')});
    });
};

exports.getConfigs = function(req, res){
    res.send({code: 'success', data: config});
};

exports.getBuildLog = function(req, res, next){
    var file = path.join(__dirname, logFile);
    fs.readFile(file,'utf8',function (err, data) {
        if (err) {
            return next(err);
        }
        res.send({code: 'success', data: data});
    });
};
