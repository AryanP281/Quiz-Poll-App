
/******************************Imports************************ */
import { Request, Response } from "express";
import { JWT_SECRET, responseCodes } from "../Config/App";
import jwt from "jsonwebtoken";

/******************************Middleware************************ */
async function addCorsHeaders(req : Request, resp : Response, next : any) : Promise<void>
{
    /* Adds cors headers to the response */

    resp.append("Access-Control-Allow-Origin", req.get("origin"));
    resp.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    resp.append("Access-Control-Allow-Headers", "Content-Type");
    resp.append("Access-Control-Allow-Credentials", "true")

    next();
}

async function verifyUserToken(req : Request, resp : Response, next : any) : Promise<void> 
{
    /*Checks if the request's jwt is valid */

    //Getting the jwt cookie
    const cookies : any = getCookies(req.headers.cookie);
    if(!cookies.userToken) //Request does not have token
    {
        resp.status(200).json({success: false, code : responseCodes.invalid_token});
        return;
    }

    //Verifing the token
    try
    {
        //Decoding the user id from the token
        const userId : string = await new Promise<string>((resolve, reject) => {
            jwt.verify(cookies.userToken, JWT_SECRET!, (err : any, decoded : any) => {
                if(err)
                    reject(err);
                else
                    resolve(decoded as string);
            });
        });

        //Adding the id to the request body
        req.body["userId"] = userId;

        next();
    }
    catch(err)
    {
        console.log(err);
        resp.status(200).json({success: false, code: responseCodes.invalid_token});
    }

}

/*****************************Functions*********************/
function getCookies(cookieStr : string | undefined) : any
{
    /*Returns an object containing the cookies in the given cookie string*/

    const cookies : any = {}; //The object containing the cookie mapping  
    if(cookieStr === undefined)
        return cookies;

    //Extracting the cookies
    const cookieStrs : string[] = cookieStr.split(';');
    let cookieComps : string[] | undefined;
    cookieStrs.forEach((keyVal : string) => {
        cookieComps = keyVal.split('=');
        cookies[cookieComps[0].trim()] = cookieComps[1];
    })

    return cookies;
}

/******************************Exports************************ */
export {addCorsHeaders, verifyUserToken};