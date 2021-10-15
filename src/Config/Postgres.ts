
/************************Imports***************** */
import {Pool} from "pg";
import {dbConfig} from "./App";

/************************Variables************ */
let db : Pool | undefined;

/************************Initialization************ */
try
{
    db = new Pool({host: dbConfig.dbUrl, port: dbConfig.dbPort, user: dbConfig.user, password: dbConfig.userPassword, database: dbConfig.dbName});

    console.log("PostgreSql database connected")
}
catch(err)
{
    console.log(err);
}

/************************Exports************ */
export {db}