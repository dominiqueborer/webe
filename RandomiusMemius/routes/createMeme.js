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
/* POST CreateMeme/fileupload page. */
router.post('/fileupload', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    
    (async () => {

        try {
            let varErrorToUser = "";
            //Uploading file to local storage           
            let form = new formidable.IncomingForm();
            let fileNameToDB = "";
            let memeTitle = "";
            form.parse(req)
                .on('field', function (name, value) {
                    switch (name) {
                        case "memeTitle":
                            memeTitle = value;
                            break;
                        default:
                            break;
                    }
                })
                .on('fileBegin', function (name, file) {
                    //change name, but keep file ending
                    let splittedName = file.name.toString().split(".");
                    let uuidv4Meme = uuidv4();
                    fileNameToDB = uuidv4Meme + "." + splittedName[splittedName.length - 1];
                    file.name = fileNameToDB;
                    //let pathToBeMoved = path.join(__dirname, '/public/images/');
                    let pathToBeMoved = path.resolve('./public/images/');
                    //Check path, if it is writable
                    try {
                        fs.accessSync(pathToBeMoved, fs.constants.W_OK);
                        //console.log('can write %s', path);
                    } catch (err) {
                        console.log("%s doesn't exist", pathToBeMoved);
                        res.status(500).send("Error writing to file system: " + err.toString());
                    }
                    file.path = pathToBeMoved + "/" + file.name;
                    //file.path = "C:/Images/" + file.name; 
                    //Updating database and store meta information
                    rmDB.insertNewMeme(memeTitle, fileNameToDB, 2).then(result => {

                        res.render('uploadedMeme', {"user": req.user });
                    }).catch(function (error) {
                        res.render('uploadedMeme', { "varErrorToUser": error.toString(), "user": req.user });
                    });
                
            });
        } catch (err) {
            // ... error checks
            varErrorToUser += "Error uploading Meme: " + err.toString();
            res.render('uploadedMeme', { "varErrorToUser": varErrorToUser, "user": req.user });
            //reject(err);
        }

    })();
});


module.exports = router;