var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
//var dbtest = require('../modules/dbtest');
var dtr = require('../modules/testmodule');
var rmDB = require('../modules/randomiusmemiusDB');
const sql = require('mssql');
var passport = require('passport');
require('../config/passport-config');
var formidable = require('formidable');
var fs = require('fs');
util = require('util');



/* GET CreateMeme page. */
router.get('/memes', function (req, res) {
    //Return default 10 items
    (async () => {
        try {
            const memesJSON = await rmDB.getMemes(1, 10)
            res.status(200).send({
                success: 'true',
                message: 'memes retrieved successfully',
                memes: memesJSON
            })
            //res.write(await rmDB.getMemes(1, 10));
        } catch(err){
            res.status(500).send("Error retrieving Memes: "+err.toString());
        }
        //let resultset = await rmDB.getMemes(1, 10);
        
    })();
});
router.get('/memes/:page([0-9]+)', function (req, res) {
    //Return page *10 
    const page = parseInt(req.params.page, 10);
    (async () => {
        try {
            const memesJSON = await rmDB.getMemes(page, 10)
            res.status(200).send({
                success: 'true',
                message: 'memes retrieved successfully',
                memes: memesJSON
            })
            //res.write(await rmDB.getMemes(1, 10));
        } catch (err) {
            res.status(500).send("Error retrieving Memes: " + err.toString());
        }
        //let resultset = await rmDB.getMemes(1, 10);

    })();
});
module.exports = router;