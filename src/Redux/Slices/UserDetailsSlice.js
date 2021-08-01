
/**********************Imports****************** */
import { createSlice } from "@reduxjs/toolkit";

/**********************Slice****************** */
const userDetailsSlice = createSlice({
    name: "UserDetails", 
    initialState: {
        username: "",
        bdate: {day: 1, month: 0, year: 2000},
        followers: 0,
        following: 0,
        initialized: false
    },
    reducers: {
        setUserDetails: setDetails
    }
})

/**********************Functions****************** */
function setDetails(state, action)
{
    /*Sets the user details state */

    //Getting the action payload
    const payload = action.payload;

    //Setting the user details
    state.username = payload.username;
    state.bdate = {day: payload.bdate.day, month: payload.bdate.month, year: payload.bdate.year};
    state.followers = payload.followers;
    state.following = payload.following;
    state.initialized = true;
}

/**********************Exports****************** */
export const {setUserDetails} = userDetailsSlice.actions;
export default userDetailsSlice.reducer;