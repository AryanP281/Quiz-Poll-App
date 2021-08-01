
/**********************Imports****************** */
import { configureStore } from "@reduxjs/toolkit";
import UserDetailsReducer from "./Slices/UserDetailsSlice";

/**********************Variables****************** */
const store = configureStore({
    reducer: {
        userDetails : UserDetailsReducer 
    }
})

/**********************Exports****************** */
export default store;