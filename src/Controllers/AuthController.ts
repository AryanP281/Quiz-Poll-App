
/********************************Imports*********************** */
import {Request, Response} from "express"
import {responseCodes, JWT_SECRET, isDebugMode} from "../Config/App"
import {compareHash, hash} from "../Services/Crypto"
import jwt from "jsonwebtoken"
import {db} from "../Config/MySql";
import md5 from "md5";

/********************************Variables*********************** */

/********************************Helper Functions*********************** */

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

        //Generating email hash
        const emailHash : string = md5(req.body.user.email);

        //Checking if email id is already registered
        const userDetails : any = (await db!.query("SELECT * FROM User WHERE userHash=?", [emailHash]))[0];
        
        if(userDetails.length !== 0)
        {
            resp.status(200).json({success: false, code: responseCodes.email_already_registered});
            return;
        }

        //Getting the hashed password
        const hashedPassword : string = await hash(req.body.user.pss);

        //Creating the user entry
        await db!.query("INSERT INTO User(userHash,userEmail,password) VALUE (?,?,?)", [emailHash, req.body.user.email, hashedPassword]);

        //Setting the user cookies
        const userToken : string = await jwt.sign(emailHash, JWT_SECRET!); //Creating the jwt token for future authoriazations
        resp.cookie("userToken", userToken, {httpOnly: true, sameSite: isDebugMode ? "lax" : "none", secure: !isDebugMode});

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

        //Getting the user password
        const user : any = (await db!.query("SELECT userHash, password FROM User WHERE userEmail=?", [userDetails.email]))[0];
        if(user.length === 0)
        {
            resp.status(200).json({success: false, code: responseCodes.user_not_found});
            return;
        }
        
        //Checking if the passwords match
        if (!(await compareHash(userDetails.pss, user[0].password)))
        {
            resp.status(200).json({success: false, code: responseCodes.incorrect_password});
            return;
        }

        //Setting cookies
        const userToken : string = await jwt.sign(user[0].userHash, JWT_SECRET!);
        resp.cookie("userToken", userToken, {httpOnly: true, sameSite: isDebugMode ? "lax" : "none", secure: !isDebugMode});

        resp.status(200).json({success: true, code : responseCodes.success});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }

}

async function signoutUser(req: Request, resp: Response) : Promise<void>
{
    /*Clears the users token and cookies */

    //Clearing the cookies
    resp.cookie("userToken", "", {maxAge: 0});
    resp.cookie("auth","",{maxAge: 0});

    resp.sendStatus(200);
}

/********************************Exports*********************** */
export {createUserAccount, authenticateUser, signoutUser};