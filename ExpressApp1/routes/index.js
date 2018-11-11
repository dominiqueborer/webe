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
var passport = require('passport');
require('../config/passport-config');

var config = {
    user: 'randomiusmemius',
    password: '1234',
    //server: 'WIN-QKFGRT8C621',
    server: 'localhost',
    database: 'randomiusmemiusApp'
};
sql.on('error', err => {
    // ... error handler
})
////router.use(favicon(__dirname + './public/favicon.ico'));
//router.use(favicon('./public/favicon.ico'));
//router.use(logger('dev'));
//router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({ extended: false }));
//router.use(cookieParser());
//router.use(express.static(path.join(__dirname, 'public')));

//router.use(require('morgan')('combined'));
//router.use(require('cookie-parser')());
//router.use(require('body-parser').urlencoded({ extended: true }));
//router.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));



//router.use(passport.initialize());
//router.use(passport.session());
//passport.initialize();
//passport.session();






/* GET home page. */
router.get('/', function (req, res) {
    //dbtest.messageHandler();
    //let resultTable = dbtest.getRDataTableRows();

    (async () => {      

        try {
            let pool = await new sql.ConnectionPool(config);
            await pool.connect();
            let rDataEntries = "";
            let result1 = await pool.request()
                //.input('input_parameter', sql.Int, value)
                .query('select * from rDataTable');
            await result1["recordset"].forEach(function (element) {
                rDataEntries += element["randomData"];
            });

            let data = {
                'item1': 'http://public-domain-photos.com/free-stock-photos-1/flowers/cactus-76.jpg',
                'item2': 'http://public-domain-photos.com/free-stock-photos-1/flowers/cactus-77.jpg',
                'item3': 'http://public-domain-photos.com/free-stock-photos-1/flowers/cactus-78.jpg',
                'rDateTime': dtr.myDateTime(),
                'allEntries': rDataEntries//rmDB.getSqlQueryResponse(config, 'select * from rDataTable')//getSqlQuery()
                
            }
            res.render('index', { title: 'Randomius Memius', "data": data, "user": req.user });


        } catch (err) {
            // ... error checks
            const reason = new Error('mom is not happy');
            reject(reason);
        }

    })();



});

module.exports = router;
