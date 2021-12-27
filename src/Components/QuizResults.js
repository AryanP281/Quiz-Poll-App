
/***********************Imports********************** */
import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import { FcCheckmark, FcCancel } from "react-icons/fc";
import { useSelector } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import {apiBaseUrl} from "../Config/Config";
import { redirectToHome } from "../Services/Services";

/**********************Variables******************* */
const userResultsApiBaseUrl = `${apiBaseUrl}/content/getquizresults`; //The api url to get the user quiz results
let history = null;

/**********************Components******************** */
function QuizResults()
{
    history = useHistory();
    const quizId = useParams().quizId; //Getting the quiz id from the url parameter
    const resultType = sessionStorage.getItem("authStatus") === null ? 0 : 1; //Getting the user auth status
    const results = [useSelector((state) => state.guestQuizResults), ...useState({})]; //Results[0] if guest else results[1]
    const quizLoaded = results[resultType].quizId; //Checking if the correct quiz details have been loaded
    const [questionId,setQuestionId] = useState(0); //The id of the currently displayed question
    

    useEffect(() => {
        if(resultType == 1)
            loadUserResults(quizId, results[2]);
        else
        {
            if(!results[0].quizId)
                history.replace("/signin");
        }

    }, []);
    
    return !quizLoaded ? (<div></div>) : (<div id="quiz-questions" className="background flexible-column" style={{justifyContent: "space-around"}}>
        <div id="quiz-titlebox">
            <div style={{width: "100%"}}>
                <button style={{float: "left"}} onClick={() => redirectToHome(history, true)}>Home</button>
            </div>
            <h2>{results[resultType].title}</h2>
            <h3 style={{marginTop: "20px"}}>Total Score: {results[resultType].totalScore}</h3>
            <h3 style={{marginTop: "20px"}}>Your Score: {results[resultType].score}</h3>
        </div>

        <div className="questions">
            <div className="new-question-box">
                <h1>{results[resultType].questions[questionId].text}</h1>
                <div style={{marginTop: "20px", width: "100%", overflow: "auto"}}>
                    {results[resultType].questions[questionId].options.map((opt) => <QuestionOption option={opt} questionId={questionId}/>)}
                </div>
            </div>

            <div id="left-arrow" onClick={() => setQuestionId(Math.max(0, questionId-1))}> <FaChevronLeft /> </div>
            <div id="right-arrow" onClick={() => setQuestionId((questionId + 1) % results[resultType].questions.length)}> <FaChevronRight /> </div> 
        </div>
    </div>);
}

function QuestionOption(props)
{
    const optionStyle = {};
    if(props.option.isAns && props.option.marked)
        optionStyle.border = "4px solid lime";
    else if(props.option.marked)
        optionStyle.border = "4px solid red";

    return (<div className="quiz-option-static" style={optionStyle} key={props.option.id}>
            <h3>{props.option.text}</h3>
            {props.option.isAns && props.option.marked && <FcCheckmark style={{marginLeft: "20px",justifySelf: "center"}} size={25}/>}
            {props.option.isAns && !props.option.marked && <FcCancel style={{marginLeft: "20px", justifySelf: "center"}} size={25}/>}
            {!props.option.isAns && props.option.marked && <FcCancel style={{marginLeft: "20px", justifySelf: "center"}} size={25}/>}
        </div>)
}

/***********************Functions********************** */
function loadUserResults(quizId, setResults)
{
    /*Loads the user quiz results*/

    fetch(`${userResultsApiBaseUrl}/${quizId}`, {
        method: "GET",
        credentials: "include"
    })
    .then((resp) => {
        if(resp.status !== 200)
            throw new Error(resp.status);
        return resp.json();
    })
    .then((data) => {
        if(!data.success)
        {
            if(data.code === 10)
            {
                toast("Quiz not played");
                history.replace(`/quiz/${quizId}`);
            }
            else
                throw new Error(data.code);
        }
        setResults(data.userResults);
    })
    .catch((err) => {
        console.log(err);
        toast("Failed to load results. Try again!");
    });
}

/***********************Exports********************** */
export default QuizResults;