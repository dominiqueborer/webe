var rmDB = require('../modules/randomiusmemiusDB');

var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
    process.nextTick(function () {
        (async () => {
            try {
                let loginRequest = await rmDB.findByUsername(username);
                if (loginRequest.includes("Username Exists")) {
                    // Now get user information and match it to passport
                    let userSql = await rmDB.getUserAuthentication(username);
                    let user = { id: userSql.UserId, username: userSql.LoginName, displayName: userSql.LoginName, emails: [{ value: userSql.Mail }] };
                    
                } else {
                    //res.write(await rmDB.getMemes(1, 10));
                    return cb(null, null);
                }
            } catch (err) {
               //Insert SQL Log 
                console.log(err.toString());
                return cb(err, null);
            }          

        })();
        
    //for (var i = 0, len = records.length; i < len; i++) {
    //  var record = records[i];
    //  if (record.username === username) {
    //    return cb(null, record);
    //  }
    //}
    //return cb(null, null);
  });
}
