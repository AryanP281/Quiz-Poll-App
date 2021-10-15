/**************************Imports**********************/
import {Request, Response} from "express";
import { PoolClient } from "pg";
import {responseCodes } from "../Config/App";
import {db} from "../Config/Postgres";

/**************************Variables**********************/


/**************************Controllers**********************/
async function createPoll(req : Request, resp : Response) : Promise<void>
{
    /*Adds a new poll to the database */

    //Checking if poll object is empty
    if(!req.body.poll || !req.body.poll.name || !req.body.poll.name.length || !req.body.poll.options || !req.body.poll.options.length)
    {
        resp.status(200).json({success:false, code: responseCodes.invalid_new_content});
        return;
    }

    let dbConn : PoolClient | null = null;
    try
    {   
        //Getting a connection from the connection poll
        dbConn = await db!.connect()

        //Starting the transaction
        await dbConn.query("START TRANSACTION");

        //Adding the new poll to database
        const pollId : number = (await dbConn.query("INSERT INTO \"Poll\"(creatorHash,title) VALUES ($1,$2) RETURNING pollId", [req.body.userId, req.body.poll.name])).rows[0].pollid
        
        //Adding the poll options to database
        let sqlQuery : string = "INSERT INTO \"PollOption\"(pollId,optionId,text) VALUES ";
        const values : string[] = [];
        for(let i = 0; i < req.body.poll.options.length-1; ++i)
        {
            sqlQuery += `(${pollId},${i},$${i+1}), `;
            values.push(req.body.poll.options[i]);
        }
        sqlQuery += `(${pollId},${req.body.poll.options.length - 1},$${req.body.poll.options.length})`;
        values.push(req.body.poll.options[req.body.poll.options.length - 1]);
        await dbConn.query(sqlQuery, values);

        //Committing the transaction
        await dbConn.query("COMMIT");

        resp.status(200).json({success: true, pollId});
    }
    catch(err)
    {
        //Rolling back the transaction
        await dbConn?.query("ROLLBACK");
        
        console.log(err);
        resp.sendStatus(500); 
    }
    finally
    {
        dbConn?.release();
    }
}

async function getPoll(req : Request, resp : Response) : Promise<void>
{
    /*Returns the poll data with the given url param as id */

    try
    {
        //Checking if poll id has been provided
        if(!req.params.pollId)
        {
            resp.status(200).json({success: false, code: responseCodes.content_not_found});
            return;
        }

        //Getting the poll data
        const sqlQuery : string = "SELECT P.pollId, P.title, O.optionId, O.text,COUNT(voteId) AS votes FROM \"Poll\" P JOIN \"PollOption\" O ON O.pollId=P.pollId AND P.pollId=$1 LEFT JOIN \"PollVote\" V ON V.pollId=P.pollId AND V.optionId=O.optionId GROUP BY P.pollId, O.pollId,O.optionId;";
        const dbRes : any[] = (await db!.query(sqlQuery, [req.params.pollId])).rows;
        if(dbRes.length === 0)
        {
            resp.status(200).json({success: false, code: responseCodes.content_not_found});
            return;
        }
        
        const pollData : {title: string, options: {id:number,text:string,votes:number}[]} = {
            title: dbRes[0].title,
            options: []
        };
        dbRes.forEach((row) => {
            pollData.options.push({id: row.optionid, text: row.text, votes: parseInt(row.votes)});
        });

        
        resp.status(200).json({success: true, poll: pollData});
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
        const voteDetails : {pollId: string, optionId: number} | undefined = {pollId: req.body.pollId, optionId: req.body.optionId};
        if(!voteDetails || !voteDetails.pollId || voteDetails.optionId === undefined)
        {
            resp.status(200).json({success:false, code: responseCodes.content_not_found});
            return;
        }

        //Checking if the user has already voted in the poll
        const userVote : any = (await db!.query("SELECT COUNT(voteId) AS vote FROM \"PollVote\" WHERE userHash=$1 AND pollId=$2", [req.body.userId, voteDetails.pollId])).rows[0]
        console.log(userVote)
        if(parseInt(userVote.vote))
        {
            resp.status(200).json({success: false, code : responseCodes.user_already_participated});
            return;
        }

        //Adding the vote
        await db!.query("INSERT INTO \"PollVote\"(userHash,pollId,optionId) VALUES ($1,$2,$3)", [req.body.userId, voteDetails.pollId, voteDetails.optionId]);

        resp.status(200).json({success: true, code : responseCodes.success});

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
        //Getting the user polls
        const userPolls = (await db!.query("SELECT pollId, title, (SELECT COUNT(V.voteId) AS votes FROM \"PollVote\" V WHERE V.pollId=P.pollId) FROM \"Poll\" P WHERE creatorHash=$1", [req.body.userId])).rows;

        resp.status(200).json({success:true, polls: userPolls});
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
        const voteDetails : {pollId: string, optionId: number} | undefined = {pollId: req.body.pollId, optionId: req.body.optionId};
        if(!voteDetails || !voteDetails.pollId || voteDetails.optionId === undefined)
        {
            resp.status(200).json({success:false, code: responseCodes.content_not_found});
            return;
        }

        await db!.query("INSERT INTO \"PollVote\"(pollId,optionId) VALUES ($1,$2)", [voteDetails.pollId, voteDetails.optionId]);

        resp.status(200).json({success:true, code: responseCodes.success});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

/**************************Functions**********************/

/**************************Exports**********************/
export {createPoll, getPoll, addVoteToPoll, getUserPolls, addGuestVote};

