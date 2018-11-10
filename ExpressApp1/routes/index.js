'use strict';
var express = require('express');
var router = express.Router();
//var dbtest = require('../modules/dbtest');
var dtr = require('../modules/testmodule');
//var rmDB = require('../modules/randomiusmemiusDB');
const sql = require('mssql')

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


/* GET home page. */
router.get('/', function (req, res) {
    //dbtest.messageHandler();
    //let resultTable = dbtest.getRDataTableRows();

    (async () => {      

        try {
            let pool = await sql.connect(config)
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
            res.render('index', { title: 'Express', "data": data });


        } catch (err) {
            // ... error checks
            const reason = new Error('mom is not happy');
            reject(reason);
        }

    })();



});

module.exports = router;
