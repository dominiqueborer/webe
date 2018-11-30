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

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 



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
/* Get comments  */
router.get('/memes/getMemeComments/:page([0-9]+)/:memeId([0-9]+)', function (req, res) {
    //Return page *10 
    const page = parseInt(req.params.page, 10);
    const memeId = parseInt(req.params.memeId, 10);
    (async () => {
        try {
            const memeCommentsJSON = await rmDB.getMemeComments(memeId, page, 10)
            res.status(200).send({
                success: 'true',
                message: 'meme comments retrieved successfully',
                memeComments: memeCommentsJSON
            })
            //res.write(await rmDB.getMemes(1, 10));
        } catch (err) {
            res.status(500).send("Error retrieving Meme Comments: " + err.toString());
        }
        //let resultset = await rmDB.getMemes(1, 10);

    })();
});
/* Get comment Pages  */
router.get('/memes/getMemeCommentPages/:pageSize([0-9]+)/:memeId([0-9]+)', function (req, res) {
    //Return comment pages count
    const pageSize = parseInt(req.params.pageSize, 10);
    const memeId = parseInt(req.params.memeId, 10);
    (async () => {
        try {
            const memeCommentPagesJSON = await rmDB.getMemeCommentPages(memeId, pageSize);
         
            res.status(200).send({
                success: 'true',
                message: 'meme comment pages retrieved successfully',
                memeCommentPages: memeCommentPagesJSON
            });
        } catch (err) {
            res.status(500).send("Error retrieving meme comment pages: " + err.toString());
        }

    })();
});
/* POST a new comment  */
router.post('/memes/newcomment', function (req, res) {
    //Parse comment data
    if (req.body.comment && req.body.memeId) { // && req.params.user) {
        const comment = req.body.comment;
        const userId = 1;//parseInt(req.params.user.userId, 10);
        const memeId = parseInt(req.body.memeId, 10);
        (async () => {
            try {
                await rmDB.insertNewMemeComment(comment, memeId, userId);
                res.send({
                    success: 'true',
                    message: 'inserted Meme Comment successfully'
                });
                //res.write(await rmDB.getMemes(1, 10));
            } catch (err) {
                res.status(500).send("Error inserting Meme Comment: " + err.toString());
            }
        })();
    } else {
        res.status(500).send("Invalid new Comment Request!");

    }
});

module.exports = router;