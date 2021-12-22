/**********************Imports****************** */
import { createSlice } from "@reduxjs/toolkit";

/**********************Slice****************** */
const guestQuizResultsSlice = createSlice({
    name: "guestQuizResults",
    initialState: {
        quizId: undefined,
        score: 0,
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
    state.questions = guestResults.questions;
}

/************************Exports************************* */
export const {setGuestResults} = guestQuizResultsSlice.actions;
export default guestQuizResultsSlice.reducer;