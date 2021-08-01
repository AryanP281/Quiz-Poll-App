
/******************************Imports************************ */
import express from "express"
import { addCorsHeaders } from "./Services/Middleware";
import AuthApiRouter from "./Routes/AuthApi";
import UserApiRouter from "./Routes/UserApi";

/******************************Variables************************ */
const SERVER_PORT : number = (parseInt(process.env.PORT!)) || 5000; //The port to run the server on

/******************************Script*************************/
const expressApp : express.Application = express(); //Creating express server instance

//Setting middleware
expressApp.use(express.json());
expressApp.use(express.urlencoded({extended: false}));
expressApp.use(addCorsHeaders);

//Setting up routes
expressApp.use("/auth", AuthApiRouter)
expressApp.use("/users", UserApiRouter);

//Starting express server
expressApp.listen(SERVER_PORT, "0.0.0.0", () => console.log(`Express Server started at port ${SERVER_PORT}`));

//Initializing mongodb
require("./Config/Mongo");
