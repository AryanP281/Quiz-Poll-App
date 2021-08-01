
/********************************Imports*********************** */
import {Request, Response} from "express"
import {mongodb} from "../Config/Mongo"
import {Collection, Document, ObjectId} from "mongodb"
import {responseCodes, JWT_SECRET} from "../Config/App"
import {compareHash, hash} from "../Services/Crypto"
import jwt from "jsonwebtoken"

/********************************Variables*********************** */
let userAccountsCollection : Collection | null = null; //The collection containing the user account details
let userDetailsCollection : Collection | null = null; //The collection containing the user details

/********************************Helper Functions*********************** */
async function checkEmailExists(email : string) : Promise<boolean>
{
    /*Checks if a user with the given email already exists */

    const userDoc : Document | undefined = await userAccountsCollection!.findOne({email : email});

    return (userDoc !== undefined);
}

/********************************Functions*********************** */
async function createUserAccount(req : Request, resp : Response) : Promise<void>
{
    /*Creates a new user account */

    try
    {
        //Checking if credentials are provide
        if(!req.body.user.email || !req.body.user.pss)
        {
            resp.status(200).json({success: false, code: responseCodes.invalid_credentials});
            return;
        }

        //Getting the accounts collection
        if(!userAccountsCollection)
            userAccountsCollection = await mongodb.db().collection("UserCreds");

        //Checking if email id is already registered
        if(await checkEmailExists(req.body.user.email))
        {
            resp.status(200).json({success: false, code : responseCodes.email_already_registered});
            return;
        }

        //Getting the hashed password
        const hashedPassword : string = await hash(req.body.user.pss);

        //Creating the user document
        const userCreds : {email:string,password:string} = {
            email : req.body.user.email,
            password : hashedPassword,
        };

        //Creating the user credentials document
        let res : {acknowledged:boolean, insertedId:ObjectId} | any = await userAccountsCollection.insertOne(userCreds);
        if(!res)
            throw Error("User credentials document creation failed"); //Checking if the user credentials document was successfully created
        const userCredsDocId : ObjectId = res.insertedId;

        //Getting the user details document
        if(!userDetailsCollection)
            userDetailsCollection = await mongodb.db().collection("UserDetails");

        //Creating the user details document
        const userDetails : {username:string,bday:number,bmonth:number,byear:number,followers:number,following:number} = {
            username: "",
            bday: 1,
            bmonth: 0,
            byear: 2001,
            followers: 0,
            following: 0
        };
        res = await userDetailsCollection.insertOne(userDetails);
        if(!res)
            throw Error("User document creation failed"); //Checking if the user document was successfully created

        //Setting foreign key in user credentials document
        const userDocsId : ObjectId = res.insertedId;
        res = await userAccountsCollection.updateOne({_id:userCredsDocId}, {$set : {user_fk: userDocsId}});
        if(!res)
            throw Error("Failed to update user credentials document");

        //Setting the user cookies
        const userToken : string = await jwt.sign(userDocsId.toString(), JWT_SECRET!); //Creating the jwt token for future authoriazations
        resp.cookie("userToken", userToken, {httpOnly: true});
        resp.cookie("auth", true, {httpOnly: false});

        resp.status(200).json({success : true, code : responseCodes.success});
    }
    catch(error)
    {
        console.log(error);
        resp.sendStatus(500);
    }

}

async function authenticateUser(req : Request, resp : Response) : Promise<void>
{
    /*Checks if the provided user credentials are valid and respond with auth token */

    try
    {
        //Getting the user details
        const userDetails = req.body.user;

        //Check if the details are invalid
        if(!userDetails.email || !userDetails.pss)
        {
            resp.status(200).json({success: false, code: responseCodes.invalid_credentials});
            return;
        }

        //Getting the user accounts collection
        if(!userAccountsCollection)
            userAccountsCollection = await mongodb.db().collection("UserCreds");

        //Getting the user credentials document
        const userCredsDocument : Document | undefined = await userAccountsCollection.findOne({email : userDetails.email});
        if(!userCredsDocument)
        {
            //User with given email does not exist
            resp.status(200).json({success: false, code : responseCodes.user_not_found});
            return;
        }
        
        //Checking if the passwords match
        if(!(await compareHash(userDetails.pss, userCredsDocument.password)))
        {
            resp.status(200).json({success : false, code : responseCodes.incorrect_password});
            return;
        }

        //Getting the user details collection
        if(!userDetailsCollection)
            userDetailsCollection = await mongodb.db().collection("UserDetails");

        //Getting the user id
        const userId : string | undefined = (await userDetailsCollection.findOne({_id : userCredsDocument.user_fk}))?._id.toString();
        if(!userId)
            throw Error("User details document not found")

        //Setting cookies
        const userToken : string = await jwt.sign(userId, JWT_SECRET!);
        resp.cookie("userToken", userToken, {httpOnly: true});
        resp.cookie("auth", true, {httpOnly: false});

        resp.status(200).json({success: true, code : responseCodes.success});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }

}

/********************************Exports*********************** */
export {createUserAccount, authenticateUser};