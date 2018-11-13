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






/* GET home page. */
router.get('/', function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = 'C:/Images/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else {
        res.render('createMeme', { "user": req.user });
    }
});
router.post('/fileupload', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    
    (async () => {

        try {
            let varErrorToUser = "";
            //Uploading file to local storage           
            let form = new formidable.IncomingForm();
            let fileNameToDB = "";
            form.parse(req);

            form.on('fileBegin', function (name, file) {
                //change name, but keep file ending
                let splittedName = file.name.toString().split(".");
                let uuidv4Meme = uuidv4();
                fileNameToDB = uuidv4Meme + "." + splittedName[splittedName.length - 1];
                file.name = fileNameToDB;
                file.path = "C:/Images/" + file.name; // __dirname + file.name;//'/uploads/' + file.name;
            });


            //Updating database and store meta information
            let pool = await new sql.ConnectionPool(rmDB.getSqlConfig());
            await pool.connect();
            let insertMemeReq = await pool.request()
                .input("memeTitle", "random")
                .input("memeCreated", sql.DateTime, new Date())
                .input("memeFileName", fileNameToDB)
                .input("userId", 2)
                //.input('input_parameter', sql.Int, value)
                .query('insert into MemeSet (MemeTitle, MemeCreated, MemeFileName, UserUserId) values (@memeTitle,@memeCreated,@memeFileName,@userId)', (err, result) => {
                    console.dir(result);
                    if (err) {
                        varErrorToUser += "Error uploading Meme: " + err.toString();
                    }
                });
            



            

            res.render('uploadedMeme', { "varErrorToUser": varErrorToUser, "user": req.user });
        } catch (err) {
            // ... error checks


            reject(err);
        }

    })();
});
//router.get('/createMeme/fileupload', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
//    if (req.url == '/fileupload') {
//        var form = new formidable.IncomingForm();
//        form.parse(req, function (err, fields, files) {
//            var oldpath = files.filetoupload.path;
//            var newpath = 'C:/Images/' + files.filetoupload.name;
//            fs.rename(oldpath, newpath, function (err) {
//                if (err) throw err;
//                res.write('File uploaded and moved!');
//                res.end();
//            });
//        });
//    } else {
//        res.render('createMeme', { "user": req.user });
//    }
//});


module.exports = router;