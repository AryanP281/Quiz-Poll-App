/**************************Imports**********************/
import {Request, Response} from "express";
import { Collection, Document, ObjectId } from "mongodb";
import { responseCodes } from "../Config/App";
import {mongodb} from "../Config/Mongo";

/**************************Variables**********************/


/**************************Controllers**********************/
async function createPoll(req : Request, resp : Response) : Promise<void>
{
    /*Adds a new poll to the database */

    try
    {
        //Checking if poll object is empty
        if(!req.body.poll || !req.body.poll.name || !req.body.poll.name.length || !req.body.poll.options)
        {
            resp.status(200).json({success:false, code: responseCodes.invalid_new_content});
            return;
        }

        //Getting the poll collection
        const pollCollection = await mongodb.db().collection("Polls");

        //Creating the poll object
        const currDate : Date = new Date(); //Getting the current date
        const poll : {name: string, options: {id:number,txt:string,votes:number}[], creationDate: {day:number,month:number,year:number}, creatorId: ObjectId} = {
            name: req.body.poll.name,
            options: req.body.poll.options.map((option : string, index: number) => {return {id: index, txt: option,votes:0}}),
            creationDate: {day: currDate.getUTCDate(), month: currDate.getUTCMonth(), year: currDate.getUTCFullYear()},
            creatorId: new ObjectId(req.body.userId)
        };

        //Writing the poll object to database
        const res : any = await pollCollection.insertOne(poll); 

        resp.status(200).json({success: true, pollId: res.insertedId.toString()});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500); 
    }
}

async function getPoll(req : Request, resp : Response) : Promise<void>
{
    /*Returns the poll data with the given url param as id */

    try
    {
        //Checking if poll id has been provided
        if(!req.params.pollId || req.params.pollId.length !== 24)
        {
            resp.status(200).json({success: false, code: responseCodes.content_not_found});
            return;
        }

        //Getting the polls collection
        const pollCollection = await mongodb.db().collection("Polls");

        //Getting the poll document
        const pollDocument : Document | undefined = await pollCollection.findOne({_id: new ObjectId(req.params.pollId)}, {projection:{_id:0}});
        if(!pollDocument)
        {
            resp.status(200).json({success: false, code: responseCodes.content_not_found});
            return;
        }

        //Checking if the user has already voted in the poll
        let voteId : number | null = null;
        if(req.body.userId)
            voteId = await checkUserHasVoted(req.body.userId, req.params.pollId);
        
        //Responding with poll data
        resp.status(200).json({success: true, poll: pollDocument, userVoted: (voteId !== null ? voteId : -1)});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }

}

async function addVoteToPoll(req : Request, resp : Response) : Promise<void>
{
    /*Adds the users vote to the given poll */
    
    try
    {
        //Getting the vote details
        const voteDetails : {pollId: string, voteId: number} | undefined = {pollId: req.body.pollId, voteId: req.body.voteId};
        if(!voteDetails || !voteDetails.pollId || voteDetails.pollId.length != 24 || voteDetails.voteId === undefined)
        {
            resp.status(200).json({success:false, code: responseCodes.content_not_found});
            return;
        }

        //Getting the poll collection
        const pollCollection = await mongodb.db().collection("Polls");

        //Updating poll document
        await pollCollection.updateOne({_id: new ObjectId(voteDetails.pollId), "options.id" : voteDetails.voteId}, {$inc: {"options.$.votes": 1}});
        
        //Getting the user collection
        const userCollection = await mongodb.db().collection("UserDetails");

        //Updating the user votes list
        await userCollection.updateOne({_id: new ObjectId(req.body.userId)}, {$push: {votes: {id: new ObjectId(voteDetails.pollId), voteId: voteDetails.voteId}}});

        resp.status(200).json({success:true, code: responseCodes.success});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function getUserPolls(req : Request, resp : Response) : Promise<void>
{
    /*Returns details of the polls created by the given user */

    try
    {
        //Getting the polls collection
        const pollCollection = await mongodb.db().collection("Polls");

        //Getting the documents for polls created by the user
        const userPoll = await pollCollection.find({creatorId: new ObjectId(req.body.userId)}, {projection: {_id:true,name:true,options:true}}).toArray();
        
        //Creating the user poll details object
        const userPollDetails : {id:string,name:string,votes:number}[] = [];
        userPoll.forEach((poll) => {
            userPollDetails.push({id:poll._id.toString(), name: poll.name, votes: getPollVotesCount(poll.options)});
        });

        resp.status(200).json({success:true, polls: userPollDetails});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function addGuestVote(req: Request, resp: Response) : Promise<void> 
{
    /*Adds a guest users vote to the poll */

    try 
    {
        //Getting the vote details
        const voteDetails : {pollId: string, voteId: number} | undefined = {pollId: req.body.pollId, voteId: req.body.voteId};
        if(!voteDetails || !voteDetails.pollId || voteDetails.pollId.length != 24 || voteDetails.voteId === undefined)
        {
            resp.status(200).json({success:false, code: responseCodes.content_not_found});
            return;
        }

        //Getting the polls collection
        const pollCollection : Collection = await mongodb.db().collection("Polls");

        //Updating the poll votes
        await pollCollection.updateOne({_id: new ObjectId(voteDetails.pollId), "options.id": voteDetails.voteId}, {$inc: {"options.$.votes": 1}});

        resp.status(200).json({success:true, code: responseCodes.success});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

/**************************Functions**********************/
async function checkUserHasVoted(userId: string, pollId: string) : Promise<number | null>
{
    /*Checks and whether the user has already voted in the given poll and returns the vote id*/

    //Getting the user documents collection
    const userCollection = await mongodb.db().collection("UserDetails");

    //Getting the user votes list
    const userVotes : {id:ObjectId, voteId:number}[] = (await userCollection.findOne({_id: new ObjectId(userId)}))!.votes;

    //Checking if the votes list contains the given poll
    for(let i = 0; i < userVotes.length; ++i)
    {
        if(userVotes[i].id.toString() === pollId)
            return userVotes[i].voteId;
    }

    return null;
}

function getPollVotesCount(pollOptions : {id:number,txt:string,votes:number}[]) : number
{
    /*Returns the total number of people that have voted in this poll */

    let votesCount : number = 0;

    pollOptions.forEach((option) => votesCount += option.votes);
    
    return votesCount;
}


/**************************Exports**********************/
export {createPoll, getPoll, addVoteToPoll, getUserPolls, addGuestVote};