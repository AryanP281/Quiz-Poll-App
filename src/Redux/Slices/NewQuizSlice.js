/**********************Imports****************** */
import { createSlice } from "@reduxjs/toolkit";

/**********************Slice****************** */
const newQuizSlice = createSlice({
    name: "NewQuiz",
    initialState: {
        title: "",
        questions: [{text: "", options: []}],
        totalScore: 0
    },
    reducers: {
        setTitle: setNewQuizTitle,
        setTotalScore: setNewQuizTotalScore,
        updateNewQuizState : updateState,
        addQuestion : addNewQuestion,
        updateQuizQuestion : updateQuestion,
        deleteQuizQuestion: deleteQuestion
    }
});

/**********************Functions************** */
function setNewQuizTitle(state, action) 
{
    /*Sets the title for the new quiz to be created*/

    state.title = action.payload;
}

function setNewQuizTotalScore(state, action)
{
    /*Sets the total score for the quiz */

    state.totalScore = action.payload;
}

function updateState(state, action) 
{
    /*Updates the state of the quiz */

    //Getting the new state
    const newState = action.payload;

    //Updating the quiz title
    if(newState.title)
        state.title = newState.title;

    //Updating the quiz score
    if(newState.totalScore)
        state.totalScore = newState.totalScore;

    //Updating the questions
    if(newState.questions)
        state.questions = newState.questions;
}

function addNewQuestion(state, action)
{
    /*Adds a new question to the quiz*/
    
    state.questions.push(action.payload);
}

function updateQuestion(state, action)
{
    /*Updates the given quiz question */

    state.questions[action.payload.questionIndex] = action.payload.question;
}

function deleteQuestion(state, action)
{
    /*Deletes the given quiz question */

    state.questions.splice(action.payload.questionIndex, 1); //Deleting the question
}


/**********************Export************** */
export const {setTitle, setTotalScore, updateNewQuizState, addQuestion, updateQuizQuestion, deleteQuizQuestion} = newQuizSlice.actions;
export default newQuizSlice.reducer;