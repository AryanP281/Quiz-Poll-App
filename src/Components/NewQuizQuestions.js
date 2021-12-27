
/********************************Import*************************** */
import { useDispatch, useSelector } from "react-redux";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa"
import { FcAddRow, FcDeleteRow, FcDeleteDatabase } from "react-icons/fc";
import { useState } from "react";
import { addQuestion, updateQuizQuestion, deleteQuizQuestion } from "../Redux/Slices/NewQuizSlice";
import { apiBaseUrl } from "../Config/Config";
import { useHistory } from "react-router";
import toast from "react-hot-toast";

/********************************Variables*************************** */
const createQuizApiUrl = `${apiBaseUrl}/content/createquiz`; //The api url to save the quiz
let quizCreationSemaphore = false; //Prevents multiple copies of the same quiz from being created

/********************************Component*************************** */
function NewQuizQuestions()
{
    const newQuizDetails = useSelector((state) => state.newQuizDetails);
    const dispatch = useDispatch();
    const [currQuestionIndex, setCurrQuestionIndex] = useState(0); //The index of the currently displayed question
    const history = useHistory();

    return (
        <div className="new-quiz-questions">
            <div id="titlebar">
                <h2>{newQuizDetails.title}</h2>
                <div style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
                    <h3>Questions: {newQuizDetails.questions.length}</h3>
                    <button className="create-btn" onClick={() => createQuiz(newQuizDetails, history)}>Save Quiz</button>
                    <h3>Total Score: {newQuizDetails.totalScore}</h3>
                </div>
            </div>

            <div className="questions">
                <div className="new-question-box">
                    <div style={{height: "10%"}}>
                        <h3 style={{float: "left"}}>{currQuestionIndex+1} .</h3>
                        <button style={{float: "right"}} onClick={() => deleteQuestion(newQuizDetails.questions.length, currQuestionIndex, dispatch, setCurrQuestionIndex)}><FcDeleteDatabase size="30px"/></button>
                    </div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input className="textbox" type="text" placeholder="Enter question" 
                        value={newQuizDetails.questions[currQuestionIndex].text}
                        onChange={(e) => changeQuestionText(newQuizDetails, currQuestionIndex, dispatch, e.target.value)}/>
                        {newQuizDetails.questions[currQuestionIndex].options.map((option) => <OptionCard currQuestionIndex={currQuestionIndex} option={option} newQuizDetails={newQuizDetails} dispatch={dispatch}/>)}
                        <button style={{marginTop: "20px"}} onClick={() => addNewOption(newQuizDetails, dispatch, currQuestionIndex)}> <FcAddRow size={40}/> </button>
                    </form>
                </div>
                <div id="left-arrow" onClick={() => setCurrQuestionIndex(Math.max(0, currQuestionIndex-1))}> <FaChevronLeft /> </div>
                
                <div id="right-arrow" onClick={() => {
                    if(currQuestionIndex === newQuizDetails.questions.length - 1)
                        dispatch(addQuestion({text: "", options: []}))
                    setCurrQuestionIndex(currQuestionIndex+1);
                }}> <FaChevronRight /> </div>
            </div>
        </div>
    );
}

function OptionCard(props)
{
    const currQuestionIndex = props.currQuestionIndex;
    
    const updateOption = (changes) => {
        //Creating the new state
        const updatedQuestion = {...props.newQuizDetails.questions[currQuestionIndex]};
        updatedQuestion.options = [];
        for(let i = 0; i < props.newQuizDetails.questions[currQuestionIndex].options.length; ++i)
        {
            updatedQuestion.options.push({...props.newQuizDetails.questions[currQuestionIndex].options[i]})
            if(updatedQuestion.options[i].id === props.option.id)
            {
                if(changes.isAns !== undefined)
                    updatedQuestion.options[i].isAns = changes.isAns;
                if(changes.text !== undefined)
                    updatedQuestion.options[i].text = changes.text;
            }
        }

        //Updating the state
        props.dispatch(updateQuizQuestion({questionIndex: currQuestionIndex, question: updatedQuestion}));
    };

    const deleteOption = () => {
        //Creating the new state
        const updatedQuestion = {...props.newQuizDetails.questions[currQuestionIndex]};
        updatedQuestion.options = [];
        for(let i = 0; i < props.newQuizDetails.questions[currQuestionIndex].options.length; ++i)
        {
            if(props.newQuizDetails.questions[currQuestionIndex].options[i].id !== props.option.id)
                updatedQuestion.options.push({...props.newQuizDetails.questions[currQuestionIndex].options[i]})
        }

        //Updating the state
        props.dispatch(updateQuizQuestion({questionIndex: currQuestionIndex, question: updatedQuestion}));
    };

    return (
        <div className="option-card" key={props.option.id}>
            <label>Is Answer: </label>
            <input className="option-is-answer" type="checkbox" checked={props.option.isAns} onChange={() => updateOption({isAns: !props.option.isAns})} />
            <input style={{flexBasis: "70%", flexGrow: 1}} className="textbox" type="text" placeholder="Enter Option" 
            value={props.option.text} onChange={(e) => updateOption({text: e.target.value})}/>
            <button onClick={deleteOption}><FcDeleteRow size="30px"/></button>
        </div>
    );
}

/********************************Function*************************** */
function addNewOption(newQuizDetails, dispatch, currQuestionIndex)
{
    /*Adds a new option to the current question */

    console.log(newQuizDetails.questions[currQuestionIndex])

    //Creating the new state
    const updatedQuestion = {...newQuizDetails.questions[currQuestionIndex]};
    updatedQuestion.options = newQuizDetails.questions[currQuestionIndex].options.map((option) => option);  //Creating copy of options
    updatedQuestion.options.push({id: updatedQuestion.options.length, text: "", isAns: false});

    //Updating the state
    dispatch(updateQuizQuestion({questionIndex : currQuestionIndex, question: updatedQuestion}))
}

function changeQuestionText(newQuizDetails, currQuestionIndex, dispatch, newText)
{
    /*Updates the question text */

    //Creating the new state
    const updatedQuestion = {...newQuizDetails.questions[currQuestionIndex]};
    updatedQuestion.text = newText;

    //Updating the state
    dispatch(updateQuizQuestion({questionIndex: currQuestionIndex, question: updatedQuestion}));
}

function deleteQuestion(questionsCount, currQuestionIndex, dispatch, setCurrQuestionIndex)
{
    /*Deletes the given question */

    //Deleting the question
    dispatch(deleteQuizQuestion({questionIndex: currQuestionIndex}))

    //Updating the question index
    if(questionsCount === 1)
       dispatch(addQuestion({text: "", options: []})); //Adding a new blank question
    setCurrQuestionIndex(Math.max(0, currQuestionIndex-1));    
}

function createQuiz(newQuizDetails, history)
{
    /*Validates and sends api request to create the new quiz */

    //Checking if quiz creation request has already been sent
    if(quizCreationSemaphore)
        return;

    //Cleaning the quiz before creating request
    const cleanedQuiz = cleanQuiz(newQuizDetails);

    quizCreationSemaphore = true; //Setting the semaphore
    if(validateQuiz(cleanedQuiz))
    {
        console.log("Sending request")
        //Sending request to create quiz
        fetch(createQuizApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({quizDetails: cleanedQuiz})
        })
        .then((resp) => {
            if(resp.status !== 200)
                throw Error(resp.status);
            return resp.json();
        })
        .then((data) => {
            console.log(data)
            if(!data.success)
            {
                switch(data.code)
                {
                    case 5 : history.replace("/signin"); break;
                    case 7 : throw Error(data.code); break;
                }
                return;
            }

            toast("Quiz created successfully");
            history.replace(`/quiz/${data.quizId}`); //Redirecting to the quiz page
        })
        .catch((err) => {
            console.log(err);
            toast("Failed to create quiz");
        })
        .finally(() => quizCreationSemaphore = false);

    }

}

function validateQuiz(newQuizDetails)
{
    /*Checks if the quiz format is correct */

    if(newQuizDetails.totalScore % newQuizDetails.questions.length)
    {
        toast("The total score of the quiz should be divisible by the number of questions");
        return false;
    }

    const pointsPerQuestion = newQuizDetails.totalScore / newQuizDetails.questions.length;
    for(let i = 0; i < newQuizDetails.questions.length; ++i)
    {
        const solsCount = newQuizDetails.questions[i].options.filter((opt) => opt.isAns).length;
        console.log(solsCount)
        if(pointsPerQuestion % solsCount)
        {
            toast(`The number of solutions to Question ${i+1} should be a factor of ${pointsPerQuestion}`);
            return false;
        }
    }

    return true;
}

function cleanQuiz(newQuizDetails)
{
    /*Gets rid of empty questions and options*/

    const cleanedQuiz = {...newQuizDetails};
    cleanedQuiz.title = cleanedQuiz.title.trim();
    if(cleanedQuiz.title.length === 0)
    {
        toast("Quiz name cannot be empty");
        return null;
    }

    cleanedQuiz.questions = [];
    for(let i = 0; i < newQuizDetails.questions.length; ++i)
    {
        const questionTitle = newQuizDetails.questions[i].text.trim();
        if(questionTitle.length === 0 || newQuizDetails.questions[i].options.length === 0)
            continue;

        const questionOptions = [];
        for(let j = 0; j < newQuizDetails.questions[i].options.length; ++j)
        {
            const optionTitle = newQuizDetails.questions[i].options[j].text.trim();
            if(optionTitle.length === 0)
                continue;
            
            questionOptions.push({text: optionTitle, isAns: newQuizDetails.questions[i].options[j].isAns});
        }

        if(questionOptions.length)
            cleanedQuiz.questions.push({text: questionTitle, options: questionOptions});
        
    }

    return cleanedQuiz;
}

/********************************Export*************************** */
export default NewQuizQuestions;
export {createQuiz};

