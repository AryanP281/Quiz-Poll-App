
/**********************Imports****************** */
import { configureStore } from "@reduxjs/toolkit";
import UserDetailsReducer from "./Slices/UserDetailsSlice";
import NewQuizReducer from "./Slices/NewQuizSlice";
import QuizDetailsReducer from "./Slices/QuizSlice";
import GuestQuizResultsSlice from "./Slices/GuestQuizResultsSlice";

/**********************Variables****************** */
const store = configureStore({
    reducer: {
        userDetails : UserDetailsReducer,
        newQuizDetails: NewQuizReducer,
        quizDetails: QuizDetailsReducer,
        guestQuizResults: GuestQuizResultsSlice
    }
})

/**********************Exports****************** */
export default store;