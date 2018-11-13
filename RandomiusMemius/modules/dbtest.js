const sql = require('mssql')

var config = {
    user: 'randomiusmemius',
    password: '1234',
    //server: 'WIN-QKFGRT8C621',
    server: 'localhost',
    database: 'randomiusmemiusApp'
};
sql.on('error', err => {
    // ... error handler
})

exports.messageHandler = async function () {
    try {
        let pool = await sql.connect(config)
        let result1 = await pool.request()
            //.input('input_parameter', sql.Int, value)
            .query('select * from rDataTable')

        console.dir(result1)

        // Stored procedure

        //let result2 = await pool.request()
        //    .input('input_parameter', sql.Int, value)
        //    .output('output_parameter', sql.VarChar(50))
        //    .execute('procedure_name')

        //console.dir(result2)
    } catch (err) {
        // ... error checks
    }
}
exports.getRDataTableRows = async function () {
    try {
        let pool = await sql.connect(config)
        let result1 = await pool.request()
            //.input('input_parameter', sql.Int, value)
            .query('select * from rDataTable');
        console.dir(result1);

        Promise.resolve(result1);
        


    } catch (err) {
        // ... error checks
    }
}