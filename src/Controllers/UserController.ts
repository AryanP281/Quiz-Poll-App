
/************************Imports*********************** */
import {Request, Response} from "express";
import {Collection, ObjectId, Document} from "mongodb";
import { responseCodes } from "../Config/App";
import {mongodb} from "../Config/Mongo";
import {profilePicturesStorageRef} from "../Config/Firebase";

/*************************Variables********************** */

/*************************Functions********************** */
async function editUserDetails(req : Request, resp : Response) : Promise<void> 
{
    /*Edits the given user's details */
    
    try
    {
        
        //Checking if the provided details are valid
        if(!req.body)
        {
            resp.status(200).json({success: false, code: responseCodes.invalid_user_details});
            return;
        }

        //Getting the user id
        const userId : string = req.body.userId;
        delete req.body.userId;
        
        //Updating the user profile pic
        const setObj : any = {};
        if(req.file)
        {
            const profilePicUrl : string | null = await updateUserProfilePic(userId, req.file.buffer);
            if(profilePicUrl === null)
                throw Error("Failed to update user profile pic")
            else
                setObj["picUrl"] = profilePicUrl;
        }
            
        //Getting the user details collection
        const userDetailsCollection = await mongodb.db().collection("UserDetails");

        //Creating the set object containing the values to be updates
        const valsToUpdate : [string,any][] = Object.entries(req.body);
        if(valsToUpdate.length > 0 || setObj.picUrl)
        {
            //Adding the values to be updated
            valsToUpdate.forEach(([key,value] : [string,any]) => {
                setObj[key] = value;
            });
            
            //Editing the user details document
            await userDetailsCollection.updateOne({_id : new ObjectId(userId)}, {$set : setObj});
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
        const userDetailsCollection = await mongodb.db().collection("UserDetails");

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

/************************Functions*********************** */
async function updateUserProfilePic(userId : string, userPicBytes : Buffer) : Promise<string | null>
{
    /*Updates the user profile pic in firebase storage */

    try
    {
        //Deleting the old profile pic
        try
        {
            await profilePicturesStorageRef.child(`${userId}.jpg`).delete();
        }
        catch(err)
        {
            //Handles File Does Not Exist error
        }

        //Adding the new profile picture
        const snapshot = await profilePicturesStorageRef.child(`${userId}.jpg`).put(userPicBytes, {contentType: "image/jpeg"});

        //Returning the image download url
        return (await snapshot.ref.getDownloadURL());
    }
    catch(err)
    {
        console.log(err);
    }

    return null;
} 

/************************Exports*********************** */
export {editUserDetails, getUserProfile};
