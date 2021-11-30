/******************************Imports**************************** */
import {useState} from "react";
import {FcDeleteRow, FcAddRow} from "react-icons/fc";
import { useHistory } from "react-router-dom";
import {apiBaseUrl, authStatus} from "../Config/Config";
import {toast} from "react-hot-toast";

/******************************Variables**************************** */
let newOptionId = 0; //The id for new option. Its unique for each option
const createNewPollApiUrl = `${apiBaseUrl}/content/createpoll`; //The api url to create new poll
const errorMessages = ["Poll title cannot be empty", "Poll should have atleast one non-empty option", "Failed to create new poll"];
let pollCreationSemaphore = false; //A semaphore to prevent multiple clicks of create poll button
let redirected = false; //Semaphore to control redirection to login page

/******************************Components**************************** */
function NewPoll()
{
    const [options, setOptions] = useState([]); //The poll options
    const [resStatus, setResStatus] = useState([0,false]); //Result status. resStatus[0] = errorWord and resStatus[1] indicates whether to show loading spinner
    const history = useHistory();

    //Checking if the user is logged in
    const userAuthStatus = sessionStorage.getItem("authStatus");
    if((userAuthStatus === null || userAuthStatus !== authStatus.logged) && !redirected)
    {
        redirected = true;
        toast("Please login to create poll");
        history.replace("/signin");
        return null
    }

    console.log("New Poll")

    return(
        <div className="new-poll">
            <div className="new-poll-box">
                <div className="box-title-bar">
                    <button onClick={() => history.push("/")}>Home</button>
                    <h1>New Poll</h1>
                    <div />
                </div>
                <form onSubmit={(event) => {
                    event.preventDefault();
                }}>
                    <input type="text" id="poll_title" placeholder="Enter Question" className={(resStatus[0] & 1) ? "invalid-input" : "textbox"}/>
                    <div>
                        {options.map((option) => <NewPollOption key={option.id} option={option} options={options} setOptions={setOptions}/>)}
                    </div>
                    <div id="new-option-btn-container">
                        <button id="new-option-btn" onClick={() => addNewOption(options, setOptions)}> <FcAddRow size={40}/> </button>
                    </div>

                    <button className="create-btn" type="submit" onClick={() => {
                            console.log(pollCreationSemaphore)
                            if(!pollCreationSemaphore)
                            {
                                pollCreationSemaphore = true;
                                createNewPoll(options, setResStatus, history)
                            }
                        }}>Create Poll</button>
                </form>

                <div className="error-messages">
                    {resStatus[1] && <div className="loading-spinner" style={{margin: "auto"}}/> }
                    {(resStatus[0] !== 0) && getErrorMessages(resStatus[0])}
                </div>

            </div>
        </div>
    );
}

function NewPollOption(props)
{
    const option = props.option;

    return (
        <div className="new-poll-option">
            <input className="textbox" type="text" onChange={(e) => option.txt= e.target.value} placeholder={option.txt.length ? option.txt : "Enter new option"} style={{flexBasis: "90%", flexGrow: "2"}}/>
            <button onClick={() => deleteOption(option, props.options, props.setOptions)}>
                <FcDeleteRow size={40}/>
            </button>
        </div>
    )
}

/******************************Functions**************************** */
function addNewOption(options, setOptions)
{
    /*Adds a new blank option to the options list*/

    const newOptions = [];
    options.forEach((option) => {
        newOptions.push({id: option.id, txt: option.txt})
    });
    newOptions.push({id: newOptionId, txt: ""});
    newOptionId++;

    setOptions(newOptions);
}

function deleteOption(option, options, setOptions)
{
    /*Deletes the given option*/

    const newOptions = [];
    options.forEach((opt) => {
        if(opt.id !== option.id)
            newOptions.push(opt);
    });

    setOptions(newOptions);
}

function createNewPoll(opts, setResStaus, history)
{
    /*Creates the new poll */

    //Creating the new poll object
    const newPoll = {
        name: document.getElementById("poll_title").value.trim(),
        options : (() => {
            const nonEmptyOptions = [];
            let optionTxt;
            opts.forEach((option) => {
                optionTxt = option.txt.trim();
                if(optionTxt.length !== 0)
                    nonEmptyOptions.push(optionTxt);
            });
            return nonEmptyOptions;
        })()
    }; 
    console.log(newPoll)

    //Checking if entered details are valid
    const errorWord = validatePollDetails(newPoll);
    if(errorWord === 0)
    {
        //Displaying loading spinner
        setResStaus([0, true]);

        //Sending request to create new poll
        fetch(createNewPollApiUrl, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            credentials: "include",
            body: JSON.stringify({poll:newPoll})
        })
        .then((resp) => {
            if(resp.status !== 200)
                throw Error(resp.status);
            return resp.json();
        })
        .then((data) => {
            if(!data.success)
            {
                setResStaus([3, false]);
                return;
            }
            else
            {
               //Redirecting to poll page
                history.replace(`/poll/${data.pollId}`);
                return;
            }
        })
        .catch((err) => {
            console.log(err);
            setResStaus([4, false]);
        })
        .finally(() => pollCreationSemaphore = false)
    }
    else
        setResStaus([errorWord, false]);

}

function validatePollDetails(poll)
{
    /*Checks if the entered poll details are valid */

    let errorWord = 0; //The error word to indicate the errors
    
    //Checking poll title
    errorWord |= (poll.name.length === 0);

    //Checking the poll options
    errorWord |= (poll.options.length === 0) << 1;

    return errorWord;
}

function getErrorMessages(errorWord)
{
    /*Returns the error messages to be displayed */

    const errors = [];
    for(let i = 0; i < errorMessages.length; ++i)
    {
        if(errorWord & (1 << i))
            errors.push(<h5 key={i} className="error-message">{errorMessages[i]}</h5>);
    }

    return errors;
}

/******************************Exports**************************** */
export default NewPoll;