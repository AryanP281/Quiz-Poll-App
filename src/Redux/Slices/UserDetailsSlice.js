
/**********************Imports****************** */
import { createSlice } from "@reduxjs/toolkit";

/**********************Slice****************** */
const userDetailsSlice = createSlice({
    name: "UserDetails", 
    initialState: {
        username: "",
        bdate: {day: 1, month: 0, year: 2000},
        initialized: false,
        profilePic: null,
        polls : []
    },
    reducers: {
        setUserDetails: setDetails,
        setProfilePicture : setProfilePicUrl,
        setPolls : setUserPolls,
        resetDetails: resetUserDetails
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
    state.bdate = {day: payload.bdate.day ? payload.bdate.day : 1, month: payload.bdate.month ? payload.bdate.month : 0, year: payload.bdate.year ? payload.bdate.year : 2001};
    state.initialized = true;
    if(payload.profilePicUrl)
        state.profilePic = payload.profilePicUrl;
    console.log(payload)
}

function setProfilePicUrl(state, action)
{
    /*Updates the user profile picture Url*/

    state.profilePic = action.payload.profilePicUrl;
}

function setUserPolls(state, action)
{
    /*Saves the information about the polls created by the user */

    //Clearing the previous user polls
    state.polls.splice(0, state.polls.length);

    //Adding the new polls
    action.payload.userPolls.forEach((poll) => state.polls.push(poll));
}

function resetUserDetails(state)
{
    /*Resets the user details*/ 

    const resetState = {
        username: "",
        bdate: {day: 1, month: 0, year: 2000},
        followers: 0,
        following: 0,
        initialized: false,
        profilePic: null,
        polls : []
    };

    return resetState;
}

/**********************Exports****************** */
export const {setUserDetails, setProfilePicture, setPolls, setAuthStatus, resetDetails} = userDetailsSlice.actions;
export default userDetailsSlice.reducer;