
/************************Imports************************* */
import { createSlice } from "@reduxjs/toolkit";

/*************************Slice************************** */
const quizDetailsSlice = createSlice({
    name: "Quiz",
    initialState: {
        quizId: undefined,
        title: "",
        questions: [],
        creator: "",
        totalScore: 0
    },
    reducers: {
        updateQuizState: updateState,
        resetQuizState: resetState
    }
})

/************************Functions************************* */
function updateState(state, action)
{
    /*Updates the quiz state*/

    const newState = action.payload;
    if(newState.quizId)
        state.quizId = newState.quizId;
    if(newState.title)
        state.title = newState.title;
    if(newState.questions)
        state.questions = newState.questions;
    if(newState.creator)
        state.creator = newState.creator;
    if(newState.totalScore)
        state.totalScore = newState.totalScore;
}

function resetState(state, action)
{
    /*Resets the quiz state to the initial state*/

    state.quizId = undefined;
    state.title = "";
    state.questions= [];
    state.creator = "";
    state.score = 0;
}

/************************Exports************************* */
export const {updateQuizState, resetQuizState} = quizDetailsSlice.actions;
export default quizDetailsSlice.reducer;