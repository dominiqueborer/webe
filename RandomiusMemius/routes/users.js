'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var dbtest = require('../modules/dbtest');
var dtr = require('../modules/testmodule');
//var rmDB = require('../modules/randomiusmemiusDB');
const sql = require('mssql');
var rmDB = require('../modules/randomiusmemiusDB');
var passport = require('passport');
require('../config/passport-config');
var rmGlobalConstants = require('../modules/randomiusMemiusGlobalConstants');
var winston = require('../modules/logging');

/* GET users listing. */
router.get('/', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {

    (async () => {

        try {

            let userAdminRole = await rmDB.hasAdminRole(req.user.id);
            if (userAdminRole = 1 ) {

                let users = await rmDB.getUsers(1, 10);
                res.render('userList', { "users": users, "user": req.user });
            } else {
                // Not admin user
                res.render('index', { "user": req.user });
            }

        } catch (err) {
            let msgErr = "Error loading User List " + err.toString();
            winston.error(msgErr);
            res.status(500).send(msgErr);
        }

    })();
});
/* Post users listing. Will be invoked, if user gets banned / de banned */
router.post('/', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    //ToDO: Implement Admin Role check

    (async () => {

        try {
            let userAdminRole = await rmDB.hasAdminRole(req.user.id);
            if (userAdminRole = 1 && req.body.userId) {
                await rmDB.toggleUserBan(req.body.userId);

                let users = await rmDB.getUsers(1, 10);
                res.render('userList', { "users": users, "user": req.user });
            } else {
                // Not admin user
                res.redirect("/");
                //res.render('index', { "user": req.user });
            }

        } catch (err) {
            let msgErr = "Error loading User List " + err.toString();
            winston.error(msgErr);
            res.status(500).send(msgErr);
        }

    })();
});

module.exports = router;
