
/************************Imports*********************** */
import {Request, Response} from "express";
import { responseCodes } from "../Config/App";
import {profilePicturesStorageRef} from "../Config/Firebase";
import { db } from "../Config/Postgres";

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
        let profilePicUrl : string | null = null;
        if(req.file)
        {
            profilePicUrl= await updateUserProfilePic(userId, req.file.buffer);
            if(profilePicUrl === null)
                throw Error("Failed to update user profile pic")
        }
        
        //Updating the user details
        const valsToUpdate : string[] = Object.keys(req.body);
        if(profilePicUrl)
        {
            valsToUpdate.push("imgUrl");
            req.body.imgUrl = profilePicUrl;
            console.log(profilePicUrl)
        }
        if(valsToUpdate.length)
        {
            //Generating the sql query
            let sqlQuery : string = "UPDATE \"User\" SET ";
            const vals : any[] = [];
            for(let i = 0; i < valsToUpdate.length - 1; ++i)
            {
                sqlQuery += `${valsToUpdate[i]}=$${i+1}, `;
                vals.push(req.body[valsToUpdate[i]]);
            }
            sqlQuery += `${valsToUpdate[valsToUpdate.length-1]}=$${valsToUpdate.length}`;
            vals.push(req.body[valsToUpdate[valsToUpdate.length-1]]);
            sqlQuery += ` WHERE userHash=$${valsToUpdate.length+1}`;
            vals.push(userId);

            //Executing the query
            await db!.query(sqlQuery, vals);
        }
        
        resp.status(200).json({success: true, user: {profilePicUrl}});
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
        //Getting the user details
        const userDetails : any = (await db!.query("SELECT bdate, username, imgUrl FROM \"User\" WHERE userHash = $1", [req.body.userId])).rows[0];

        //Dividing the user bdate into bday,bmonth and byear
        if(userDetails.bdate)
        {
            userDetails.byear = userDetails.bdate.getFullYear();
            userDetails.bmonth = userDetails.bdate.getMonth();
            userDetails.bday = userDetails.bdate.getDate();
            delete userDetails.bdate;
        }

        resp.status(200).json({success: true, user : userDetails});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function checkUserVote(req : Request, resp: Response) : Promise<void>
{
    /*Checks if the user has voted in the given poll*/

    try
    {
        const queryRes : any = (await db!.query("SELECT optionId FROM \"PollVote\" WHERE userHash=$1 AND pollId=$2", [req.body.userId, req.params.pollId])).rows

        resp.status(200).json({success:true, userVote: ((queryRes.length) ? queryRes[0].optionid : -1)});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }

}

async function getUserScore(req : Request, resp : Response)
{
    /*Returns the user score for the given quiz*/

    try
    {
        const quizId : number = parseInt(req.query.quizid as string); //Getting the quiz id

        //Getting the user results for the quiz
        const userResults : any | undefined = (await db!.query("SELECT score FROM \"QuizScores\" WHERE quizid=$1 AND userhash=$2", 
        [quizId, req.body.userId])).rows[0];
        if(!userResults)
        {
            resp.status(200).json({success: false, code: responseCodes.user_not_participated});
            return;
        }

        resp.status(200).json({success: true, score: userResults.score});
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
export {editUserDetails, getUserProfile, checkUserVote, getUserScore};
