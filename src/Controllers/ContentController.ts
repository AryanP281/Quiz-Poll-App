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

async function createQuiz(req: Request, resp: Response) : Promise<void>
{
    /*Create a new quiz*/

    //Getting the quiz details
    const quizDetails: {title: string, totalScore: number, questions: {text: string, options: {text: string, isAns: Boolean}[] }[] } | undefined = req.body.quizDetails;

    //Validating input
    if(!quizDetails || quizDetails.title.length == 0 || quizDetails.questions.length == 0)
    {
        resp.status(200).json({success: false, code: responseCodes.invalid_new_content});
        return;
    }

    let dbConn: PoolClient | null = null;
    try
    {
        //Getting a connection from the pool
        dbConn = await db!.connect();

        //Starting the transaction
        await dbConn.query("START TRANSACTION");

        //Saving quiz
        const quizId : number = (await dbConn.query("INSERT INTO \"Quiz\"(creatorhash, title, score) VALUES ($1,$2,$3) RETURNING quizid", 
        [req.body.userId, quizDetails.title, quizDetails.totalScore])).rows[0].quizid;

        //Adding the questions
        let sqlQuery : string = "INSERT INTO \"QuizQuestion\" (quizid, questionid, text, ismcq) VALUES "; //Constructing the query
        let values : any[] = [];
        quizDetails.questions.forEach((question, id) => {
            const answersCount : number = question.options.filter((option) => option.isAns).length;
            sqlQuery += `(${quizId}, $${2*id+1}, $${2*id+2}${answersCount == 1 ? ",false":",true"}),`;
            values.push(id, question.text);
        });
        sqlQuery = sqlQuery.slice(0, sqlQuery.length - 1); //Getting rid of the trailing comma after the last tuple
        await dbConn.query(sqlQuery, values);

        //Adding the options
        sqlQuery = "INSERT INTO \"QuizOption\" VALUES ";
        values = [];
        quizDetails.questions.forEach((question, questionId) => {
            question.options.forEach((option, optionId) => {
                sqlQuery += `(${quizId}, ${questionId}, ${optionId}, $${values.length+1}, $${values.length+2}),`;
                values.push(option.text);
                values.push(option.isAns);
            });
        });
        sqlQuery = sqlQuery.slice(0, sqlQuery.length-1); //Getting rid of the trailing comma after the last tuple
        await dbConn.query(sqlQuery, values);

        //Committing the transaction
        await dbConn.query("COMMIT");

        resp.status(200).json({success: true, quizId: quizId});
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

async function saveUserQuizResults(req : Request, resp : Response) : Promise<void>
{
    /*Calculates and returns the user score for the given quiz*/

    if(!req.body.userChoices)
    {
        resp.status(200).json({success: false, code: responseCodes.content_not_found});
        return;
    }
    
    //Constructing the user choices object
    const userChoices : {quizId : number, choices: {questionId: number, optionIds: number[]}[] } = {quizId: parseInt(req.body.userChoices.quizId), choices: []};
    req.body.userChoices.choices.forEach((question : {questionId:string,optionIds:string[]}) => {
        const newChoice: {questionId: number, optionIds: number[]} = {questionId: parseInt(question.questionId), optionIds: []};
        question.optionIds.forEach((id:string) => newChoice.optionIds.push(parseInt(id)));
        userChoices.choices.push(newChoice);
    });

    let dbConn : PoolClient | null = null;
    try
    {
         //Getting a connection from the connection poll
         dbConn = await db!.connect()
        
        //Checking if the user has already participated in the quiz
        const hasAlreadyAttempted : boolean = (await dbConn.query("SELECT COUNT(*) FROM \"QuizScores\" WHERE quizid=$1 AND userhash=$2", 
        [userChoices.quizId, req.body.userId])).rows[0].count != 0;
        if(hasAlreadyAttempted)
        {
            resp.status(200).json({success: false, code: responseCodes.user_already_participated});
            return;
        }
        
        //Calculating the points per question for the quiz
        const quizScoreDetails : {score: number, questioncount: number | string} = (await dbConn.query("SELECT Q.score, COUNT(O.questionid) AS questioncount FROM \"Quiz\" Q, \"QuizQuestion\" O WHERE O.quizid=Q.quizid AND Q.quizid=$1 GROUP BY Q.score", 
        [userChoices.quizId])).rows[0];
        quizScoreDetails.questioncount = parseInt(quizScoreDetails.questioncount as string);
        const pointsPerQuestion : number = quizScoreDetails.score / quizScoreDetails.questioncount; 

        //Getting the correct options for each question
        const correctOptions : Map<number, Set<number>> = new Map();
        (await db!.query("SELECT questionid,optionid FROM \"QuizOption\" WHERE quizid=$1 AND isans=true", 
        [userChoices.quizId])).rows.forEach((row : {questionid: number, optionid: number}) => {
            if(!correctOptions.has(row.questionid))
                correctOptions.set(row.questionid, new Set<number>());
            correctOptions.get(row.questionid)!.add(row.optionid);
        });

        //Calculating player score
        let playerScore : number = 0;
        let correctOptionsSet : Set<number> | undefined = undefined; //The set of correct options for the current question 
        userChoices.choices.forEach((question) => {
            correctOptionsSet = correctOptions.get(question.questionId);
            let allCorrect : boolean = true;
            for(let i = 0; i < question.optionIds.length && allCorrect; ++i)
            {
                allCorrect = (allCorrect && correctOptionsSet!.has(question.optionIds[i]));
            }
            if(allCorrect)
                playerScore += pointsPerQuestion;
        });

        //Starting the transaction
        await dbConn.query("START TRANSACTION");

        //Saving the user results
        let sqlQuery = "INSERT INTO \"QuizResults\"(quizid,questionid,optionid,userhash) VALUES ";
        userChoices.choices.forEach((question : {questionId: number, optionIds: number[]}) => {
            question.optionIds.forEach((optionId : number) => {
                sqlQuery += `(${userChoices.quizId},${question.questionId},${optionId},'${req.body.userId}'),`;
            });
        });
        sqlQuery = sqlQuery.slice(0, sqlQuery.length-1); //Getting rid of the trailing comma after the last tuple
        await dbConn.query(sqlQuery);

        //Saving the user score
        await dbConn.query("INSERT INTO \"QuizScores\"(quizid,userhash,score) VALUES($1,$2,$3)", [userChoices.quizId, req.body.userId, playerScore]);

        //Committing the transaction
        await dbConn.query("COMMIT");

        resp.status(200).json({success: true, code: responseCodes.success});
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

async function getUserQuizResults(req : Request, resp: Response) : Promise<void>
{
    //Checking if quiz id has been provided
    if(!req.params.quizId)
    {
        resp.status(200).json({success: false, code: responseCodes.content_not_found});
        return;
    }

    try
    {
        const userResults : {quizId:string, score: number, questions:{questionId:number,choices:{optionId:number,isAns:boolean}[]}[]} = {quizId: req.params.quizId, score: 0, questions:[]};
        
        //Getting the user choices
        const sqlQuery : string = "SELECT O.questionid,O.optionid,O.isans,S.score FROM \"QuizResults\" R INNER JOIN \"QuizOption\" O ON O.quizid=R.quizid AND O.questionid=R.questionid AND O.optionid=R.optionid INNER JOIN \"QuizScores\" S ON S.quizid=R.quizid AND S.userhash=R.userhash WHERE R.quizid=$1 AND R.userhash=$2;";
        const queryResults : any[] = (await db!.query(sqlQuery, [req.params.quizId, req.body.userId])).rows;
        for(let i = 0; i < queryResults.length; ++i)
        {
            if(i === 0 || queryResults[i].questionid !== queryResults[i-1].questionid)
                userResults.questions.push({questionId:queryResults[i].questionid,choices:[]});
            userResults.questions[userResults.questions.length-1].choices.push({optionId: queryResults[i].optionid, isAns: queryResults[i].isans});
        }
        userResults.score = queryResults[0].score;
        
        resp.status(200).json({success:true, userResults});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function getQuiz(req: Request, resp: Response) : Promise<void>
{
    /*Retrives and responds with the given quiz details*/

    try
    {
        const quizId : number | undefined = parseInt(req.params.quizId); //Getting the quiz id
        if(!quizId)
        {
            resp.status(200).json({success: false, code: responseCodes.content_not_found});
            return;
        }

        //Retrieving the quiz details
        let sqlQuery : string = "SELECT title,score,username AS creator FROM \"Quiz\" INNER JOIN \"User\" ON userhash=creatorhash WHERE quizid=$1";
        const quizDetails : any = (await db!.query(sqlQuery, [quizId])).rows[0];
        if(!quizDetails)
        {
            resp.status(200).json({success: false, code: responseCodes.content_not_found});
            return;
        }

        //Retrieving the question details
        sqlQuery = "SELECT Q.questionid,Q.text AS questiontext,Q.ismcq,O.optionid,O.text AS optiontext FROM \"QuizQuestion\" Q, \"QuizOption\" O WHERE O.questionid=Q.questionid AND O.quizid=Q.quizid AND Q.quizid=$1 ORDER BY Q.questionid";
        const questionsDetails : any[] = (await db!.query(sqlQuery, [quizId])).rows;
        quizDetails.questions = []; //Initalizing the questions list
        questionsDetails.forEach((det) => {
            if(quizDetails.questions.length === det.questionid)
                quizDetails.questions.push({id: det.questionid, text: det.questiontext, isMcq: det.ismcq, options: []});
            quizDetails.questions[det.questionid].options.push({id: det.optionid, text: det.optiontext});
        })
        
        resp.status(200).json({success: true, quizDetails});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function getGuestQuizResults(req : Request, resp: Response) : Promise<void> 
{
    /*Gets the quiz results for guest user */

    if(!req.body.userChoices)
    {
        resp.status(200).json({success: false, code: responseCodes.content_not_found});
        return;
    }
    
    //Constructing the user choices object
    const userChoices : {quizId : number, choices: {questionId: number, optionIds: number[]}[] } = {quizId: parseInt(req.body.userChoices.quizId), choices: []};
    req.body.userChoices.choices.forEach((question : {questionId:string,optionIds:string[]}) => {
        const newChoice: {questionId: number, optionIds: number[]} = {questionId: parseInt(question.questionId), optionIds: []};
        question.optionIds.forEach((id:string) => newChoice.optionIds.push(parseInt(id)));
        userChoices.choices.push(newChoice);
    });

    try
    {

        //Calculating the points per question for the quiz
        const quizScoreDetails : {score: number, questioncount: number | string} = (await db!.query("SELECT Q.score, COUNT(O.questionid) AS questioncount FROM \"Quiz\" Q, \"QuizQuestion\" O WHERE O.quizid=Q.quizid AND Q.quizid=$1 GROUP BY Q.score", 
        [userChoices.quizId])).rows[0];
        quizScoreDetails.questioncount = parseInt(quizScoreDetails.questioncount as string);
        const pointsPerQuestion : number = quizScoreDetails.score / quizScoreDetails.questioncount; 

        //Getting the correct options for each question
        const correctOptions : Map<number, Set<number>> = new Map();
        (await db!.query("SELECT questionid,optionid FROM \"QuizOption\" WHERE quizid=$1 AND isans=true", 
        [userChoices.quizId])).rows.forEach((row : {questionid: number, optionid: number}) => {
            if(!correctOptions.has(row.questionid))
                correctOptions.set(row.questionid, new Set<number>());
            correctOptions.get(row.questionid)!.add(row.optionid);
        });

        //Creating the user results object
        const userResults : {quizId:string,score:number,questions:{questionId:number,choices:{optionId:number,isAns:boolean}[]}[]} = {
            quizId: req.body.userChoices.quizId,
            score: 0,
            questions: []
        };

        //Calculating player score
        let correctOptionsSet : Set<number> | undefined = undefined; //The set of correct options for the current question 
        userChoices.choices.forEach((question) => {
            userResults.questions.push({questionId: question.questionId, choices:[]}); //Adding the question to the user results

            correctOptionsSet = correctOptions.get(question.questionId);
            
            let allCorrect : boolean = true;
            for(let i = 0; i < question.optionIds.length; ++i)
            {
                allCorrect = (allCorrect && correctOptionsSet!.has(question.optionIds[i]));
                userResults.questions[userResults.questions.length-1].choices.push({optionId: question.optionIds[i], 
                    isAns: correctOptionsSet!.has(question.optionIds[i])}) //Adding option to user results
            }
            if(allCorrect)
                userResults.score += pointsPerQuestion;

        });

        resp.status(200).json({success: true, guestResults: userResults});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function checkUserAttemptedQuiz(req : Request, resp: Response) : Promise<void>
{
    /*Checks if the user has already attempted the given quiz*/

    try
    {
        const quizId : number | undefined = parseInt(req.params.quizId); //Getting the quiz id
        if(!quizId)
        {
            resp.status(200).json({success: false, code: responseCodes.content_not_found});
            return;
        }

        const hasAttempted : boolean = parseInt((await db!.query("SELECT COUNT(*) FROM \"QuizScores\" WHERE quizid=$1 AND userhash=$2", 
        [quizId,req.body.userId])).rows[0].count) !== 0;

        resp.status(200).json({success:true,hasAttempted});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

/**************************Functions**********************/

/**************************Exports**********************/
export {createPoll, getPoll, addVoteToPoll, getUserPolls, addGuestVote, createQuiz, saveUserQuizResults, getUserQuizResults, 
    getGuestQuizResults, getQuiz, checkUserAttemptedQuiz};

