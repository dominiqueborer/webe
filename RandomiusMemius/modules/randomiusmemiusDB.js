
const sql = require('mssql');
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

exports.insertNewMeme = function (memeTitle, memeFilename, userID) {
    return new Promise(resolve => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);
                await pool.connect();
                await pool.request()
                    .input("memeTitle", memeTitle)
                    .input("memeCreated", sql.DateTime, new Date())
                    .input("memeFileName", memeFilename)
                    .input("userId", userID)
                    //.input('input_parameter', sql.Int, value)
                    .query('insert into MemeSet (MemeTitle, MemeCreated, MemeFileName, UserUserId) values (@memeTitle,@memeCreated,@memeFileName,@userId)', (err, result) => {
                        console.dir(result);
                        if (err) {
                            let varErrorToUser = "Error uploading Meme: " + err.toString();
                            reject(varErrorToUser);
                        }
                    });
                resolve("Successfully inserted Meme to DB");
            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                reject(msgErr);
            }
        })();
    });
    //return new Promise(function (resolve, reject) {
    //    (async () => {
    //        let pool = await new sql.ConnectionPool(rmDB.getSqlConfig());
    //        await pool.connect();
    //        await pool.request()
    //            .input("memeTitle", "random")
    //            .input("memeCreated", sql.DateTime, new Date())
    //            .input("memeFileName", fileNameToDB)
    //            .input("userId", userID)
    //            //.input('input_parameter', sql.Int, value)
    //            .query('insert into MemeSet (MemeTitle, MemeCreated, MemeFileName, UserUserId) values (@memeTitle,@memeCreated,@memeFileName,@userId)', (err, result) => {
    //                console.dir(result);
    //                if (err) {
    //                    let varErrorToUser = "Error uploading Meme: " + err.toString();
    //                    reject(varErrorToUser);
    //                }
    //            });
    //        resolve();  
    //    })();
    //});
    //let pConfig = config;
    
};
exports.getMemes = function (page, pageSize) {
    return new Promise(resolve => {
        (async () => {
            if (!isNaN(page)) {
                try {
                    let pool = await new sql.ConnectionPool(config);

                    await pool.connect();
                    await pool.request()
                        .input("page", page)
                        .input("pageSize", pageSize)
                        .execute('getMemes', (err, result) => {
                            // ... error checks
                            if (err) {
                                reject("Error loading Users: " + err.toString());
                            }
                            pool.close();
                            //resolve( JSON.stringify(result.recordset));
                            resolve(result.recordset);
                        });

                } catch (err) {
                    let msgErr = "Error database: " + err.toString();
                    //return msgErr;
                    reject(msgErr);
                }
            } else {
                //page is not a number, throw
                //return new Error("Variable page is not a number");
                reject("Variable page is not a number");
            }
        })();
    });
};
exports.getUsers = function (page, pageSize) {
    return new Promise(resolve => {
        (async () => {
            if (!isNaN(page)) {
                try {
                    let pool = await new sql.ConnectionPool(config);

                    await pool.connect();
                    await pool.request()
                        .input("page", page)
                        .input("pageSize", pageSize)
                        .execute('getUsers', (err, result) => {
                            // ... error checks
                            if (err) {
                                reject("Error loading Users: " + err.toString());
                            }
                            //result.recordsets.forEach(function (element) {
                            //    console.log(element);
                            //});
                            //resolve( JSON.stringify(result.recordset));
                            resolve(result.recordset);
                        });

                } catch (err) {
                    let msgErr = "Error database: " + err.toString();
                    //return msgErr;
                    reject(msgErr);
                }
            } else {
                //page is not a number, throw
                //return new Error("Variable page is not a number");
                reject("Variable page is not a number");
            }
        })();
    });
};
exports.getMeme = function (memeId) {
    return new Promise(resolve => {
        (async () => {
            if (!isNaN(memeId)) {
                try {
                    let pool = await new sql.ConnectionPool(config);

                    await pool.connect();
                    await pool.request()
                        .input("memeId", memeId)
                        .execute('getMeme', (err, result) => {
                            // ... error checks
                            if (err) {
                                reject("Error loading Meme: " + err.toString());
                            }
                            //result.recordsets.forEach(function (element) {
                            //    console.log(element);
                            //});
                            //resolve( JSON.stringify(result.recordset));
                            resolve(result.recordset);
                            //let recordset = result.recordset[0];
                            ////sql server could possibly return multiple rows, only return 1 and if 0 or more => reject
                            //if (recordset.length == 1) {
                            //    resolve();
                            //} else {
                            //    reject("Error in retrieving Meme. Result length is: " + recordset.length);
                            //}
                        });

                } catch (err) {
                    let msgErr = "Error database: " + err.toString();
                    //return msgErr;
                    reject(msgErr);
                }
            } else {
                //page is not a number, throw
                //return new Error("Variable page is not a number");
                reject("Variable memeId is not a number");
            }
        })();
    });
};
exports.getMemeComments = function (memeId, page, pageSize) {
    return new Promise(resolve => {
        (async () => {
            if (!isNaN(page) && !isNaN(page) &&!isNaN(page)) {
                try {
                    let pool = await new sql.ConnectionPool(config);

                    await pool.connect();
                    await pool.request()
                        .input("memeId", memeId)
                        .input("page", page)
                        .input("pageSize", pageSize)
                        .execute('getMemeComments', (err, result) => {
                            // ... error checks
                            if (err) {
                                reject("Error loading Users: " + err.toString());
                            }
                            resolve(result.recordset);
                        });

                } catch (err) {
                    let msgErr = "Error database: " + err.toString();
                    //return msgErr;
                    reject(msgErr);
                }
            } else {
                //page is not a number, throw
                //return new Error("Variable page is not a number");
                reject("Variable page is not a number");
            }
        })();
    });
};
exports.insertNewMemeComment = function (memeComment, memeId, userID) {
    return new Promise(resolve => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("memeComment", memeComment)
                    .input("created", sql.DateTime, new Date())
                    .input("userId", userID)
                    .input("memeId", memeId)
                    //.input('input_parameter', sql.Int, value)
                    .query('insert into MemeCommentSet (Comment, Created, UserUserId,MemeId) values (@memeComment,@created,@userId,@memeId)', (err, result) => {
                        console.dir(result);
                        if (err) {
                            let varErrorToUser = "Error inserting Meme Comment: " + err.toString();
                            reject(varErrorToUser);
                        }
                    });
                resolve("Successfully inserted Meme to DB");
            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                
                reject(msgErr);
            }
        })();
    });

};