
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
        initialized: false,
        profilePic: "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg",
        polls : []
    },
    reducers: {
        setUserDetails: setDetails,
        setProfilePicture : setProfilePicUrl,
        setPolls : setUserPolls
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
    if(payload.profilePicUrl)
        state.profilePic = payload.profilePicUrl;
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

/**********************Exports****************** */
export const {setUserDetails, setProfilePicture, setPolls} = userDetailsSlice.actions;
export default userDetailsSlice.reducer;