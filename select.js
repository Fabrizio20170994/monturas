/* Copyright (c) 2015, 2019, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   select1.js
 *
 * DESCRIPTION
 *   Executes a basic query without using a connection pool or ResultSet.
 *
 *   For a connection pool example see connectionpool.js
 *   For a ResultSet example see resultset2.js
 *   For a query stream example see selectstream.js
 *
 *   This example uses Node 8's async/await syntax.
 *
 *****************************************************************************/


'use strict';

const oracledb = require('oracledb');
const dbConfig = {
    user          : process.env.NODE_ORACLEDB_USER || "SYS",
  
    // Get the password from the environment variable
    // NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
    // string (not recommended), or it could be prompted for.
    // Alternatively use External Authentication so that no password is
    // needed.
    password      : process.env.NODE_ORACLEDB_PASSWORD || "322",
  
    // For information on connection strings see:
    // https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost:1521/XEPDB1",
    privilege: oracledb.SYSDBA,
  };

async function run() {

  let connection;

  try {
    // Get a non-pooled connection

    connection = await oracledb.getConnection(dbConfig);


    const result = await connection.execute(
      // The statement to execute
      `CREATE TABLE CLIENTE(
        CODIGO_CLIENTE VARCHAR2(20) PRIMARY KEY`,
      // Options argument.  Since the query only returns one
      // row, we can optimize memory usage by reducing the default
      // maxRows value.  For the complete list of other options see
      // the documentation.
      {
        maxRows: 1
        //, outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
        //, extendedMetaData: true                 // get extra metadata
        //, fetchArraySize: 100                    // internal buffer allocation size for tuning
      });

    console.log(result.metaData); // [ { name: 'FARMER' }, { name: 'PICKED' }, { name: 'RIPENESS' } ]
    console.log(result.rows);     // [ [ 'Mindy', 2019-07-16T03:30:00.000Z, 'More Yellow than Green' ] ]

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        // Connections should always be released when not needed
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();