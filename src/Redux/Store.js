
/**********************Imports****************** */
import { configureStore } from "@reduxjs/toolkit";
import UserDetailsReducer from "./Slices/UserDetailsSlice";
import NewQuizReducer from "./Slices/NewQuizSlice";
import QuizDetailsReducer from "./Slices/QuizSlice";

/**********************Variables****************** */
const store = configureStore({
    reducer: {
        userDetails : UserDetailsReducer,
        newQuizDetails: NewQuizReducer,
        quizDetails: QuizDetailsReducer
    }
})

/**********************Exports****************** */
export default store;