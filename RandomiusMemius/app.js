'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sql = require("mssql");
var passport = require('passport');
var morgan = require('morgan');
var winston = require('./modules/logging');
var rmDB = require('./modules/randomiusmemiusDB');

//var Strategy = require('passport-local').Strategy;
//var db = require('./db');
require('./config/passport-config');


var routes = require('./routes/index');
var users = require('./routes/users');
var createMemes = require('./routes/createMeme');
var apiRoute = require('./routes/api');
var users = require('./routes/users');
var sqlConnectionTest = require('./routes/sqlConnectionTest');

//Get App constants - to be configured externally in a future release
var rmGlobalConstants = require('./modules/randomiusMemiusGlobalConstants');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

//app.use('/', routes);
//app.use('/users', users);
//app.use('/sqlConnectionTest', sqlConnectionTest);

//******Additional Passport configuration*********
//app.use(require('morgan')('combined'));
app.use(morgan('combined', { stream: winston.stream }));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.use('/', routes);
app.use('/createMeme', createMemes);
app.use('/api', apiRoute);
app.use('/users', users);
//app.use('/sqlConnectionTest', sqlConnectionTest);

//app.get('/',
//    function (req, res) {
//        res.render('home', { user: req.user });
//    });

app.get('/login',
    function (req, res) {
        res.render('login');
    });

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

app.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    });




app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        res.render('profile', { user: req.user });
    });

/* Post update user password */
app.post('/profile', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {

    (async () => {

        try {
            if (req.body.password && req.body.confirmedPassword && req.body.newPassword) {
                if (req.body.confirmedPassword.toString() === req.body.newPassword.toString()) {
                    let userId = req.user.id;
                    let password = req.body.password;
                    let newPassword = req.body.newPassword;
                    let confirmCurrentPW = await rmDB.getUserAuthentication(req.user.username, password);
                    if (confirmCurrentPW.includes("User successfully logged in")) {
                        // Current user password is correct, continue to update new password
                        let updatedUserPw= await rmDB.updateUserPassword(userId, newPassword);
                        if (!updatedUserPw.includes("Success")) {
                            res.render('profile', { messageFailure: "Please try again to update your password", "user": req.user });
                        } else {
                            res.render('profile', { messageSuccess: "Successfully changed your password", "user": req.user });
                        }
                    } else {
                        //wrong password
                        winston.info("password does not match " + req.user.username);
                        res.render('profile', { messageFailure: "Your current password is incorrect", "user": req.user });
                    }
                   
                } else {

                    res.render('profile', { messageFailure: "Your new password doesn't match with your confirmed password", "user": req.user });
                }
            } else {
                winston.info("User submitted not all required data for password change" + req.user.username);

                res.render('profile', { messageFailure: "Please enter your current password and confirm your new password!", "user": req.user });
            }

        } catch (err) {
            let msgErr = "Error updating user password " + err.toString();
            winston.error(msgErr);
            res.status(500).send(msgErr);
        }

    })();
});


//******END Additional Passport configuration*********

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    winston.error(`${err.status || 404} - "document not found" - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
    //loggerM.writeLogInfo("Server started");
});
