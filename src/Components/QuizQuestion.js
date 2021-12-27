
/*************************Imports*********************** */
import {useSelector, useDispatch} from "react-redux";
import { setGuestResults } from "../Redux/Slices/GuestQuizResultsSlice";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import { useState } from "react";
import { apiBaseUrl, authStatus } from "../Config/Config";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { redirectToHome } from "../Services/Services";
import { copyShareableLink } from "./Poll";
import { useParams } from "react-router-dom";

/*************************Variables*********************** */
const getQuizResultsUrl = `${apiBaseUrl}/content/submitquiz`; //The api url to get quiz results for logged user
const getGuestQuizResultsUrl = `${apiBaseUrl}/content/getquizresults/guest`; //The api url to get the quiz results for guest user
let dispatch = null; //The dispatch object to be used to save guest quiz results
let history = null; //The history object to be used traversal

/*************************Components*********************** */
function QuizQuestion()
{
    const quizDetails = useSelector((state) => state.quizDetails);
    const [choices, setChoices] = useState({}); //Object to keep track of the options selected for each question
    const [questionId, setQuestionId] = useState(0); //The id of the currently displayed question
    const [modalStatus, setModalStatus] = useState(false); //Indicates whether the modal for confirmation if not all questions are answered, is to be displayed
    dispatch = useDispatch();
    history = useHistory();

    //Checking if quiz has been loaded
    const quizId = useParams().quizId;
    if(!quizDetails.quizId)
    {
        history.replace(`/quiz/${quizId}`);
        return null;
    }

    return(
        <div id="quiz-questions" className="background flexible-column" style={{justifyContent: "space-around"}}>
            <div id="quiz-titlebox">
                <div style={{width: "100%"}}>
                    <button style={{float: "left"}} onClick={() => redirectToHome(history, true)}>Home</button>
                    <button style={{float: "right"}} onClick={() => copyShareableLink()}>Share</button>
                </div>
                <h2>{quizDetails.title}</h2>
                <h3 style={{marginTop: "20px"}}>Question: {`${questionId+1}/${quizDetails.questions.length}`}</h3>
                <button style={{marginTop: "15px"}} onClick={() => submitQuiz(choices, quizDetails, setModalStatus)}>Submit Quiz</button>
            </div>

            <div className="questions">
                <div className="new-question-box">
                    <h1>{quizDetails.questions[questionId].text}</h1>
                    <div style={{marginTop: "20px", width: "100%", overflow: "auto"}}>
                        {quizDetails.questions[questionId].options.map((opt) => <QuestionOption option={opt} questionId={questionId} 
                        isMcq={quizDetails.questions[questionId].isMcq} choices={choices} setChoices={setChoices}/>)}
                    </div>
                </div>

                <div id="left-arrow" onClick={() => setQuestionId(Math.max(0, questionId-1))}> <FaChevronLeft /> </div>
                <div id="right-arrow" onClick={() => setQuestionId((questionId + 1) % quizDetails.questions.length)}> <FaChevronRight /> </div>

            </div>

            {(() => modalStatus ? <Modal setModalStatus={setModalStatus} choices={choices} quizId={quizDetails.quizId}/> : "")()}
        </div>
    );
}

function QuestionOption(props)
{
    const selectOption = () => {
        //Creating the new state
        const newState = {};
        for(const question in props.choices)
        {
            newState[question] = props.choices[question].map((choice) => choice);
        }
        if(props.isMcq)
        {
            if(!props.choices[props.questionId])
                newState[props.questionId] = [props.option.id];
            else
            {
                if(!newState[props.questionId].includes(props.option.id))
                    newState[props.questionId].push(props.option.id);
                else
                    newState[props.questionId].splice(newState[props.questionId].indexOf(props.option.id),1);
            }
        }
        else
        {
            if(!props.choices[props.questionId])
                newState[props.questionId] = [props.option.id];
            else
                newState[props.questionId][0] = props.choices[props.questionId][0] === props.option.id ? -1 : props.option.id;
        }

        //Updating the state
        props.setChoices(newState);

    }; //Marks the option as selected for the current question
    
    return (<div className={props.choices[props.questionId] && props.choices[props.questionId].includes(props.option.id) ? 
        "quiz-option quiz-option-selected" : "quiz-option"} key={props.option.id} onClick={selectOption}>
            <h3>{props.option.text}</h3>
        </div>)
}

function Modal(props)
{
    const sbmtQuiz = () => {
        getQuizResults(props.choices, props.quizId);
    }; //Submits the quiz if the user clicks on submit
    
    return(
        <div className="modal-background">
            <div id="submission-confirmation-box">
                <div id="submission-titlebar">
                    <h3 style={{flexBasis: "90%", flexGrow: 2, textAlign: "center"}}>Submit Quiz</h3>
                    <button style={{flexBasis: "10%", flexGrow: 1}} onClick={() => props.setModalStatus(false)}>Close</button>
                </div>
                <div id="submission-msg">
                    <h2 style={{textAlign: "center"}}>You have not answered all questions.<br/>Are you sure you want to submit quiz ?</h2>
                    <button onClick={sbmtQuiz}>Submit</button>
                </div>
            </div>
        </div>
    );
}


/*************************Functions*********************** */
function submitQuiz(choices, quizDetails, setModalStatus)
{
    /*Submits the user's quiz answers*/
    
    //Checking if the user has answered all questions
    if(Object.keys(choices).length !== quizDetails.questions.length)
        setModalStatus(true);
    else
        getQuizResults(choices, quizDetails.quizId);
}

function getQuizResults(selected, quizId)
{   
    /*Gets the quiz results */

    //Creating the user choices object
    const userChoices = {quizId: quizId, choices: []};
    for(const question in selected)
    {
        userChoices.choices.push({questionId: question, optionIds: selected[question]});
    }

    const isGuest = sessionStorage.getItem("authStatus") !== authStatus.logged;
    const requestUrl = (!isGuest ? getQuizResultsUrl : getGuestQuizResultsUrl);
    fetch(requestUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({userChoices})
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw Error(resp.status);
        return resp.json();
    })
    .then((data) => {
        if(!data.success)
            throw Error(data.code);
        
        console.log(data.guestResults)
        if(isGuest)
            dispatch(setGuestResults(data.guestResults));
        
        history.replace(`/results/${userChoices.quizId}`);
    })
    .catch((err) => {
        console.log(err);
        toast("Failed to submit quiz. Try again!");
    })

}

/*************************Exports*********************** */
export default QuizQuestion;