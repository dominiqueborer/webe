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

/* GET users listing. */
router.get('/', function (req, res) {
    //ToDO: Implement Admin Role check

    (async () => {

        try {
            let users = await rmDB.getUsers(1, 10);            
            res.render('userList', { "users": users, "user": req.user });

        } catch (err) {            
            res.status(500).send("Error loading User List " + err.toString());
        }

    })();
});

module.exports = router;
