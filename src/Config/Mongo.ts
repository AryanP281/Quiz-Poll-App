
/******************************Imports************************ */
import mongo,{MongoClient} from "mongodb"

/*****************************Variables*********************/
const dbUrl : string = "localhost:27017"; //The mongo db hosting url
const dbName : string = "QuizPollApp"; //The name of the database to be used
const connectionUrl : string = `mongodb://${dbUrl}/${dbName}`; //The url to be used for connecting to mongodb

/*****************************Script*********************/
const mongodbClient : MongoClient = new MongoClient(connectionUrl);
mongodbClient.connect().then(() => console.log("Connected to MongoDb"))

/*****************************Exports*********************/
export {mongodbClient as mongodb};