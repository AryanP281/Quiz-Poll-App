
/************************Imports***************** */
import { createPool } from "mysql2/promise";
import { Pool } from "mysql2/promise";
import {dbConfig} from "./App";

/************************Variables************ */
let db : Pool | undefined;

/************************Initialization************ */
try
{
    db = createPool({
        database: dbConfig.dbName,
        host: dbConfig.dbUrl,
        user: dbConfig.user,
        password: dbConfig.userPassword,
        connectionLimit: 10,
        queueLimit: 0
    });

    console.log("MySQL database connected")
}
catch(err)
{
    console.log(err);
}

/************************Exports************ */
export {db}