/******************************Imports**************************** */
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import {apiBaseUrl, authStatus} from "../Config/Config";

/******************************Variables**************************** */
const getPollApiBaseUrl = `${apiBaseUrl}/content/poll`; //The base url for the get poll request
const addVoteApiUrl = `${apiBaseUrl}/content/poll/vote`; //The api url to add the user's vote in the poll
const addGuestVoteApiUrl = `${addVoteApiUrl}/guest`; //The api url to add the guest vote
let pollId; //The id of the current poll
let voted = undefined; //Indicates if the user has voted in the given poll

/******************************Components**************************** */
function Poll()
{
    pollId = useParams().pollId; //The id of the poll to be displayed
    const [poll, setPoll] = useState(null); //The poll data to be displayed
    const history = useHistory();

    //Getting the user auth status
    const userAuthStatus = (sessionStorage.getItem("authStatus") === null) ? authStatus.guest : sessionStorage.getItem("authStatus");

    //Getting the poll details
    useEffect(() => {
        getPoll(pollId, setPoll); //Getting the poll details
    }, []);

    //Checking if the user is a guest and has already voted in the poll
    useEffect(() => checkIfGuestUserHasVoted(userAuthStatus), [voted]);

    console.log("Poll")

    return (
        <div className="poll">
            <div className="poll-box">
                <div className="box-title-bar" style={{flexBasis: "10%", flexGrow: 1}}>
                    {userAuthStatus === authStatus.logged && <button onClick={() => history.push("/")}>Home</button>}
                    {userAuthStatus === authStatus.guest && <button onClick={() => history.push("/signin")}>Sign In</button>}
                    <h1>{(poll && poll.name.length) ? poll.name : "Loading"}</h1>
                    <button onClick={copyShareableLink}>Share</button>
                </div>

                <div className="poll-results">
                    {poll && <PollGraph options={poll.options}/>}
                </div>

                <div className="poll-choices">
                    {poll && poll.options.map((option) => {
                        return(
                            <button key={option.id} class="poll-option-btn" disabled={voted} onClick={() => {
                                addUserVote(option.id,userAuthStatus,poll, setPoll);
                            }} style={{backgroundColor: (voted !== undefined ? (option.id === voted ? "var(--bg-gradient-end)" : "grey") : "")}}>{option.txt}</button>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

function PollGraph(props)
{
    const options = props.options;
    const graphColors = ["#d61609", "#f5ed07", "#39d10f", "#0f4fd1"]; //The colors to be used for the bar graphs

    //Calculating total votes
    let totalVotes = 0;
    options.forEach((option) => totalVotes += option.votes);
    totalVotes = Math.max(totalVotes, 1);

    //Calculating percentage votes for each option
    for(let i = 0; i < options.length; ++i)
    {
        options[i].percentage = options[i].votes * 100 / totalVotes;
    }

    //Returns the style to be used for bar with given percentage value
    const getBarStyle = (percentage, index) => {
        return {
            flexBasis: `${percentage}%`,
            backgroundColor: graphColors[(index % graphColors.length)],
            color: "white",
            display: "flex"
        };
    }

    return (
        <div className="poll-graph">
            {options.map((option, index) => {
                return (
                    <div className="poll-graph-bar" key={option.id}>
                        <div style={getBarStyle(option.percentage, index)}>
                            <h5 style={{textAlign: "center", alignSelf: "center", flexGrow: 1}}>{Math.floor(option.percentage)}%</h5>
                        </div>
                        <h5 style={{textAlign: "center", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{option.txt}</h5>
                    </div>
                );
            })}
        </div>
    );
}

/******************************Functions**************************** */
function getPoll(pollId, setPoll)
{
    /*Fetches the data for the poll with the given id */

    //Creating the url
    const requestUrl = `${getPollApiBaseUrl}/${pollId}`;

    //Fetching the poll data
    fetch(requestUrl, {
        method: "GET",
        credentials: "include"
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw Error(resp.status);
        return resp.json();
    })
    .then((data) => {
        if(!data.success)
            console.log(data)
        else
        {
            if(data.userVoted !== -1)
                voted = data.userVoted;

            setPoll(data.poll);
            return;
        }
    })
    .catch((err) => {
        console.log(err);
        alert("Failed to load poll");
    })

}

function addUserVote(voteId, userAuthStatus, polls, setPolls)
{
    /*Adds the user's vote to the poll */

    const requestUrl = userAuthStatus === authStatus.logged ? addVoteApiUrl : addGuestVoteApiUrl;

    //Sending request to vote
    fetch(requestUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({pollId, voteId})
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw Error(resp.status);
        return resp.json();
    })
    .then((data) => {
        if(!data.success)
            throw Error(data.code);

        voted = voteId;

        //Updating list of voted polls for guest user
        if(userAuthStatus === authStatus.guest)
            updateGuestVotesList(pollId, voteId);
        
        //Updating the polls
        const newPoll = {...polls};
        newPoll.options[voteId].votes++;
        setPolls(newPoll);
    })
    .catch((err) => {
        console.log(err);
        alert("Failed to vote");
        voteId = null;
    });

}

function copyShareableLink()
{
    /*Copies the page url for sharing*/

    //Getting the page url
    const pageUrl = window.location.href;

    //Saving url to clipboard
    const el = document.createElement('input');
    el.value = pageUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

}

function checkIfGuestUserHasVoted(userAuthStatus)
{
    /*Checks if the user is a guest and has already voted in the poll*/

    if(userAuthStatus === authStatus.guest)
    {
        let votedPolls = sessionStorage.getItem("guestVotes"); //Getting the polls in which the guest has voted
        if(votedPolls !== null)
        {
            votedPolls = JSON.parse(votedPolls);
            if(votedPolls[pollId])
                voted = votedPolls[pollId];
        }
    }
}

function updateGuestVotesList(pollId, voteId)
{
    /*Updates the list of polls in which the guest user has voted */

    let guestVotes = sessionStorage.getItem("guestVotes");
    if(guestVotes === null)
        guestVotes = {};
    else
        guestVotes = JSON.parse(guestVotes);

    //Adding the new vote to the votes object
    guestVotes[pollId] = voteId;

    //Saving the updated list
    sessionStorage.setItem("guestVotes", JSON.stringify(guestVotes));
}

/******************************Exports**************************** */
export default Poll;