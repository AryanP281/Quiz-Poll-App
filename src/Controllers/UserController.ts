
/************************Imports*********************** */
import {Request, Response} from "express";
import {Collection, ObjectId, Document} from "mongodb";
import { responseCodes } from "../Config/App";
import {mongodb} from "../Config/Mongo";

/*************************Variables********************** */
let userDetailsCollection : Collection | null = null; //The collection containing the user details

/*************************Functions********************** */
async function editUserDetails(req : Request, resp : Response) : Promise<void> 
{
    /*Edits the given user's details */

    try
    {
        //Checking if the provided details are valid
        if(!req.body.userDetails)
        {
            resp.status(200).json({success: false, code: responseCodes.invalid_user_details});
            return;
        }
        
        //Getting the user details collection
        if(!userDetailsCollection)
            userDetailsCollection = await mongodb.db().collection("UserDetails");

        //Creating the set object containing the values to be updates
        const setObj : any = {};
        const valsToUpdate : [string,any][] = Object.entries(req.body.userDetails);   
        if(valsToUpdate.length > 0)
        {
            //Adding the values to be updated
            valsToUpdate.forEach(([key,value] : [string,any]) => {
                setObj[key] = value;
            });
            
            //Editing the user details document
            await userDetailsCollection.updateOne({_id : new ObjectId(req.body.userId)}, {$set : setObj});
        }
       resp.status(200).json({success: true, code: responseCodes.success});   
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function getUserProfile(req : Request, resp : Response) : Promise<void> 
{
    /*Returns the profile details of the given user */

    try
    {
        //Getting the user details collection
        if(!userDetailsCollection)
            userDetailsCollection = await mongodb.db().collection("UserDetails");

        //Getting the user details document
        const userDoc : Document | undefined = await userDetailsCollection.findOne({_id : new ObjectId(req.body.userId)}, {projection : {_id : 0}});
        if(!userDoc)
            throw Error("User details document not found");
        
        resp.status(200).json({success : true, user : userDoc});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

/************************Exports*********************** */
export {editUserDetails, getUserProfile};
