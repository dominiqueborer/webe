// config for your database
var config = {
    user: 'randomiusmemius',
    password: '1234',
    //server: 'WIN-QKFGRT8C621',
    server: 'localhost',
    database: 'randomiusmemiusApp'
};



exports.getSqlConfig = function () {
    return config;
};

exports.insertNewMeme = function () {
    return new Promise(function (resolve, reject) {

        request(url, function (error, res, body) {
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

            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
};