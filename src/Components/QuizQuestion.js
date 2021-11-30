
/*************************Imports*********************** */
import {useSelector} from "react-redux";
import { useParams } from "react-router";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import { useState } from "react";

/*************************Variables*********************** */

/*************************Components*********************** */
function QuizQuestion()
{
    const quizDetails = useSelector((state) => state.quizDetails);
    const [choices, setChoices] = useState({}); //Object to keep track of the options selected for each question
    const [questionId, setQuestionId] = useState(0); //The id of the currently displayed question
    const [modalStatus, setModalStatus] = useState(true); //Indicates whether the modal for confirmation if not all questions are answered, is to be displayed
    console.log(choices)
    
    return(
        <div id="quiz-questions" className="background flexible-column" style={{justifyContent: "space-around"}}>
            <div id="quiz-titlebox">
                <div style={{width: "100%"}}>
                    <button style={{float: "left"}}>Home</button>
                    <button style={{float: "right"}}>Share</button>
                </div>
                <h2>{quizDetails.title}</h2>
                <h3 style={{marginTop: "20px"}}>Question: {`${questionId+1}/${quizDetails.questions.length}`}</h3>
                <button style={{marginTop: "15px"}} onClick={() => submitQuiz(choices, quizDetails)}>Submit Quiz</button>
            </div>

            <div className="questions">
                <div className="new-question-box">
                    <h1>{quizDetails.questions[questionId].text}</h1>
                    <div style={{marginTop: "20px", width: "100%", overflow: "auto"}}>
                        {quizDetails.questions[questionId].options.map((opt) => <QuestionOption option={opt} questionId={questionId} choices={choices} setChoices={setChoices}/>)}
                    </div>
                </div>

                <div id="left-arrow" onClick={() => setQuestionId(Math.max(0, questionId-1))}> <FaChevronLeft /> </div>
                <div id="right-arrow" onClick={() => setQuestionId((questionId + 1) % quizDetails.questions.length)}> <FaChevronRight /> </div>

            </div>

            {(() => modalStatus ? <Modal/> : "")()}
        </div>
    );
}

function QuestionOption(props)
{
    const selectOption = () => {
        //Creating the new state
        const newState = {...props.choices};
        newState[props.questionId] = props.option.id; 

        //Updating the state
        props.setChoices(newState);

    }; //Marks the option as selected for the current question
    
    return (<div className={props.choices[props.questionId] !== props.option.id ? "quiz-option" : "quiz-option quiz-option-selected"} key={props.option.id} onClick={selectOption}>
            <h3>{props.option.text}</h3>
        </div>)
}

function Modal(props)
{
    return(
        <div className="modal-background">
            <div id="submission-confirmation-box">
                <div id="submission-titlebar">
                    <h3 style={{flexBasis: "90%", flexGrow: 2, textAlign: "center"}}>Submit Quiz</h3>
                    <button style={{flexBasis: "10%", flexGrow: 1}}>Close</button>
                </div>
            </div>
        </div>
    );
}


/*************************Functions*********************** */
function submitQuiz(choices, quizDetails)
{
    /*Submits the user's quiz answers*/
    
    //Checking if the user has answered all questions
    if(Object.keys(choices).length !== quizDetails.questions.length)
    {
        
    }

}

/*************************Exports*********************** */
export default QuizQuestion;

/*
 {quizDetails.questions[questionId].options.map((opt) => <QuestionOption option={opt}/>)}
*/