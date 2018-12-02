
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('../db');
var rmDB = require('../modules/randomiusmemiusDB');
var winston = require('winston');
//**************Passport config***************

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
    function (username, password, cb) {
        process.nextTick(function () {
            //User exists, compare entered password
            //if (user.password != password) { return cb(null, false); }
            (async () => {
                try {
                    let loginRequest = await rmDB.findByUsername(username);
                    if (!loginRequest.includes("Username Exists")) {
                        winston.info("Username does not exist" + username);
                        //loggerM.writeLogInfo("Username does not exist" + username);
                        return cb(null, false);
                    } 
                    //Try to authenticate 
                    let loginAuth = await rmDB.getUserAuthentication(username, password);
                    if (loginAuth.includes("User successfully logged in")) {
                        // Now get user information and match it to passport
                        let userSql = await rmDB.getUser(username);
                        let user = { id: userSql.UserId, username: userSql.LoginName, displayName: userSql.LoginName, emails: [{ value: userSql.Mail }] };
                        winston.info("User successfully authenticated" + username);
                        return cb(null, user);

                    } else {
                        //wrong password
                        winston.info("Username does not match with password" + username);
                        return cb(null, false);
                    }
                    
                } catch (err) {
                    //Insert SQL Log 
                    winston.error("SQL database error" + err.toString());
                    return cb(err);
                }

            })();
        });
    }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    

    process.nextTick(function () {
        //User exists, compare entered password
        (async () => {
            try {
                let foundUserByUserId = await rmDB.findByUserId(id);
                if (!foundUserByUserId.includes("UserId Exists")) {
                    winston.error("Could not find userID while deserializing of user" + foundUserByUserId);
                    return cb(null, new Error('User ' + id + ' does not exist'));
                }
                
                // Now get user information and match it to passport
                let userSql = await rmDB.getUserById(id);
                let user = { id: userSql.UserId, username: userSql.LoginName, displayName: userSql.LoginName, firstName: userSql.FirstName, lastName: userSql.LastName, emails: [{ value: userSql.Mail }], Banned: userSql.Banned  ,UserRoleSetId: userSql.UserRoleSetId };
                winston.info("Successfully deserialized user" + userSql.LoginName);
                return cb(null, user);
                

            } catch (err) {
                //Insert SQL Log 
                winston.error("SQL database error" + err.toString());
                return cb(err);
            }

        })();
    });

});
//************END Passport configuration**************

