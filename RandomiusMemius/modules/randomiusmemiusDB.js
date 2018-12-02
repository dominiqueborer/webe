
var winston = require('../modules/logging');
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
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);
                await pool.connect();
                await pool.request()
                    .input("memeTitle", memeTitle)
                    .input("memeCreated", sql.DateTime, new Date())
                    .input("memeFileName", memeFilename)
                    .input("userId", userID)
                    .query('insert into MemeSet (MemeTitle, MemeCreated, MemeFileName, UserUserId) values (@memeTitle,@memeCreated,@memeFileName,@userId)', (err, result) => {
                        console.dir(result);
                        if (err) {
                            let varErrorToUser = "Error uploading Meme: " + err.toString();
                            winston.error(varErrorToUser);
                            reject(varErrorToUser);
                        }
                    });
                let infoMsg = "Successfully inserted Meme to DB";
                winston.info(infoMsg);
                resolve(infoMsg);
            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);
                reject(msgErr);
            }
        })();
    });
    
};
exports.getMemes = function (page, pageSize) {
    return new Promise((resolve, reject) => {
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
                            resolve(result.recordset);
                        });

                } catch (err) {
                    let msgErr = "Error database: " + err.toString();
                    winston.error(msgErr);
                    reject(msgErr);
                }
            } else {
                let msgErr = "Variable page is not a number";
                winston.error(msgErr);
                reject(msgErr);
            }
        })();
    });
};
exports.getUsers = function (page, pageSize) {
    return new Promise((resolve, reject) => {
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
                                let msgErr = "Error loading Users: " + err.toString();
                                winston.error(msgErr);
                                reject(msgErr);
                            }
                            resolve(result.recordset);
                        });

                } catch (err) {
                    let msgErr = "Error database: " + err.toString();
                    winston.error(msgErr);
                    reject(msgErr);
                }
            } else {
                let msgErr = "Variable page is not a number";
                winston.error(msgErr);
                reject(msgErr);
            }
        })();
    });
};
exports.getMeme = function (memeId) {
    return new Promise((resolve, reject) => {
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
                                let msgErr = "Error loading Meme: " + err.toString();
                                winston.error(msgErr);
                                reject(msgErr);
                            }
                            resolve(result.recordset);
                        });

                } catch (err) {
                    let msgErr = "Error database: " + err.toString();
                    winston.error(msgErr);
                    reject(msgErr);
                }
            } else {
                let msgErr = "Variable memeId is not a number";
                winston.error(msgErr);
                reject(msgErr);
            }
        })();
    });
};
exports.getMemeCommentPages = function (memeId, pageSize) {
    return new Promise((resolve, reject) => {
        (async () => {
            if (!isNaN(memeId) && !isNaN(pageSize)) {
                try {
                    let pool = await new sql.ConnectionPool(config);

                    await pool.connect();
                    await pool.request()
                        .input("memeId", memeId)
                        .input("pageSize", pageSize)
                        .execute('getMemeCommentPages', (err, result) => {
                            // ... error checks
                            if (err) {
                                let msgErr = "Error loading Users: " + err.toString();
                                winston.error(msgErr);
                                reject(msgErr);
                            }
                            //We only want one row to be returned, the number of comment pages available
                            if (result.recordset.length == 1) {
                                resolve(result.recordset[0].pages);
                            } else {
                                let msgErr = "Error loading pageS. Comment pages should be 1, but is: " + result.recordset.length;
                                winston.error(msgErr);
                                reject(msgErr);
                            }
                            
                        });

                } catch (err) {
                    let msgErr = "Error database: " + err.toString();
                    winston.error(msgErr);
                    //return msgErr;
                    reject(msgErr);
                }
            } else {                
                reject("Parameter is not a number");
            }
        })();
    });
};
exports.getMemeComments = function (memeId, page, pageSize) {
    return new Promise((resolve, reject) => {
        (async () => {
            if (!isNaN(memeId) && !isNaN(page) && !isNaN(pageSize)) {
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
                                let msgErr = "Error loading Users: " + err.toString();
                                winston.error(msgErr);
                                reject(msgErr);
                            }
                            resolve(result.recordset);
                        });

                } catch (err) {
                    let msgErr = "Error database: " + err.toString();
                    winston.error(msgErr);
                    //return msgErr;
                    reject(msgErr);
                }
            } else {
                //page is not a number
                let msgErr = "Parameter is not a number";
                winston.error(msgErr);
                reject(msgErr);
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
                    .query('insert into MemeCommentSet (Comment, Created, UserUserId,MemeId) values (@memeComment,@created,@userId,@memeId)', (err, result) => {
                        console.dir(result);
                        if (err) {
                            let varErrorToUser = "Error inserting Meme Comment: " + err.toString();
                            winston.error(varErrorToUser);
                            reject(varErrorToUser);
                        }
                    });
                let infoMsg = "Successfully inserted Meme to DB";
                winston.info(infoMsg);
                resolve(infoMsg);
            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);
                reject(msgErr);
            }
        })();
    });

};
exports.findByUserId = function (userId) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("userId", userId)
                    .output("responseMessage", sql.VarChar(254), "initialvalue")
                    .execute('findByUserId', (err, result) => {
                        // ... error checks
                        if (err) {
                            let msgErr = "Error finding User by Id: " + err.toString();
                            winston.error(msgErr);
                            reject(msgErr);
                        }
                        resolve(result.output.responseMessage);

                    });

            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);

                reject(msgErr);
            }
        })();
    });
};
exports.findByUsername= function (username) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("pLoginName", username)
                    .output("responseMessage", sql.VarChar(254), "initialvalue")
                    .execute('findByUsername', (err, result) => {
                        // ... error checks
                        if (err) {
                            let msgErr = "Error finding User by Id: " + err.toString();
                            winston.error(msgErr);
                            reject(msgErr);
                        }
                        resolve(result.output.responseMessage);

                    });

            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);

                reject(msgErr);
            }
        })();
    });
};
exports.getUserAuthentication = function (username, password) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("pLoginName", username)
                    .input("pPassword", password)
                    .output("responseMessage", sql.VarChar(254))
                    .execute('uspLogin', (err, result) => {
                        // ... error checks
                        if (err) {
                            let msgErr = "Error trying user to authenticate: " + err.toString();
                            winston.error(msgErr);
                            reject(msgErr);
                        }
                        resolve(result.output.responseMessage);  

                    });

            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);

                reject(msgErr);
            }
        })();
    });
};
exports.getUser = function (username) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("pLoginName", username)
                    .execute('getUser', (err, result) => {
                        // ... error checks
                        if (err) {
                            let msgErr = "Error trying to get user information: " + err.toString();
                            winston.error(msgErr);
                            reject(msgErr);
                        }
                        //We only want one row to be returned, one user
                        if (result.recordset.length == 1) {
                            resolve(result.recordset[0]);
                        } else {
                            let msgErr = "Error trying to get user information. Procedure should return 1 response row, but is: " + result.recordset.length;
                            winston.error(msgErr);
                            reject(msgErr);
                        }

                    });

            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);

                reject(msgErr);
            }
        })();
    });
};
exports.getUserById = function (userId) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("userId", userId)
                    .execute('getUserById', (err, result) => {
                        // ... error checks
                        if (err) {
                            let msgErr = "Error trying to get user information: " + err.toString();
                            winston.error(msgErr);
                            reject(msgErr);
                        }
                        //We only want one row to be returned, one user
                        if (result.recordset.length == 1) {
                            resolve(result.recordset[0]);
                        } else {
                            let msgErr = "Error trying to get user information. Procedure should return 1 response row, but is: " + result.recordset.length;
                            winston.error(msgErr);
                            reject(msgErr);
                        }

                    });

            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);

                reject(msgErr);
            }
        })();
    });
};
exports.registerNewUser = function (pLogin, pPassword, pFirstName, pLastName, pMail) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("pLogin", pLogin)
                    .input("pPassword", pPassword)
                    .input("pFirstName", pFirstName)
                    .input("pLastName", pLastName)
                    .input("pMail", pMail)
                    .output("responseMessage", sql.VarChar(254), "initialvalue")
                    .execute('uspAddUser', (err, result) => {
                        // ... error checks
                        if (err) {
                            let msgErr = "Error registering user in database: " + err.toString();
                            winston.error(msgErr);
                            reject(msgErr);
                        }
                        resolve(result.output.responseMessage);

                    });

            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);

                reject(msgErr);
            }
        })();
    });
};
exports.isUserBanned = function (userId) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("userId", userId)
                    .output("responseMessage", sql.VarChar(254), "initialvalue")
                    .execute('isUserBanned', (err, result) => {
                        // ... error checks

                        if (err) {
                            let msgErr = "Error getting user banned status in database: " + err.toString();
                            winston.error(msgErr);
                            reject(msgErr);
                        }
                        resolve(result.output.responseMessage);

                    });

            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);

                reject(msgErr);
            }
        })();
    });
};
exports.hasAdminRole = function (userId) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("userId", userId)
                    .output("responseMessage", sql.Int, 0)
                    .execute('hasAdminRole', (err, result) => {
                        // ... error checks

                        if (err) {
                            let msgErr = "Error getting user admin role status in database: " + err.toString();
                            winston.error(msgErr);
                            reject(msgErr);
                        }
                        resolve(result.output.responseMessage);

                    });

            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);

                reject(msgErr);
            }
        })();
    });
};
exports.toggleUserBan = function (userId) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("userId", userId)
                    .output("responseMessage", sql.VarChar(254), "initialvalue")
                    .execute('toggleUserBan', (err, result) => {
                        // ... error checks

                        if (err) {
                            let msgErr = "Error toggling user ban status: " + err.toString();
                            winston.error(msgErr);
                            reject(msgErr);
                        }
                        resolve(result.output.responseMessage);

                    });

            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);

                reject(msgErr);
            }
        })();
    });
};
exports.updateUserPassword = function (userId,password) {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                let pool = await new sql.ConnectionPool(config);

                await pool.connect();
                await pool.request()
                    .input("userId", userId)
                    .input("pPassword", password)
                    .output("responseMessage", sql.VarChar(254), "initialvalue")
                    .execute('updateUserPassword', (err, result) => {
                        // ... error checks

                        if (err) {
                            let msgErr = "Error updating user password: " + err.toString();
                            winston.error(msgErr);
                            reject(msgErr);
                        }
                        resolve(result.output.responseMessage);

                    });

            } catch (err) {
                let msgErr = "Error database: " + err.toString();
                winston.error(msgErr);

                reject(msgErr);
            }
        })();
    });
};