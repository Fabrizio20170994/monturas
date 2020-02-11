const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const mypw = '322'  // set mypw to the hr schema password

async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection(  {
      user          : "SYS",
      password      : mypw,
      connectString : "localhost/xe",
      privilege: oracledb.SYSDBA
    });

    const result = await connection.execute(
      `SELECT * FROM VENDEDOR`
  // bind value for :id
    );
    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();