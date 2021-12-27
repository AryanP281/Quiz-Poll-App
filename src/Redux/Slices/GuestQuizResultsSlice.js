/**********************Imports****************** */
import { createSlice } from "@reduxjs/toolkit";

/**********************Slice****************** */
const guestQuizResultsSlice = createSlice({
    name: "guestQuizResults",
    initialState: {
        quizId: undefined,
        score: 0,
        totalScore:0,
        title: "",
        questions: []
    },
    reducers: {
        setGuestResults: setResults
    }
})

/************************Functions************************* */
function setResults(state, action)
{
    /*Sets the guest quiz results*/

    const guestResults = action.payload;

    state.quizId = guestResults.quizId;
    state.score = guestResults.score;
    state.totalScore = guestResults.totalScore;
    state.title = guestResults.title;
    state.questions = guestResults.questions;
}

/************************Exports************************* */
export const {setGuestResults} = guestQuizResultsSlice.actions;
export default guestQuizResultsSlice.reducer;