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

var config = {
    user: 'randomiusmemius',
    password: '1234',
    //server: 'WIN-QKFGRT8C621',
    server: 'localhost',
    database: 'randomiusmemiusApp'
};
sql.on('error', err => {
    // ... error handler
});





/* GET home page. */
router.get('/', function (req, res) {
    //dbtest.messageHandler();
    //let resultTable = dbtest.getRDataTableRows();

    (async () => {

        try {
            let memes = await rmDB.getMemes(1, 10);
            let data = {
                'memes': memes//rmDB.getSqlQueryResponse(config, 'select * from rDataTable')//getSqlQuery()

            }
            data = Object.assign(data, rmGlobalConstants.getAllConstants());
            //let globalConst = rmGlobalConstants.getAllConstants();
            res.render('index', { "data": data, "user": req.user });


        } catch (err) {
            winston.error(err);
            reject(err);
        }

    })();



});

/* GET single Meme page. */
router.get('/meme([0-9]{1,3})', function (req, res) {
    //dbtest.messageHandler();
    //let resultTable = dbtest.getRDataTableRows();
    let memeId = req.url.split("/meme");
    memeId = memeId[memeId.length - 1];
    if (!isNaN(memeId)) {
        (async () => {

            try {
                let meme = await rmDB.getMeme(memeId);
                //let recordset = result.recordset[0];
                //sql server could possibly return multiple rows, only return 1 and if 0 or more => reject
                if (meme.length == 1) {
                    meme = meme[0];
                    let commments = await rmDB.getMemeComments(memeId, 1, 10);
                    let commentPages = await rmDB.getMemeCommentPages(memeId, 10);
                    res.render('memePage', { "meme": meme, "comments": commments, "commentPages": commentPages, "user": req.user });
                } else {
                    let msgErr = "Error in retrieving Meme. Result length is: " + meme.length;
                    winston.error(msgErr);
                    res.status(500).send();
                }
            } catch (err) {
                winston.error(err);
                res.render('memePage', { "error": err.toString(), "user": req.user });
            }

        })();
    }




});
/* GET register page. */
router.get('/register', require('connect-ensure-login').ensureLoggedOut(), function (req, res) {

    res.render('register', { "user": req.user });
});
/* POST a new user */
router.post('/register', require('connect-ensure-login').ensureLoggedOut(), function (req, res) {
    //Parse register user data  
    if (req.body.pLogin && req.body.pPassword && req.body.pConfirmedPassword && req.body.pFirstName && req.body.pLastName && req.body.pMail) { 

        if (req.body.pPassword.toString() === req.body.pConfirmedPassword.toString()) {
            const pLogin = req.body.pLogin;
            const pPassword = req.body.pPassword;
            const pFirstName = req.body.pFirstName;
            const pLastName = req.body.pLastName;
            const pMail = req.body.pMail;

            (async () => {
                try {
                    let checkUsername = await rmDB.findByUsername(pLogin);
                    
                    if (checkUsername.includes("Username Exists")) {
                        res.render('register', {
                            messageFailure: "Your desired Login Name already exists, choose another one", "pLogin": pLogin, "pFirstName": pFirstName, "pLastName": pLastName, "pMail": pMail
                        });
                    } 
                    let couldRegister = await rmDB.registerNewUser(pLogin, pPassword, pFirstName, pLastName, pMail);
                    if (!couldRegister.includes("Success")) {

                        let msgErr = "Error in registering on database, please try again.";
                        winston.error(msgErr);
                        res.render('register', {
                            messageFailure: msgErr, "pLogin": pLogin, "pFirstName": pFirstName, "pLastName": pLastName, "pMail": pMail
                        });

                    } else {
                        res.render('register', { messageSuccess: "Thanks for registering! You can now login and upload memes or post comments! Enjoy!" });
                    }
                } catch (err) {
                    let msgErr = "Error registering new user: " + err.toString();
                    winston.error(msgErr);
                    res.status(500).send(msgErr);
                }
            })();
        } else {
            //redirect back to page and send password error, not the same as confirmed password field
            res.render('register', {"messageFailure": "Your reentered password in 'confirm password' do not match !", "pLogin": req.body.pLogin, "pFirstName": req.body.pFirstName, "pLastName": req.body.pLastName, "pMail": req.body.pMail});
        }
    } else {
        //redirect and tell user to fill out all required fields
        res.render('register', {
            messageFailure: "Please fill out all required fields!", "pLogin": req.body.pLogin, "pFirstName": req.body.pFirstName, "pLastName": req.body.pLastName, "pMail": req.body.pMail});


    }
});

module.exports = router;
