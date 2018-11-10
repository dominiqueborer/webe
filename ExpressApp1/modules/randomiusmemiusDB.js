var sqldb = require("mssql");

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
exports.getSqlQueryResponse = function (config, strQuery) {
    let qRows = "";

    
        try {
            await sqldb.connect(config)
            const result = await sql.query(strQuery);
            qRows = result;
        } catch (err) {
            // ... error checks
            let suck = "everything sucks";
            return "error connecting to database";
        }
    
    

    //let pool = await new sqldb.ConnectionPool(config).connect(err => {
    //    pool.close();
    //    return "error connecting to database"
    //})
    //let dbRequest = new sqldb.Request(pool);
    //dbRequest.query(strQuery, (err, result) => {

    //    qRows = result.recordset;
    //});
    //pool.close();
    return qRows;
};