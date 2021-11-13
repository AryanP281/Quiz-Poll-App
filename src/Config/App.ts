
/********************************Imports*********************** */
import dotenv from "dotenv";
import multer from "multer";

/********************************Variables*********************** */
const responseCodes : any = {
    success : 0,
    invalid_credentials : 1,
    email_already_registered : 2,
    user_not_found : 3,
    incorrect_password : 4,
    invalid_token : 5,
    invalid_user_details: 6,
    invalid_new_content: 7,
    content_not_found: 8,
    user_already_participated: 9,
    user_not_participated: 10
};
let JWT_SECRET : string | undefined;

/********************************Script*********************** */

//Initializing dotenv
dotenv.config();

//Setting the jwt secret
JWT_SECRET = process.env.JWT_SECRET;

//Setting the mongob config details
const dbConfig : {dbUrl : string, dbPort: number, dbName : string, user: string, userPassword: string} = {
    dbUrl: process.env.DB_URL!, 
    dbPort: parseInt(process.env.DB_PORT!),
    dbName: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    userPassword: process.env.DB_USER_PASSWORD!
};

//Setting the firebase config details
const firebaseConfig : {apiKey: string, authDomain: string, projectId: string, storageBucket: string, messagingSenderId: string, appId: string} = {
    apiKey: process.env.FIREBASE_API_KEY!,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.FIREBASE_PROJECT_ID!,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.FIREBASE_APP_ID!
};

//Initializing multer uploader
const multerUploader : multer.Multer = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5*1024*1024 //Limiting file size to 5 MB
    }
});

const isDebugMode = (process.env.DEBUG === "true");

/********************************Exports*********************** */
export {responseCodes, JWT_SECRET, dbConfig, firebaseConfig, multerUploader, isDebugMode};