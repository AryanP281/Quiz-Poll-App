
/******************************Imports************************ */
import {MongoClient} from "mongodb"
import { mongoDbConfig } from "./App";

/*****************************Variables*********************/
//const connectionUrl : string = `mongodb://${mongoDbConfig.dbUrl}/${mongoDbConfig.dbName}`; //The url to be used for connecting to mongodb
const connectionUrl : string = `mongodb+srv://${mongoDbConfig.user}:${mongoDbConfig.userPassword}@cluster0.zreon.mongodb.net/${mongoDbConfig.dbName}?retryWrites=true&w=majority`; //The url to connect to the mongodb atlas db

/*****************************Script*********************/
const mongodbClient : MongoClient = new MongoClient(connectionUrl);
mongodbClient.connect().then(() => console.log("Connected to MongoDb"))

/*****************************Exports*********************/
export {mongodbClient as mongodb};