
/**********************Imports****************** */
import { configureStore } from "@reduxjs/toolkit";
import UserDetailsReducer from "./Slices/UserDetailsSlice";
import NewQuizReducer from "./Slices/NewQuizSlice";

/**********************Variables****************** */
const store = configureStore({
    reducer: {
        userDetails : UserDetailsReducer,
        newQuizDetails: NewQuizReducer
    }
})

/**********************Exports****************** */
export default store;